import { NextResponse } from "next/server";
import { currentUser } from "@/server/auth/session";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { name: `${user.firstName} ${user.lastName}`.trim(), email: user.email, initials: `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase() } });
}
