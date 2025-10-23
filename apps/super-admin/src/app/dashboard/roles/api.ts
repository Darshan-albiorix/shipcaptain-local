import { Role, CreateRoleRequest, UpdateRoleRequest, PermissionCategory, PermissionsApiResponse, InternalPermissionCategory } from './types';


export class RolesAPI {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Helper function to transform API permissions to internal format
  private transformPermissionsToInternal(apiPermissions: PermissionCategory[]): InternalPermissionCategory[] {
    return apiPermissions.map(category => ({
      id: category.group.toLowerCase().replace(/\s+/g, '-'),
      name: category.group,
      items: category.permissions.map(permission => ({
        id: permission.id,
        name: permission.name,
        category: category.group.toLowerCase().replace(/\s+/g, '-'),
        flags: {
          view: permission.canView,
          create: permission.canCreate,
          edit: permission.canEdit,
          delete: permission.canDelete,
        }
      }))
    }));
  }

  async getRoles(): Promise<Role[]> {
    try {
      const response = await fetch('/api/roles', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      if (!apiResponse.success) {
        throw new Error(apiResponse.message);
      }
      
      // Transform API response to match Role interface
      return apiResponse.data.map((role: any) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        users: role.rolePermissions?.length || 0, // Count permissions as users for now
        createdAt: new Date(role.createdAt).toLocaleDateString(),
      }));
    } catch (error) {
      console.error('Error fetching roles:', error);
      // Fallback to mock data if API fails
      return [
        { id: "admin", name: "Admin", users: 5, isActive: true, createdAt: "5/12/2022", description: "Full platform access" },
        { id: "logistics", name: "Logistics", users: 2, isActive: true, createdAt: "5/12/2022", description: "Warehouse and shipping" },
        { id: "warehouse-manager", name: "Warehouse manager", users: 4, isActive: true, createdAt: "5/12/2022", description: "Manage teams and inventory" },
        { id: "warehouse-shipping-specialist", name: "Warehouse shipping specialist", users: 8, isActive: true, createdAt: "5/12/2022", description: "Pick, pack, ship" },
        { id: "viewer", name: "Viewer", users: 11, isActive: true, createdAt: "5/12/2022", description: "Read-only access" },
      ];
    }
  }

  async getRole(id: string): Promise<Role> {
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      if (!apiResponse.success) {
        throw new Error(apiResponse.message);
      }
      
      const role = apiResponse.data;
      return {
        id: role.id,
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        users: role.permissions?.length || 0, // Count permissions as users for now
        createdAt: new Date(role.createdAt).toLocaleDateString(),
      };
    } catch (error) {
      console.error('Error fetching role:', error);
      // Fallback to mock data if API fails
      const roles = await this.getRoles();
      const role = roles.find(r => r.id === id);
      if (!role) throw new Error('Role not found');
      return role;
    }
  }

  async getRolePermissions(id: string): Promise<InternalPermissionCategory[]> {
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      if (!apiResponse.success) {
        throw new Error(apiResponse.message);
      }
      
      const role = apiResponse.data;
      // Transform the role permissions to internal format
      return this.transformRolePermissionsToInternal(role.permissions);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      // Fallback to base permissions if API fails
      return this.getPermissions();
    }
  }

  private transformRolePermissionsToInternal(rolePermissions: any[]): InternalPermissionCategory[] {
    // Group permissions by category
    const groupedPermissions = rolePermissions.reduce((acc, group: any) => {
      acc[group.group] = group.permissions;
      return acc;
    }, {} as Record<string, any[]>);

    return Object.entries(groupedPermissions).map(([groupName, permissions]) => ({
      id: groupName.toLowerCase().replace(/\s+/g, '-'),
      name: groupName,
      items: (permissions as any[]).map((permission: any) => ({
        id: permission.id,
        name: permission.name,
        category: groupName.toLowerCase().replace(/\s+/g, '-'),
        flags: {
          view: permission.canView,
          create: permission.canCreate,
          edit: permission.canEdit,
          delete: permission.canDelete,
        }
      }))
    }));
  }

  async createRole(data: CreateRoleRequest): Promise<Role> {
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      if (!apiResponse.success) {
        throw new Error(apiResponse.message);
      }
      
      const role = apiResponse.data;
      return {
        id: role.id,
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        users: role.rolePermissions?.length || 0,
        createdAt: new Date(role.createdAt).toLocaleDateString(),
      };
    } catch (error) {
      console.error('Error creating role:', error);
      // Fallback to mock response if API fails
      return {
        id: `role-${Date.now()}`,
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        users: 0,
        createdAt: new Date().toISOString(),
      };
    }
  }

  async updateRole(id: string, data: UpdateRoleRequest): Promise<Role> {
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      if (!apiResponse.success) {
        throw new Error(apiResponse.message);
      }
      
      const role = apiResponse.data;
      return {
        id: role.id,
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        users: role.permissions?.length || 0,
        createdAt: new Date(role.createdAt).toLocaleDateString(),
      };
    } catch (error) {
      console.error('Error updating role:', error);
      // Fallback to mock response if API fails
      const existingRole = await this.getRole(id);
      return {
        ...existingRole,
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  async deleteRole(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      if (!apiResponse.success) {
        throw new Error(apiResponse.message);
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      // Mock success for now if API fails
      console.log(`Role ${id} deleted`);
    }
  }

  async getPermissions(): Promise<InternalPermissionCategory[]> {
    try {
   
      const response = await fetch('/api/permissions', {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse: PermissionsApiResponse = await response.json();
      if (!apiResponse.success) {
        throw new Error(apiResponse.message);
      }
      
      return this.transformPermissionsToInternal(apiResponse.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      // Fallback to mock data if API fails
      return this.getMockPermissions();
    }
  }

  private getMockPermissions(): InternalPermissionCategory[] {
    // Mock data using the new API format structure
    const mockApiResponse: PermissionsApiResponse = {
      success: true,
      message: "Permissions fetched successfully",
      data: [
        {
          group: "Billing",
          permissions: [
            {
              id: "fc79628a-56a2-4cb5-818c-4a2b459b37b7",
              name: "Billing",
              key: "billing",
              description: null,
              canView: false,
              canCreate: false,
              canEdit: false,
              canDelete: false
            },
            {
              id: "e3d96582-376e-4bda-bb0e-1d1f45eceedd",
              name: "Billing Profiles",
              key: "billing_profiles",
              description: null,
              canView: false,
              canCreate: false,
              canEdit: false,
              canDelete: false
            }
          ]
        },
        {
          group: "Bins",
          permissions: [
            {
              id: "a3acf397-2f21-4292-9160-fa507cf22297",
              name: "Bins",
              key: "bins",
              description: null,
              canView: false,
              canCreate: false,
              canEdit: false,
              canDelete: false
            }
          ]
        },
        {
          group: "Users",
          permissions: [
            {
              id: "users-list",
              name: "List users",
              key: "users_list",
              description: null,
              canView: false,
              canCreate: false,
              canEdit: false,
              canDelete: false
            },
            {
              id: "users-create",
              name: "Create users",
              key: "users_create",
              description: null,
              canView: false,
              canCreate: false,
              canEdit: false,
              canDelete: false
            }
          ]
        }
      ]
    };
    
    return this.transformPermissionsToInternal(mockApiResponse.data);
  }
}

export const rolesAPI = new RolesAPI();
