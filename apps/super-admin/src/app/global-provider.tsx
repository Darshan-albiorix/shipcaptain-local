'use client'
import { Toaster } from "@repo/ui/components/ui/sonner";
import { GlobalLoaderProvider, GlobalLoader } from "@repo/ui/components/ui/global-loader";

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <GlobalLoaderProvider>
      <Toaster position="top-right" richColors />
      <GlobalLoader />
      {children}
    </GlobalLoaderProvider>
  )
}