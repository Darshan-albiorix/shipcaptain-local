"use client";

import { ReactNode, useState, useTransition } from "react";
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

interface ConfirmDeleteButtonProps {
  onConfirm?: () => Promise<void> | void;
  serverAction?: (formData: FormData) => Promise<void> | void;
  payload?: Record<string, string>;
  title?: string;
  description?: string;
  name?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  trigger?: ReactNode;
  confirmClassName?: string;
  ariaLabel?: string;
}

export function DeleteRoleButton({
  onConfirm,
  serverAction,
  payload,
  title = "Delete",
  description,
  name,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  trigger,
  confirmClassName = "bg-red-600 text-white hover:bg-red-700",
  ariaLabel,
}: ConfirmDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        if (onConfirm) {
          await onConfirm();
        }
      } finally {
        setOpen(false);
      }
    });
  };

  const finalTitle = title || "Delete";
  const finalDescription =
    description ||
    (name
      ? `Are you sure you want to delete "${name}"? This action cannot be undone.`
      : "Are you sure you want to delete this item? This action cannot be undone.");

  const finalAriaLabel =
    ariaLabel || (name ? `Delete ${name}` : "Delete item");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          // Custom trigger provided
          <span>{trigger}</span>
        ) : (
          <button
            type="button"
            className="p-1 rounded hover:bg-red-50 cursor-pointer"
            aria-label={finalAriaLabel}
          >
            <Trash size={20} strokeWidth={2} className="text-gray-500 hover:text-red-500" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{finalTitle}</DialogTitle>
          <DialogDescription>{finalDescription}</DialogDescription>
        </DialogHeader>
        {serverAction ? (
          <form action={serverAction}>
            {payload &&
              Object.entries(payload).map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
              ))}
            <DialogFooter>
              <Button
                variant="ghost"
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {cancelLabel}
              </Button>
              <Button
                type="submit"
                className={confirmClassName}
                disabled={isPending}
              >
                {isPending ? `${confirmLabel}...` : confirmLabel}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <DialogFooter>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              className={confirmClassName}
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? `${confirmLabel}...` : confirmLabel}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}



