import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { errorResponse, successResponse } from "@/lib/api-response";


// export async function OPTIONS(req: Request) {
//   return handleOptions(req);
// }

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permission groups with nested permissions
 *     tags:
 *       - Permissions
 *     responses:
 *       200:
 *         description: List of permission groups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       group:
 *                         type: string
 *                         example: Billing
 *                       permissions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                               example: Billing Profiles
 *                             key:
 *                               type: string
 *                               example: billing_profiles
 *                             canView:
 *                               type: boolean
 *                             canCreate:
 *                               type: boolean
 *                             canEdit:
 *                               type: boolean
 *                             canDelete:
 *                               type: boolean
 */
export async function GET() {
  try {
    const groups = await prisma.permissionGroup.findMany({
      include: {
        permissions: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    const formatted = groups.map((group: any) => ({
      group: group.name,
      permissions: group.permissions.map((p: any) => ({
        id: p.id,
        name: p.name,
        key: p.key,
        description: p.description,
        canView: p.canView,
        canCreate: p.canCreate,
        canEdit: p.canEdit,
        canDelete: p.canDelete,
      })),
    }));
    console.log("formatted",formatted);

    return Response.json({ data: formatted, success: true, message: "Permissions fetched successfully" });  } catch (error) {
    console.error("❌ Error fetching permissions:", error);
    return NextResponse.json(errorResponse("Failed to fetch permissions", 500, error));
  }
}

