import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Define Access Control Rules
const PUBLIC_READ_MODELS = ["Event", "Merch", "BlogPost", "GalleryImage", "NewsletterSubscriber"]; // Public can read these
const PUBLIC_CREATE_MODELS = ["NewsletterSubscriber", "Order", "Reservation"]; // Public can create these
const ADMIN_ONLY_MODELS = ["User", "Account", "Session", "VerificationToken"]; // Only admin can touch these

export async function GET(request, { params }) {
  const { model } = await params;
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort");
  const limit = searchParams.get("limit");
  const queryStr = searchParams.get("query");
  
  const prismaModel = model.charAt(0).toLowerCase() + model.slice(1);
  
  if (!prisma[prismaModel]) {
    return NextResponse.json({ error: `Invalid model: ${model}` }, { status: 400 });
  }

  // 2. Authentication & Authorization
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";
  const isPublicRead = PUBLIC_READ_MODELS.map(m => m.toLowerCase()).includes(model.toLowerCase());
  const isLoggedIn = !!session;
  const isUserContent = ["Order", "Reservation"].map(m => m.toLowerCase()).includes(model.toLowerCase());

  // Parse Query
  const where = queryStr ? JSON.parse(queryStr) : {};

  // SECURITY ENFORCEMENT
  if (!isPublicRead && !isAdmin) {
    if (isUserContent && isLoggedIn) {
      // CRITICAL: Force filtering by user email if accessing User Content (Order/Reservation)
      // This prevents User A from seeing User B's orders just by removing the filter in the URL.
      // We assume orders/reservations have an 'email' field or similar linkage.
      // Checking schema: Order has customer_email, Reservation has email.
      
      const userEmail = session.user.email;
      
      // If the query tries to filter by a DIFFERENT email (or no email), we block it or override it.
      // Safer to Override: forcibly add email filter.
      
      if (model.toLowerCase() === "order") {
        where.customer_email = userEmail; 
      } else if (model.toLowerCase() === "reservation") {
        where.email = userEmail;
      } else {
        // Should not happen given isUserContent definition, but safe fallback
        return NextResponse.json({ error: "Unauthorized access to this model" }, { status: 403 });
      }
      
    } else {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const take = limit ? parseInt(limit) : undefined;
  
  let orderBy = undefined;
  if (sort) {
    const desc = sort.startsWith("-");
    const field = desc ? sort.substring(1) : sort;
    const actualField = field === "created_date" ? "createdAt" : field;
    orderBy = { [actualField]: desc ? "desc" : "asc" };
  }

  try {
    const data = await prisma[prismaModel].findMany({
      where,
      take,
      orderBy,
    });

    // 3. Sanitize Sensitive Data
    if (model.toLowerCase() === "user") {
      const sanitized = data.map(user => {
        const { password, ...rest } = user;
        return rest;
      });
      return NextResponse.json(sanitized);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { model } = await params;
  const prismaModel = model.charAt(0).toLowerCase() + model.slice(1);
  if (!prisma[prismaModel]) return NextResponse.json({ error: "Invalid model" }, { status: 400 });

  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";
  const isPublicCreate = PUBLIC_CREATE_MODELS.map(m => m.toLowerCase()).includes(model.toLowerCase());

  if (!isPublicCreate && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  
  // Extra safety: If creating a User, never allow setting 'role' to admin unless you are already admin
  if (model.toLowerCase() === "user" && !isAdmin) {
      return NextResponse.json({ error: "Cannot create user via this endpoint" }, { status: 403 });
  }

  try {
    const data = await prisma[prismaModel].create({ data: body });
    
    // Sanitize response
    if (model.toLowerCase() === "user") {
        const { password, ...rest } = data;
        return NextResponse.json(rest);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}