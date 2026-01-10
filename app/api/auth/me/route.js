import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Implement real auth
  // Return null or mock user
  return NextResponse.json({
    id: "mock-user-id",
    full_name: "Visitor",
    email: "visitor@example.com",
    role: "user" 
  }); 
}
