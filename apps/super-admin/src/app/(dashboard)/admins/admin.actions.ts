"use server";
import { prisma } from "@repo/db";
import { ActionResult } from "next/dist/server/app-render/types";
import bcrypt from "bcryptjs";

export async function createAdmin(data: any): Promise<ActionResult> {
    try {
        const { email, password, firstName, lastName, roleId } = data || {};

        // Basic guards
        if (!email || !password || !firstName || !lastName || !roleId) {
            return { success: false, message: "Missing required fields" };
        }

        // Ensure uniqueness by email on User
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return { success: false, message: "Email already exists" };

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await prisma.$transaction(async (tx:any) => {
            const user = await tx.user.create({
                data: {
                    name: `${firstName} ${lastName}`.trim(),
                    email,
                    roleId,
                    emailVerified: true,
                    isAdmin: true,
                    registeredFromApp: "super-admin",
                },
                select: { id: true },
            });

            await tx.account.create({
                data: {
                    accountId: email,
                    providerId: "credentials",
                    userId: user.id,
                    password: hashedPassword,
                },
            });

            return user;
        });

        return { success: true, message: "User and account created successfully", data: result };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to create admin" };
    }
}
export async function getRoles(): Promise<ActionResult> {
    try {
        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            },
            where: {
                NOT: {
                    name: "SUPER_ADMIN",
                },
            },
        });
        return { success: true, message: "Roles fetched successfully", data: roles };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to fetch roles" };
    }
}

export async function getAdmins(): Promise<ActionResult> {
    try {
        const admins = await prisma.user.findMany({ 
            select: {
                id: true,
                name: true,
                email: true,
                roleId: true,
                role: {
                    select: {
                        name: true,
                    },
                },
            },
            where: {
                role: {
                    NOT: {
                        name: "SUPER_ADMIN",
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return { success: true, message: "Admins fetched successfully", data: admins };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to fetch admins" };
    }
}

export async function deleteAdmin(id: string): Promise<ActionResult> {
    try {
        const user = await prisma.user.delete({ where: { id }, include: { accounts: true } });
        if (!user) {
            return { success: false, message: "Admin not found" };
        }
        return { success: true, message: "Admin deleted successfully", data: user };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to delete admin", data: null };
    }
}

export async function updateAdmin(id: string, data: any): Promise<ActionResult> {
    try {
        const { email, firstName, lastName, roleId } = data || {};
        const user = await prisma.user.update({ where: { id }, data: { email, name: `${firstName} ${lastName}`.trim(), roleId } });
        return { success: true, message: "Admin updated successfully", data: user };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to update admin", data: null };
    }
}