import { prisma } from "@repo/db";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const role = await prisma.role.findUnique({
      where: { id: params.id },
      include: {
        rolePermissions: {
          include: {
            permission: {
              include: { group: true },
            },
          },
        },
      },
    });

    if (!role) return errorResponse("Role not found", 404);

    // ✅ Fetch all permission groups to maintain same structure as list
    const allGroups = await prisma.permissionGroup.findMany({
      include: {
        permissions: true,
      },
      orderBy: { name: "asc" },
    });

    // Map rolePermissions into a lookup table
    const rolePermissionMap = new Map(
      role.rolePermissions.map((rp) => [rp.permissionId, rp.permission])
    );

    // ✅ Build grouped response with merged flags (canView, canCreate, etc.)
    const formatted = allGroups.map((group) => ({
      group: group.name,
      permissions: group.permissions.map((perm) => {
        const assigned = rolePermissionMap.get(perm.id);
        return {
          id: perm.id,
          name: perm.name,
          key: perm.key,
          description: perm.description,
          canView: assigned?.canView ?? perm.canView,
          canCreate: assigned?.canCreate ?? perm.canCreate,
          canEdit: assigned?.canEdit ?? perm.canEdit,
          canDelete: assigned?.canDelete ?? perm.canDelete,
        };
      }),
    }));

    // ✅ Include role meta info too
    const responseData = {
      id: role.id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissions: formatted,
    };

    return successResponse(responseData, "Role fetched successfully");
  } catch (error) {
    console.error("❌ Error fetching role:", error);
    return errorResponse("Failed to fetch role", 500, error);
  }
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, description, permissionIds } = await req.json();

    const role = await prisma.role.update({
      where: { id: params.id },
      data: {
        name,
        description,
        rolePermissions: {
          deleteMany: {}, // clear old relations
          create: permissionIds?.map((pid: string) => ({ permissionId: pid })) || [],
        },
      },
      include: {
        rolePermissions: { include: { permission: true } },
      },
    });

    return successResponse(role, "Role updated successfully");
  } catch (error) {
    return errorResponse("Failed to update role", 500, error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.role.delete({ where: { id: params.id } });
    return successResponse({}, "Role deleted successfully");
  } catch (error) {
    return errorResponse("Failed to delete role", 500, error);
  }
}
