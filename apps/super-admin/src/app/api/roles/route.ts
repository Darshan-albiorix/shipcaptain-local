import { prisma } from "@repo/db";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of roles
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Warehouse Manager
 *               description:
 *                 type: string
 *                 example: Handles warehouse operations
 *     responses:
 *       201:
 *         description: Role created successfully
 */
export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(roles, "Roles fetched successfully");
  } catch (error) {
    return errorResponse("Failed to fetch roles", 500, error);
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, isActive, permissions } = await req.json();

    if (!name) return errorResponse("Role name is required", 400);
    if (!permissions || !Array.isArray(permissions))
      return errorResponse("Permissions array is required", 400);

    // ✅ Map permissions to role permission format
    const permissionMappings = permissions.map((p: any) => ({
      permissionId: p.id,
      canView: p.flags?.view || false,
      canCreate: p.flags?.create || false,
      canEdit: p.flags?.edit || false,
      canDelete: p.flags?.delete || false,
    }));

    // ✅ Create new role with permissions
    const role = await prisma.role.create({
      data: {
        name,
        description,
        isActive: isActive ?? true,
        rolePermissions: {
          create: permissionMappings.map((perm) => ({
            permissionId: perm.permissionId,
          })),
        },
      },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });

    return successResponse(role, "Role created successfully", 201);
  } catch (error) {
    console.error("❌ Error creating role:", error);
    return errorResponse("Failed to create role", 500, error);
  }
}