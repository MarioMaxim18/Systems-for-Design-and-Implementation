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
const Language = (await import(path.join(__dirname, "../src/models/Language.js"))).default;
const User = (await import(path.join(__dirname, "../src/models/User.js"))).default; 

await dbConnect();

async function seedUsers() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = Array.from({ length: 100_000 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: hashedPassword,
  }));

  const insertedUsers = await User.insertMany(users);
  console.log("✅ Seeded 100000 users.");
  return insertedUsers.map((u) => u._id);
}

async function seedLanguages() {
    await dbConnect();
  
    const fakeUserId = "68163dc8ee063c17bc6da95b"; // use a real user ID
    const languages = Array.from({ length: 100_000 }).map(() => ({
      name: faker.lorem.word(),
      developer: faker.company.name(),
      year: faker.number.int({ min: 1960, max: 2024 }),
      description: faker.lorem.sentence(10),
      createdBy: fakeUserId,
    }));
  
    await Language.insertMany(languages);
    console.log("Seeded 100000 languages.");
    mongoose.connection.close();
  }

async function run() {
  await seedLanguages();

  mongoose.connection.close();
}

run();