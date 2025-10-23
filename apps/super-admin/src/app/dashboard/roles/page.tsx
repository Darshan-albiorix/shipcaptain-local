import Link from "next/link";
import { prisma } from "@repo/db";

async function getRoles() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        rolePermissions: {
          include: { permission: true },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      users: role._count.users,
      createdAt: role.createdAt.toLocaleDateString(),
    }));
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
}

export default async function RolesPermissionsPage() {
  const roles = await getRoles();

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Users & Roles</h1>
        <Link href="/dashboard/roles/new" className="px-3 py-2 rounded-md bg-black text-white text-sm">
          Create Role
        </Link>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-4">

        <div className="grid md:grid-cols-[1.5fr_1fr_.8fr_1fr] text-sm font-medium text-black/60 px-3">
          <div>Role Name</div>
          <div>Users</div>
          <div>Role Status</div>
          <div>Date created</div>
        </div>
        <div className="mt-2 divide-y divide-black/10 rounded-lg border border-black/10 overflow-hidden">
          {roles.length === 0 ? (
            <div className="text-center py-8 text-black/60">
              No roles available.
            </div>
          ) : (
            roles.map((r) => (
              <Link
                key={r.id}
                href={`/dashboard/roles/${r.id}`}
                className="w-full text-left grid md:grid-cols-[1.5fr_1fr_.8fr_1fr] items-center px-3 py-3 transition hover:bg-black/5"
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
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


