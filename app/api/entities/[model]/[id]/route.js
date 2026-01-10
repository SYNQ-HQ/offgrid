import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  const { model, id } = await params;
  const prismaModel = model.charAt(0).toLowerCase() + model.slice(1);
  
  if (!prisma[prismaModel]) {
    return NextResponse.json({ error: "Invalid model" }, { status: 400 });
  }

  const body = await request.json();

  try {
    const data = await prisma[prismaModel].update({
      where: { id },
      data: body,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { model, id } = await params;
  const prismaModel = model.charAt(0).toLowerCase() + model.slice(1);

  if (!prisma[prismaModel]) {
    return NextResponse.json({ error: "Invalid model" }, { status: 400 });
  }

  try {
    await prisma[prismaModel].delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}