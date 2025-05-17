import dbConnect from "../../../../lib/dbConnect";
import MonitoredUser from "../../../../models/MonitoredUser";
import User from "../../../../models/User";
import { NextResponse } from "next/server";

async function checkAdmin(req) {
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get("adminId");
  
  if (!adminId) {
    return false;
  }
  
  await dbConnect();
  const user = await User.findById(adminId);
  return user && user.role === 'admin';
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get("adminId");
  const isAdmin = await checkAdmin(req);

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const monitoredUsers = await MonitoredUser.find()
      .populate('userId');
    return NextResponse.json(monitoredUsers);
  } catch (error) {
    console.error("Failed to fetch monitored users:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const isAdmin = await checkAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();
  const { userId, action } = body;
}