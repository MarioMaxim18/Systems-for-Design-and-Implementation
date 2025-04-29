import dbConnect from "../../../lib/dbConnect";
import Language from "../../../models/Language";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");  
  const sortBy = searchParams.get("sortBy") || "ID";
  const userId = searchParams.get("userId");

  if (id) {
    const language = await Language.findById(id);
    if (!language) {
      return NextResponse.json({ error: "Language not found" }, { status: 404 });
    }
    return NextResponse.json(language);
  }

  const sortOptions = {
    ID: "_id",
    Name: "name",
    Year: "year",
  };

  const sortField = sortOptions[sortBy] || "_id";

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json([]);
  }

  const languages = await Language.find({ createdBy: userId }).sort({ [sortField]: 1 });
  return NextResponse.json(languages);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  
  const { name, developer, year, description, createdBy } = body;

  if (!name || !developer || !year || !description || !createdBy) {
    return NextResponse.json(
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

    return NextResponse.json(newLang, { status: 201 });
  } catch (err) {
    console.error("MongoDB insert error:", err);
    return NextResponse.json({ error: "Failed to create language" }, { status: 500 });
  }
}

export async function PATCH(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const data = await req.json();
  const updated = await Language.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const deleted = await Language.findByIdAndDelete(id);
  return NextResponse.json(deleted);
}