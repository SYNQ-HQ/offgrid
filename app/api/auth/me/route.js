import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(null);
    }

    // Fetch fresh user data from DB to ensure role/details are up to date
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(null);
    }

    // Map 'name' to 'full_name' if the frontend expects it
    return NextResponse.json({
      ...user,
      full_name: user.name,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(null, { status: 500 });
  }
}