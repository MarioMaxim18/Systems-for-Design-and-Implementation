import bcrypt from "bcryptjs";
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const { name, email, password } = await req.json();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword
  });

  return NextResponse.json({ message: "User registered", userId: newUser._id });
}