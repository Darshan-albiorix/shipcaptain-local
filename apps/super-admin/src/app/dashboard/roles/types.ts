export interface Role {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  users: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Permission {
  id: string;
  name: string;
  key: string;
  description: string | null;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface PermissionCategory {
  group: string;
  permissions: Permission[];
}

// API Response wrapper
export interface PermissionsApiResponse {
  success: boolean;
  message: string;
  data: PermissionCategory[];
}

// Internal format for UI components (keeping existing structure for compatibility)
export interface InternalPermission {
  id: string;
  name: string;
  category: string;
  flags: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export interface InternalPermissionCategory {
  id: string;
  name: string;
  items: InternalPermission[];
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  isActive: boolean;
  permissions: InternalPermission[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
  permissions?: InternalPermission[];
}

export interface RoleFormData {
  name: string;
  description: string;
  isActive: boolean;
  permissions: InternalPermission[];
}
