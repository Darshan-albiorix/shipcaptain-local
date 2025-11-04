'use client'
import { GlobalLoaderProvider, GlobalLoader } from "@repo/ui/components/ui/global-loader";
import { Toaster } from "@repo/ui/components/ui/sonner";

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <GlobalLoaderProvider>
      <GlobalLoader />
      <Toaster position="top-right" richColors />
      {children}
    </GlobalLoaderProvider>
  )
}