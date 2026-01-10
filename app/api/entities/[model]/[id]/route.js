import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(request, { params }) {
  const { model, id } = await params;
  const prismaModel = model.charAt(0).toLowerCase() + model.slice(1);
  
  if (!prisma[prismaModel]) {
    return NextResponse.json({ error: "Invalid model" }, { status: 400 });
  }

  // Strict Authorization: Admin Only for Generic Updates
  // Exceptions should be handled via specific API routes (like we did for Reservations)
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();

  // Protect User Password update
  if (model.toLowerCase() === "user" && body.password) {
      // If we ever allow admin to update password here, hash it first.
      // But for now, let's just block it to be safe or ensure it's handled elsewhere.
      // Admin might want to reset password. 
      // Assuming they send a raw password, we would need to hash it.
      // Let's block password updates via this generic route to prevent accidents.
      delete body.password;
  }

  try {
    const data = await prisma[prismaModel].update({
      where: { id },
      data: body,
    });
    
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

export async function DELETE(request, { params }) {
  const { model, id } = await params;
  const prismaModel = model.charAt(0).toLowerCase() + model.slice(1);

  if (!prisma[prismaModel]) {
    return NextResponse.json({ error: "Invalid model" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
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
