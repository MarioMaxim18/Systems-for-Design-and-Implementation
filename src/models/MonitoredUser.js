import mongoose from "mongoose";

const MonitoredUserSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    unique: true 
  },
  flaggedAt: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  reason: { 
    type: String, 
    required: false
  }
});

export default mongoose.models.MonitoredUser || mongoose.model("MonitoredUser", MonitoredUserSchema);