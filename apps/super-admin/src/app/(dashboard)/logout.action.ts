"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const store = await cookies();
  for (const { name } of store.getAll()) {
    store.delete(name);
  }
  redirect("/login");
}


