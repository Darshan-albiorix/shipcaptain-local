import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { prisma } from "@repo/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { DeleteRoleButton } from "./DeleteRoleButton";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { revalidatePath } from "next/cache";
import { deleteRole } from "./role.actions";
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
    console.error("Error fetching roles:", error);
    return [];
  }
}

export default async function RolesPermissionsPage() {
  const roles = await getRoles();
  const handleDelete = async (formData: FormData) => {
    'use server';
    await deleteRole(formData);
    revalidatePath('/roles');
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {/* <h1 className="text-xl font-semibold tracking-tight"> */}
            Users & Roles
          {/* </h1> */}
        </CardTitle>
        <CardAction>
          <Button
            asChild
            className="px-3 py-2 rounded-md bg-black text-white text-sm"
          >
            <Link href="/roles/new">Create Role</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Role Status</TableHead>
              <TableHead>Date created</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((r: any) => (
              <TableRow key={r.id} className="hover:bg-black/5 cursor-pointer">
                <TableCell className="p-0">
                  <Link
                    href={`/roles/${r.id}`}
                    className="block w-full h-full px-3 py-2"
                  >
                    {r.name}
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link
                    href={`/roles/${r.id}`}
                    className="block w-full h-full px-3 py-2"
                  >
                    {r.users}
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link
                    href={`/roles/${r.id}`}
                    className="block w-full h-full px-3 py-2"
                  >
                    <span
                      className={`inline-block text-[11px] px-2 py-0.5 rounded-full ${
                        r.isActive
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {r.isActive ? "Active" : "Inactive"}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link
                    href={`/roles/${r.id}`}
                    className="block w-full h-full px-3 py-2"
                  >
                    {r.createdAt}
                  </Link>
                </TableCell>
                <TableCell>
                  <DeleteRoleButton
                    serverAction={handleDelete}
                    payload={{ id: r.id }}
                    name={r.name}
                    title="Delete role"
                  />
                </TableCell>
              </TableRow>
            ))}
            {!roles.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
