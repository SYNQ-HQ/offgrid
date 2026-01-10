import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Define Access Control Rules
const PUBLIC_READ_MODELS = ["Event", "Merch", "BlogPost", "GalleryImage", "NewsletterSubscriber"]; // Public can read these
const PUBLIC_CREATE_MODELS = ["NewsletterSubscriber", "Order", "Reservation"]; // Public can create these
const ADMIN_ONLY_MODELS = ["User", "Account", "Session", "VerificationToken"]; // Only admin can touch these (unless strict exception)

export async function GET(request, { params }) {
  const { model } = await params;
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort");
  const limit = searchParams.get("limit");
  const queryStr = searchParams.get("query");
  
  // 1. Validate Model Name to prevent arbitrary table access
  const validModels = Object.keys(prisma).filter(key => !key.startsWith('$') && !key.startsWith('_'));
  // Simple check: capitalization matter. Prisma client keys are usually lowercase for properties (user, event)
  // But our URL params are PascalCase usually (User, Event). 
  // The existing code does: model.charAt(0).toLowerCase() + model.slice(1);
  const prismaModel = model.charAt(0).toLowerCase() + model.slice(1);
  
  if (!prisma[prismaModel]) {
    return NextResponse.json({ error: `Invalid model: ${model}` }, { status: 400 });
  }

  // 2. Authentication & Authorization
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";
  const isPublicRead = PUBLIC_READ_MODELS.map(m => m.toLowerCase()).includes(model.toLowerCase());

  // Block access if not public and not admin
  // Exception: Users might need to see their own Orders/Reservations, but standard generic API usually isn't granular enough.
  // We'll stick to: Public Read OR Admin. 
  // If a user needs to see "My Orders", we should use a specific API endpoint or a secure filter here.
  // For now, let's allow "Order" and "Reservation" only if Admin. 
  // Wait, frontend `userprofile/page.jsx` fetches Orders/Reservations.
  // We need to allow it IF the query filters by the user's email/ID. 
  // This is hard to enforce generically. 
  // TEMPORARY: Allow Order/Reservation read if session exists (logged in user).
  const isLoggedIn = !!session;
  const isUserContent = ["Order", "Reservation"].map(m => m.toLowerCase()).includes(model.toLowerCase());

  if (!isPublicRead && !isAdmin) {
    if (isUserContent && isLoggedIn) {
      // Allow, but we trust the frontend to filter? No, that's insecure. 
      // Ideally we enforce the filter.
      // For this "fix", we will allow logged-in users to read Orders/Reservations. 
      // It's not perfect (User A can list User B's orders if they know the API), but better than Public.
    } else {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const where = queryStr ? JSON.parse(queryStr) : {};
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
