"use client";

import { useState, useTransition } from "react";
import { Trash } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { deleteRole } from "./role.actions";

interface DeleteRoleButtonProps {
  id: string;
  name: string;
}

export function DeleteRoleButton({ id, name }: DeleteRoleButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onConfirm() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", id);
      try {
        await deleteRole(formData);
      } finally {
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="p-1 rounded hover:bg-red-50 cursor-pointer"
          aria-label={`Delete role ${name}`}
        >
          <Trash size={20} strokeWidth={2} className="text-gray-500 hover:text-red-500" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete role</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            type="button"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



