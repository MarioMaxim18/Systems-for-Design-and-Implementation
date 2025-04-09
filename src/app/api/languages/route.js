import { NextResponse } from 'next/server';
import { getAllLanguages, addLanguage, updateLanguage, deleteLanguage } from '../../../data/data.js';


// GET API: Retrieve all languages with sorting option
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get('sortBy') || "ID";
  
  let languages = getAllLanguages();

  if (sortBy === "Name") {
    languages = languages.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "Year") {
    languages = languages.sort((a, b) => a.year - b.year);
  } else if (sortBy === "ID") {
    languages = languages.sort((a, b) => a.id - b.id);
  }

  return NextResponse.json(languages);
}

// POST API: Add a new language
export async function POST(request) {
  try {
    const { name, developer, year, description } = await request.json();
    const newLang = { name, developer, year, description };
    const addedLang = addLanguage(newLang);
    return NextResponse.json(addedLang, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add language" }, { status: 400 });
  }
}

// PATCH API: Update a language by ID
export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  try {
    const { name, developer, year, description } = await request.json();
    const updatedLang = { name, developer, year, description };
    const updated = updateLanguage(Number(id), updatedLang);
    
    // Return the updated language
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update language" }, 
      { status: 400 }
    );
  }
}

// DELETE API: Delete a language by ID
export async function DELETE(request) {
  const { id } = request.nextUrl.searchParams;
  try {
    const deletedLang = deleteLanguage(parseInt(id));
    return NextResponse.json(deletedLang);
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete language" }, { status: 400 });
  }
}