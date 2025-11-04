'use client';
import { Button } from "@repo/ui/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/components/ui/dialog";
import { Input } from "@repo/ui/components/ui/input";
import { createAdmin, getRoles } from "./admin.actions";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";

export function CreateAdmin({ handleCreate }: { handleCreate: () => void }) {
    const [open, setOpen] = useState(false);
    const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<{ username: string; email: string; password: string; firstName: string; lastName: string; phone: string; roleId: string }>({
        defaultValues: { email: "", password: "", firstName: "", lastName: "", roleId: "" },
        mode: "onBlur",
        reValidateMode: "onChange",
    });
    const onSubmit = async (data: { email: string; password: string; firstName: string; lastName: string;  roleId: string }) => {
        const result = await createAdmin(data);
        if (result.success) {
            reset();
            setOpen(false);
            handleCreate();
        } else {
            console.log(result);
        }
    }
    useEffect(() => {
        const fetchRoles = async () => {
            const result = await getRoles();
            if (result.success) {
                setRoles(result.data);
            }
        }
        fetchRoles();
    }, []);
    return (
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { reset(); } }}>
            <DialogTrigger asChild>
                <Button className="px-3 py-2 rounded-md bg-black text-white text-sm">
                    Create Admin
                </Button>
            </DialogTrigger>
            <DialogContent className="overflow-y-auto max-h-[90vh]" >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Create Admin</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 mt-2">
                        <div >
                            <label className="text-sm font-medium">Role</label>
                            <Controller
                                control={control}
                                name="roleId"
                                rules={{ required: "Role is required" }}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent className="w-(--radix-select-trigger-width) bg-white" align="start" position="popper">
                                            {roles.length > 0 ? roles.map((role) => (
                                                <SelectItem key={role.id} value={role.id} className="pr-8 pl-2">
                                                    <span className="block max-w-full truncate">{role.name}</span>
                                                </SelectItem>
                                            )) : (
                                                <SelectItem value="no-roles" className="pr-8 pl-2">
                                                    <span className="block max-w-full truncate">No roles found</span>
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.roleId?.message && (
                                <span className="text-xs text-red-600">{errors.roleId.message}</span>
                            )}
                        </div>
                        <div >
                            <label className="text-sm font-medium">Email</label>
                            <Input type="email" placeholder="jdoe@example.com"
                                {...register('email', {
                                    required: "Email is required",
                                    pattern: {
                                        value: /[^\s@]+@[^\s@]+\.[^\s@]+/,
                                        message: "Enter a valid email",
                                    },
                                })} />
                            {
                                errors.email?.message && (
                                    <span className="text-xs text-red-600">{errors.email.message}</span>
                                )
                            }
                        </div>
                        <div >
                            <label className="text-sm font-medium">Password</label>
                            <Input type="password" placeholder="••••••••" {
                                ...register('password', {
                                    required: "Password is required",
                                    minLength: { value: 4, message: "Minimum 4 characters" },
                                    validate: (value) => {
                                        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
                                            return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
                                        }
                                        return true;
                                    },
                                })
                            } />
                            {
                                errors.password?.message && (
                                    <span className="text-xs text-red-600">{errors.password.message}</span>
                                )
                            }
                        </div>
                        <div >
                            <div >
                                <label className="text-sm font-medium">First name</label>
                                <Input placeholder="John" {
                                    ...register('firstName', {
                                        required: "First name is required",
                                    })
                                } />
                                {
                                    errors.firstName?.message && (
                                        <span className="text-xs text-red-600">{errors.firstName.message}</span>
                                    )
                                }
                            </div>
                            <div >
                                <label className="text-sm font-medium">Last name</label>
                                <Input placeholder="Doe" {
                                    ...register('lastName', {
                                        required: "Last name is required"
                                    })
                                } />
                                {
                                    errors.lastName?.message && (
                                        <span className="text-xs text-red-600">{errors.lastName.message}</span>
                                    )
                                }
                            </div>
                        </div>
                        
                    </div>
                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button className="bg-black text-white" type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}