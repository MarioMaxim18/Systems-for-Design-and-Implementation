import mongoose from "mongoose";

const LanguageSchema = new mongoose.Schema({
  name: String,
  developer: String,
  year: Number,
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, 
  },
});

export default mongoose.models.Language || mongoose.model("Language", LanguageSchema);
LanguageSchema.index({ createdBy: 1, year: 1 });
LanguageSchema.index({ createdBy: 1, name: 1 });
LanguageSchema.index({ createdBy: 1, _id: 1 });