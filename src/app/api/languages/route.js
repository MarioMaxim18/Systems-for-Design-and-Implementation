import dbConnect from "../../../lib/dbConnect";
import Language from "../../../models/Language";
import Log from "../../../models/Log";
import mongoose from "mongoose";

async function logAction(userId, action) {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return;
  try {
    await Log.create({ userId, action });
  } catch (err) {
    console.error("Failed to log action:", err);
  }
}

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const sortBy = searchParams.get("sortBy") || "ID";
  const userId = searchParams.get("userId");

  if (id) {
    const language = await Language.findById(id);
    if (!language) {
      return Response.json({ error: "Language not found" }, { status: 404 });
    }
    return Response.json(language);
  }

  const sortOptions = {
    ID: "_id",
    Name: "name",
    Year: "year",
  };

  const sortField = sortOptions[sortBy] || "_id";

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return Response.json([]);
  }

  const limit = parseInt(searchParams.get("limit")) || 10;
  const offset = parseInt(searchParams.get("offset")) || 0;

  const languages = await Language.find({ createdBy: userId })
    .sort({ [sortField]: 1 })
    .skip(offset)
    .limit(limit);
  return Response.json(languages);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  
  const { name, developer, year, description, createdBy } = body;

  if (!name || !developer || !year || !description || !createdBy) {
    return Response.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  try {
    const newLang = await Language.create({
      name,
      developer,
      year,
      description,
      createdBy,
    });

    await logAction(createdBy, "CREATE");
    return Response.json(newLang, { status: 201 });
  } catch (err) {
    console.error("MongoDB insert error:", err);
    return Response.json({ error: "Failed to create language" }, { status: 500 });
  }
}

export async function PATCH(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const data = await req.json();

  const original = await Language.findById(id); 
  if (!original) {
    return Response.json({ error: "Language not found" }, { status: 404 });
  }

  const updated = await Language.findByIdAndUpdate(id, data, { new: true });
  await logAction(original.createdBy, "UPDATE");
  return Response.json(updated);
}

export async function DELETE(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const deleted = await Language.findByIdAndDelete(id);
  if (deleted?.createdBy) {
    await logAction(deleted.createdBy, "DELETE");
  }
  return Response.json(deleted);
}