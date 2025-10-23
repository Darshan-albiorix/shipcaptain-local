"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role } from "./types";
import { rolesAPI } from "./api";

export default function RolesPermissionsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const rolesData = await rolesAPI.getRoles();
      setRoles(rolesData);
    } catch (err) {
      setError('Failed to load roles');
      console.error('Error loading roles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((r) => r.name.toLowerCase().includes(q));
  }, [query, roles]);


  if (isLoading) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Users & Roles</h1>
          <button disabled className="px-3 py-2 rounded-md bg-gray-300 text-gray-500 text-sm cursor-not-allowed">Create Role</button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
            <p className="text-sm text-black/60">Loading roles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Users & Roles</h1>
        <button onClick={() => router.push('/dashboard/roles/new')} className="px-3 py-2 rounded-md bg-black text-white text-sm">Create Role</button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <button 
                onClick={loadRoles}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-black/10 bg-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-full max-w-xs">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full px-3 py-2 border border-black/20 rounded-md outline-none focus:ring-2 focus:ring-black/20 placeholder-black/40"
            />
          </div>
          {/* <button className="px-3 py-2 rounded-md border border-black/10 text-sm hover:bg-[#E7E2D9]">Columns ▾</button> */}
        </div>

        <div className="grid md:grid-cols-[1.5fr_1fr_.8fr_1fr] text-sm font-medium text-black/60 px-3">
          <div>Role Name</div>
          <div>Users</div>
          <div>Role Status</div>
          <div>Date created</div>
        </div>
        <div className="mt-2 divide-y divide-black/10 rounded-lg border border-black/10 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-black/60">
              {query ? 'No roles found matching your search.' : 'No roles available.'}
            </div>
          ) : (
            filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => router.push(`/dashboard/roles/${r.id}`)}
                className={"w-full text-left grid md:grid-cols-[1.5fr_1fr_.8fr_1fr] items-center px-3 py-3 transition hover:bg-black/5"}
              >
                <div className="font-medium text-black">{r.name}</div>
                <div className="text-black/80">{r.users}</div>
                <div>
                  <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full ${
                    r.isActive ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {r.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="text-black/60">{r.createdAt}</div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


