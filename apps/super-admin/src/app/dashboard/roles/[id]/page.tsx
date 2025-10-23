"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { RoleFormData, InternalPermissionCategory, InternalPermission } from "../types";
import { rolesAPI } from "../api";

export default function RoleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const roleId = params?.id ?? "role";
  const isNew = roleId === 'new';
  const display = useMemo(() => (isNew ? 'Create Role' : roleId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())), [isNew, roleId]);

  // Form state
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    isActive: true,
    permissions: []
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [active, setActive] = useState(true);
  const [categories, setCategories] = useState<InternalPermissionCategory[]>([]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Load permissions from API
  useEffect(() => {
    loadPermissions();
  }, []);

  // Load role data when editing
  useEffect(() => {
    if (!isNew) {
      loadRoleData();
    }
  }, [isNew, roleId]);

  const loadPermissions = async () => {
    try {
      const permissions = await rolesAPI.getPermissions();
      setCategories(permissions);
    } catch (err) {
      setError('Failed to load permissions');
      console.error('Error loading permissions:', err);
    }
  };

  const loadRoleData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const role = await rolesAPI.getRole(roleId);
      const rolePermissions = await rolesAPI.getRolePermissions(roleId);
      
      setFormData({
        name: role.name,
        description: role.description || '',
        isActive: role.isActive,
        permissions: []
      });
      setActive(role.isActive);
      setCategories(rolePermissions);
    } catch (err) {
      setError('Failed to load role data');
      console.error('Error loading role:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFlag = (catId: string, itemId: string, key: keyof InternalPermission['flags']) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id !== catId
          ? c
          : { 
              ...c, 
              items: c.items.map((it) => 
                it.id !== itemId 
                  ? it 
                  : { 
                      ...it, 
                      flags: { 
                        view: it.flags?.view ?? false,
                        create: it.flags?.create ?? false,
                        edit: it.flags?.edit ?? false,
                        delete: it.flags?.delete ?? false,
                        [key]: !(it.flags?.[key] ?? false) 
                      } 
                    }
              ) 
            }
      )
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Collect permissions from categories
      const permissions: InternalPermission[] = [];
      categories.forEach(cat => {
        cat.items.forEach(item => {
          permissions.push({
            id: item.id,
            name: item.name,
            category: cat.id,
            flags: item.flags ?? { view: false, create: false, edit: false, delete: false }
          });
        });
      });

      const roleData = {
        ...formData,
        permissions,
        isActive: active
      };

      if (isNew) {
        await rolesAPI.createRole(roleData);
      } else {
        await rolesAPI.updateRole(roleId, roleData);
      }

      router.push('/dashboard/roles');
    } catch (err) {
      setError(isNew ? 'Failed to create role' : 'Failed to update role');
      console.error('Error saving role:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof RoleFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
            <p className="text-sm text-black/60">Loading role data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{display}</h1>
          <p className="text-sm text-black/60">{isNew ? 'Define role info and permissions.' : 'Configure permissions for this role.'}</p>
        </div>
        <button onClick={() => router.push('/dashboard/roles')} className="px-3 py-2 rounded-md border border-black/10 text-sm hover:bg-[#E7E2D9]">Back to list</button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-black/10 bg-white p-5">
        <h2 className="text-lg font-medium mb-4">Role information</h2>
        <div className="grid gap-6">
          <div className="flex items-center gap-4">
            <label className="grid gap-1 text-sm w-full max-w-sm">
              <span className="text-black/70">Role Name</span>
              <input 
                disabled={!isNew} 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="px-3 py-2 border border-black/20 rounded-md outline-none focus:ring-2 focus:ring-black/20" 
                placeholder={isNew ? 'e.g. Logistics' : undefined} 
              />
            </label>
            <div className="flex items-center gap-2 mt-5">
              <button
                type="button"
                onClick={() => setActive((a) => !a)}
                className={"relative inline-flex h-6 w-11 items-center rounded-full transition " + (active ? "bg-blue-600" : "bg-black/20")}
                aria-pressed={active}
              >
                <span className={"inline-block h-4 w-4 transform rounded-full bg-white transition " + (active ? "translate-x-6" : "translate-x-1")} />
              </button>
              <span className="text-sm">Activate role</span>
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium mb-3">Permissions</h3>
            <div className="overflow-x-auto rounded-lg border border-black/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-black/60 border-b border-black/10">
                    <th className="py-3 px-4 w-[40%]">&nbsp;</th>
                    <th className="py-3 px-4">View</th>
                    <th className="py-3 px-4">Create</th>
                    <th className="py-3 px-4">Edit</th>
                    <th className="py-3 px-4">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => {
                    const isCollapsed = !!collapsed[cat.id];
                    return (
                      <React.Fragment key={cat.id}>
                        <tr className="bg-black/5">
                          <td className="py-3 px-4 font-medium">
                            <button
                              type="button"
                              className="inline-flex items-center gap-2"
                              onClick={() => setCollapsed((m) => ({ ...m, [cat.id]: !m[cat.id] }))}
                            >
                              <span className={"transition inline-block " + (isCollapsed ? "-rotate-90" : "rotate-0")}>▾</span>
                              {cat.name}
                            </button>
                          </td>
                          <td className="py-3 px-4" />
                          <td className="py-3 px-4" />
                          <td className="py-3 px-4" />
                          <td className="py-3 px-4" />
                        </tr>
                        {!isCollapsed &&
                          cat.items.map((item) => (
                            <tr key={item.id} className="border-t border-black/10">
                              <td className="py-3 px-4 text-black/80">{item.name}</td>
                              {(["view", "create", "edit", "delete"] as (keyof InternalPermission['flags'])[]).map((k) => (
                                <td key={k} className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    checked={item.flags?.[k] ?? false}
                                    onChange={() => toggleFlag(cat.id, item.id, k)}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              disabled={isSaving || !formData.name.trim()}
              className="px-3 py-2 rounded-md bg-black text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : (isNew ? 'Create' : 'Save')}
            </button>
            <button onClick={() => router.push('/dashboard/roles')} className="px-3 py-2 rounded-md border border-black/10 text-sm hover:bg-[#E7E2D9]">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}


