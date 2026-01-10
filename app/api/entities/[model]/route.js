import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { model } = await params;
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort");
  const limit = searchParams.get("limit");
  const queryStr = searchParams.get("query");
  
  // Map model name to prisma model (camelCase)
  const prismaModel = model.charAt(0).toLowerCase() + model.slice(1);
  
  if (!prisma[prismaModel]) {
    return NextResponse.json({ error: `Invalid model: ${model}` }, { status: 400 });
  }

  const where = queryStr ? JSON.parse(queryStr) : {};
  const take = limit ? parseInt(limit) : undefined;
  
  let orderBy = undefined;
  if (sort) {
    const desc = sort.startsWith("-");
    const field = desc ? sort.substring(1) : sort;
    // Remap created_date to createdAt if likely intended
    const actualField = field === "created_date" ? "createdAt" : field;
    orderBy = { [actualField]: desc ? "desc" : "asc" };
  }

  try {
    const data = await prisma[prismaModel].findMany({
      where,
      take,
      orderBy,
    });
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

  const body = await request.json();
  try {
    const data = await prisma[prismaModel].create({ data: body });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}