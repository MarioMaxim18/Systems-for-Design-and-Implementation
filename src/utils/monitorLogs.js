import dbConnect from "../lib/dbConnect.js";
import Log from "../models/Log.js";
import MonitoredUser from "../models/MonitoredUser.js";
import User from "../models/User.js";

export async function monitorLogs({
  timeWindowMs = 60 * 1000, 
  thresholdPerAction = 3
} = {}) {
  await dbConnect();

  const since = new Date(Date.now() - timeWindowMs);

  const suspicious = await Log.aggregate([
    { $match: {
      timestamp: { $gte: since },
      action: { $in: ["CREATE", "UPDATE", "DELETE"] }
    }},
    {
      $group: {
        _id: { userId: "$userId", action: "$action" },
        count: { $sum: 1 }
      }
    },
    {
      $match: {
        count: { $gte: thresholdPerAction }
      }
    }
  ]);

  for (const entry of suspicious) {
    const userId = entry._id.userId;
    const action = entry._id.action;
    const count = entry.count;

    await flagSuspiciousUser(userId, `High frequency of ${action} (${count} in ${timeWindowMs / 1000}s)`);
  }
}

async function flagSuspiciousUser(userId, reason) {
  try {
    const user = await User.findById(userId);
    const userName = user ? user.name : "Unknown";

    await MonitoredUser.updateOne(
      { userId },
      {
        $set: {
          userId,
          flaggedAt: new Date(),
          reason
        }
      },
      { upsert: true }
    );

    console.log(`🚨 Flagged user ${userName} (${userId}) - ${reason}`);
  } catch (err) {
    console.error(`❌ Failed to flag user ${userId}:`, err);
  }
}