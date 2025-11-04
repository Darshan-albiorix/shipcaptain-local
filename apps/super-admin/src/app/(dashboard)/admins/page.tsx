
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@repo/ui/components/ui/table";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { CreateAdmin } from "./CreateAdmin";
import { deleteAdmin, getAdmins } from "./admin.actions";
import { revalidatePath } from "next/cache";
import { DeleteRoleButton } from "../roles/DeleteRoleButton";

export default async function Admins() {
  const admins = await getAdmins();
  const handleCreate = async () => {
    'use server';
    const result = await getAdmins();
    if (result.success) {
      admins.data = result.data;
    }
    revalidatePath('/admins');
  }
  const handleDelete = async (formData: FormData) => {
    'use server';
    const id = formData.get("id") as string;
    const result = await deleteAdmin(id);
    console.log(result);
    revalidatePath('/admins');
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle></CardTitle>
        <CardAction>
          <CreateAdmin handleCreate={handleCreate} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.data.map((admin:any) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.role.name}</TableCell>
                <TableCell>
                 <DeleteRoleButton serverAction={handleDelete} payload={{ id: admin.id }} title="Delete Admin" name={admin.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
