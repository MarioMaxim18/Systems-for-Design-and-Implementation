import bcrypt from "bcryptjs";
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  return NextResponse.json({ message: "Login successful", userId: user._id, name: user.name });
}