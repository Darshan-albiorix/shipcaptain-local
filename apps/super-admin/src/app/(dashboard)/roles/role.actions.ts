"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RoleFormData, InternalPermission, CreateRoleRequest, UpdateRoleRequest } from "./types";

export interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export async function createRole(data: CreateRoleRequest): Promise<ActionResult> {
  try {
    // Validate input
    if (!data.name?.trim()) {
      return {
        success: false,
        message: "Role name is required",
        error: "Role name is required"
      };
    }

    if (!data.permissions || !Array.isArray(data.permissions)) {
      return {
        success: false,
        message: "Permissions array is required",
        error: "Permissions array is required"
      };
    }

    // Map permissions to role permission format
    const permissionMappings = data.permissions.map((p) => ({
      permissionId: p.id,
      canView: p.flags?.view || false,
      canCreate: p.flags?.create || false,
      canEdit: p.flags?.edit || false,
      canDelete: p.flags?.delete || false,
    }));

    // Create new role with permissions
    const role = await prisma.role.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || "",
        isActive: data.isActive ?? true,
        rolePermissions: {
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

    // Revalidate the roles list page
    revalidatePath("/roles");

    return {
      success: true,
      message: "Role created successfully",
      data: role
    };
  } catch (error) {
    console.error("❌ Error creating role:", error);
    return {
      success: false,
      message: "Failed to create role",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function updateRole(roleId: string, data: UpdateRoleRequest): Promise<ActionResult> {
  try {
    // Validate input
    if (!data.name?.trim()) {
      return {
        success: false,
        message: "Role name is required",
        error: "Role name is required"
      };
    }

    if (!data.permissions || !Array.isArray(data.permissions)) {
      return {
        success: false,
        message: "Permissions array is required",
        error: "Permissions array is required"
      };
    }

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!existingRole) {
      return {
        success: false,
        message: "Role not found",
        error: "Role not found"
      };
    }

    // Map permissions to role permission format
    const permissionMappings = data.permissions.map((p) => ({
      permissionId: p.id,
      canView: p.flags?.view || false,
      canCreate: p.flags?.create || false,
      canEdit: p.flags?.edit || false,
      canDelete: p.flags?.delete || false,
    }));

    // Update existing role with new values
    const updatedRole = await prisma.role.update({
      where: { id: roleId },
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || "",
        isActive: data.isActive ?? true,
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

    // Revalidate the roles list page and current role page
    revalidatePath("/roles");
    revalidatePath(`/roles/${roleId}`);

    return {
      success: true,
      message: "Role updated successfully",
      data: updatedRole
    };
  } catch (error) {
    console.error("❌ Error updating role:", error);
    return {
      success: false,
      message: "Failed to update role",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function deleteRole(formData: FormData) {
  const roleId = formData.get("id") as string;
  try {
    // Delete the role
    await prisma.role.delete({ 
      where: { id: roleId },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      }
    });

    // Revalidate the roles list page
    revalidatePath("/roles");

    // return {
    //   success: true,
    //   message: "Role deleted successfully"
    // };
  } catch (error) {
    console.error("❌ Error deleting role:", error);
    // return {
    //   success: false,
    //   message: "Failed to delete role",
    //   error: error instanceof Error ? error.message : "Unknown error"
    // };
  }
}

export async function getRole(roleId: string): Promise<ActionResult> {
  try {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
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

    if (!role) {
      return {
        success: false,
        message: "Role not found",
        error: "Role not found"
      };
    }

    // Fetch all permission groups to maintain same structure as list
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

    // Build grouped response with merged flags (canView, canCreate, etc.)
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

    // Include role meta info too
    const responseData = {
      id: role.id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissions: formatted,
    };

    return {
      success: true,
      message: "Role fetched successfully",
      data: responseData
    };
  } catch (error) {
    console.error("❌ Error fetching role:", error);
    return {
      success: false,
      message: "Failed to fetch role",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function getPermissions(): Promise<ActionResult> {
  try {
    const permissionGroups = await prisma.permissionGroup.findMany({
      include: {
        permissions: true,
      },
      orderBy: { name: "asc" },
    });

    const formatted = permissionGroups.map((group) => ({
      group: group.name,
      permissions: group.permissions.map((perm) => ({
        id: perm.id,
        name: perm.name,
        key: perm.key,
        description: perm.description,
        canView: perm.canView,
        canCreate: perm.canCreate,
        canEdit: perm.canEdit,
        canDelete: perm.canDelete,
      })),
    }));

    return {
      success: true,
      message: "Permissions fetched successfully",
      data: formatted
    };
  } catch (error) {
    console.error("❌ Error fetching permissions:", error);
    return {
      success: false,
      message: "Failed to fetch permissions",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
