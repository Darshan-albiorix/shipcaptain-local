"use server";

import { prisma } from "@repo/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }

  // 1️⃣ Find admin with role + permissions
  const admin = await prisma.admin.findUnique({
    where: { email },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  if (!admin) {
    return { success: false, message: "Invalid credentials." };
  }

  // 2️⃣ Compare password
  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    return { success: false, message: "Invalid credentials." };
  }

  // 3️⃣ Check account status
  if (!admin.isActive) {
    return { success: false, message: "Account is inactive." };
  }

  // console.log("Admin found:", admin.role.name);
  // console.log("Admin found:", admin);

  // 4️⃣ Build permission map
  const permissions = admin.role.rolePermissions.map((rp) => ({
    key: rp.permission.key,
    canView: rp.canView,
    canCreate: rp.canCreate,
    canEdit: rp.canEdit,
    canDelete: rp.canDelete,
  }));

  // 5️⃣ Create JWT payload
  const payload = {
    id: admin.id,
    email: admin.email,
    name: `${admin.firstName} ${admin.lastName}`,
    role: admin.role.name,
    permissions,
  };

  // 6️⃣ Sign JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" });
  // console.log("Generated JWT token:", token);
  // 7️⃣ Store token in secure cookie
  (await
    // 7️⃣ Store token in secure cookie
    cookies()).set("admin_token", token, {
    httpOnly: true,
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  console.log("JWT token stored in cookie.");
  redirect("/roles");
  return {
    success: true,
    message: "Login successful.",
    user: {
      id: admin.id,
      email: admin.email,
      role: admin.role.name,
      permissions,
    },
  };
}
