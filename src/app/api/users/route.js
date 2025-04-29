import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const users = await User.find();
  return NextResponse.json(users);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const user = await User.create(body);
  return NextResponse.json(user, { status: 201 });
}