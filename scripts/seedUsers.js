import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConnect = (await import(path.join(__dirname, "../src/lib/dbConnect.js"))).default;
const User = (await import(path.join(__dirname, "../src/models/User.js"))).default;

await dbConnect();

async function seedUsers() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const emails = new Set();
  const users = [];

  while (users.length < 100_000) {
    const email = faker.internet.email().toLowerCase();
    if (!emails.has(email)) {
      emails.add(email);
      users.push({
        name: faker.person.fullName(),
        email,
        password: hashedPassword,
      });
    }
  }
  const inserted = await User.insertMany(users);
  console.log("Seeded", inserted.length, "users.");
  mongoose.connection.close();
}

seedUsers();