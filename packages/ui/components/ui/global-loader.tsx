"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { cn } from "../../lib/utils";

interface GlobalLoaderContextType {
  isLoading: boolean;
  loadingMessage?: string;
  setGlobalLoader: (loading: boolean, message?: string) => void;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

const GlobalLoaderContext = React.createContext<GlobalLoaderContextType | undefined>(undefined);

export function GlobalLoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState<string | undefined>(undefined);
  const loadingCountRef = React.useRef(0);

  const setGlobalLoader = React.useCallback((loading: boolean, message?: string) => {
    if (loading) {
      loadingCountRef.current += 1;
      setIsLoading(true);
      if (message) {
        setLoadingMessage(message);
      }
    } else {
      loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
      if (loadingCountRef.current === 0) {
        setIsLoading(false);
        setLoadingMessage(undefined);
      }
    }
  }, []);

  const showLoader = React.useCallback((message?: string) => {
    setGlobalLoader(true, message);
  }, [setGlobalLoader]);

  const hideLoader = React.useCallback(() => {
    setGlobalLoader(false);
  }, [setGlobalLoader]);

  const value = React.useMemo(
    () => ({
      isLoading,
      loadingMessage,
      setGlobalLoader,
      showLoader,
      hideLoader,
    }),
    [isLoading, loadingMessage, setGlobalLoader, showLoader, hideLoader]
  );

  return (
    <GlobalLoaderContext.Provider value={value}>
      {children}
    </GlobalLoaderContext.Provider>
  );
}

export function useGlobalLoader() {
  const context = React.useContext(GlobalLoaderContext);
  if (context === undefined) {
    throw new Error("useGlobalLoader must be used within a GlobalLoaderProvider");
  }
  return context;
}

export function GlobalLoader() {
  const { isLoading, loadingMessage } = useGlobalLoader();

  if (!isLoading) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center",
        "bg-black/30 backdrop-blur-sm",
        "transition-opacity duration-200"
      )}
      style={{ zIndex: 9999 }}
      aria-busy={isLoading}
      aria-live="polite"
      role="status"
      data-testid="global-loader"
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4",
          "rounded-2xl border-2 border-black/20 bg-gray-400 p-8 shadow-2xl",
          "min-w-[200px]"
        )}
      >
        <Loader2Icon className="size-8 animate-spin text-black" />
        {loadingMessage && (
          <p className="text-sm font-medium text-black/80">
            {loadingMessage}
          </p>
        )}
      </div>
    </div>
  );
}

