import dbConnect from "../../../../lib/dbConnect";
import Log from "../../../../models/Log";
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
  const isAdmin = await checkAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  await dbConnect();
  
  try {
    const user = await User.findById(userId, 'name email role status');
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const skip = (page - 1) * limit;
    
    const logs = await Log.find({ userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Log.countDocuments({ userId });
    
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivity = await Log.aggregate([
      { $match: { userId, timestamp: { $gte: oneDayAgo } } },
      { $group: { _id: "$action", count: { $sum: 1 } } }
    ]);
    
    const activityStats = {
      total,
      last24Hours: recentActivity.reduce((sum, item) => sum + item.count, 0),
      byType: Object.fromEntries(recentActivity.map(item => [item._id, item.count]))
    };
      
    return NextResponse.json({
      user,
      logs,
      stats: activityStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}