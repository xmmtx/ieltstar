// Seed roles and super admin
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Role from "./api/models/Role.js";
import User from "./api/models/User.js";
import dotenv from "dotenv";
dotenv.config();

const seed = async () => {
  const user = process.env.DB_USER;
  const pass = process.env.DB_PASS;
  const url = new URL(`${process.env.DB_URL || "mongodb://localhost:27017"}/${process.env.DB_NAME || "ieltstar"}`);
  if (user) url.username = user;
  if (pass) url.password = pass;
  await mongoose.connect(url.toString());
  console.log("Connected");

  // Skip if roles already exist
  const roleCount = await Role.countDocuments();
  if (roleCount > 0) {
    console.log(`Roles already exist (${roleCount}), skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  // Create roles
  const adminRole = await Role.create({
    name: "admin",
    description: "Super administrator / 超级管理员",
    permissions: ["admin.all", "exams.read", "exams.write", "users.manage", "settings.manage"],
  });

  await Role.create({
    name: "teacher",
    description: "Teacher / 教师",
    permissions: ["exams.read", "exams.write", "review.write"],
  });

  await Role.create({
    name: "student",
    description: "Student / 学生",
    permissions: ["exams.read"],
  });

  console.log("Roles created");

  // Create super admin (if not exists)
  const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
  if (!existingAdmin) {
    const hash = await bcrypt.hash("admin123", 10);
    await User.create({
      email: "admin@gmail.com",
      passwordHash: hash,
      fullName: "Super Admin",
      emailVerifiedAt: new Date(),
      role: adminRole._id,
    });
    console.log("Super admin created: admin@gmail.com / admin123");
  } else {
    // Update existing admin with role
    existingAdmin.role = adminRole._id;
    existingAdmin.emailVerifiedAt = new Date();
    await existingAdmin.save();
    console.log("Existing admin updated with roles");
  }

  await mongoose.disconnect();
  console.log("Done");
};

seed().catch(console.error);
