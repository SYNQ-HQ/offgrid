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
  const page = searchParams.get("page");
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
      const userEmail = session.user.email;
      
      if (model.toLowerCase() === "order") {
        where.customer_email = userEmail; 
      } else if (model.toLowerCase() === "reservation") {
        where.email = userEmail;
      } else {
        return NextResponse.json({ error: "Unauthorized access to this model" }, { status: 403 });
      }
      
    } else {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const take = limit ? parseInt(limit) : undefined;
  const skip = page && take ? (parseInt(page) - 1) * take : undefined;
  
  let orderBy = undefined;
  if (sort) {
    const desc = sort.startsWith("-");
    const field = desc ? sort.substring(1) : sort;
    const actualField = field === "created_date" ? "createdAt" : field;
    orderBy = { [actualField]: desc ? "desc" : "asc" };
  }

  try {
    // If page is provided, we return a paginated response structure
    if (page) {
        const [data, total] = await prisma.$transaction([
            prisma[prismaModel].findMany({
                where,
                take,
                skip,
                orderBy,
            }),
            prisma[prismaModel].count({ where }),
        ]);

        let sanitizedData = data;
        if (model.toLowerCase() === "user") {
            sanitizedData = data.map(user => {
                const { password, ...rest } = user;
                return rest;
            });
        }

        return NextResponse.json({
            data: sanitizedData,
            meta: {
                total,
                page: parseInt(page),
                limit: take,
                totalPages: Math.ceil(total / take)
            }
        });
    }

    // Default legacy behavior (just return array)
    const data = await prisma[prismaModel].findMany({
      where,
      take,
      orderBy,
    });

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