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
      role.rolePermissions.map((rp) => [rp.permissionId, rp])
    );

    // ✅ Build grouped response with merged flags (canView, canCreate, etc.)
    const formatted = allGroups.map((group) => ({
      group: group.name,
      permissions: group.permissions.map((perm) => {
        const rolePermission = rolePermissionMap.get(perm.id);
        return {
          id: perm.id,
          name: perm.name,
          key: perm.key,
          description: perm.description,
          canView: rolePermission?.canView ?? perm.canView,
          canCreate: rolePermission?.canCreate ?? perm.canCreate,
          canEdit: rolePermission?.canEdit ?? perm.canEdit,
          canDelete: rolePermission?.canDelete ?? perm.canDelete,
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
    const { name, description, isActive, permissions } = await req.json();

    if (!name) return errorResponse("Role name is required", 400);
    if (!permissions || !Array.isArray(permissions))
      return errorResponse("Permissions array is required", 400);

    // ✅ Map permissions to role permission format (same as POST)
    const permissionMappings = permissions.map((p: any) => ({
      permissionId: p.id,
      canView: p.flags?.view || false,
      canCreate: p.flags?.create || false,
      canEdit: p.flags?.edit || false,
      canDelete: p.flags?.delete || false,
    }));

    // ✅ Update existing role with new values
    const updatedRole = await prisma.role.update({
      where: { id: params.id },
      data: {
        name,
        description,
        isActive: isActive ?? true,
        rolePermissions: {
          deleteMany: {}, // remove old permissions
          create: permissionMappings.map((perm) => ({
            permissionId: perm.permissionId,
            canView: perm.canView,
            canCreate: perm.canCreate,
            canEdit: perm.canEdit,
            canDelete: perm.canDelete,
          })),
        },
      },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });

    return successResponse(updatedRole, "Role updated successfully");
  } catch (error) {
    console.error("❌ Error updating role:", error);
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
