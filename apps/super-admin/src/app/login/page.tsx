"use client";
import Image from "next/image";
import { Button } from "@repo/ui/components/ui/button";
import { login } from "./login.action";
import { useRouter } from "next/navigation";
import { useGlobalLoader } from "@repo/ui/components/ui/global-loader";
import { useForm } from "react-hook-form";
import { toast } from "@repo/ui/components/ui/sonner";

export default function Login() {
  const router = useRouter();
  const { showLoader, hideLoader } = useGlobalLoader();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; password: string }>({
    defaultValues: { email: "admin@shipcaptain.com", password: "admin123" },
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  
  const onSubmit = async (data: { email: string; password: string }) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    await handleLogin(formData);
  }
  
  const handleLogin = async (formData: FormData) => {
    try {
      showLoader("Signing in...");
      const result = await login(formData);
      if (result.success) {
        toast.success("Signed in successfully");
        // Delay navigation to allow toast to be visible
        setTimeout(() => {
          router.push("/roles");
        }, 500);
      } else {
        toast.error((result as any)?.message ?? "Invalid email or password");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      hideLoader();
    }
  }
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(1200px_600px_at_-10%_-10%,#E7E2D9,transparent),radial-gradient(900px_500px_at_110%_0%,#EFEDE7,transparent)]">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-[#E7E2D9] blur-3xl" />
        <div className="absolute -right-16 top-24 h-72 w-72 rounded-full bg-[#EFEDE7] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center p-6">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-1">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white/70 p-8 shadow-xl backdrop-blur">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7E2D9]">
                  <Image src="/logo-black.png" alt="Brand logo" width={24} height={24} className="h-6 w-6 object-contain" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="mt-1 text-sm text-black/60">Sign in to your admin account</p>
              </div>

              <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 rounded-md border border-black/20 bg-white px-3 outline-none placeholder-black/40 focus:ring-2 focus:ring-black/20"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /[^\s@]+@[^\s@]+\.[^\s@]+/,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                  {errors.email?.message && (
                    <span className="text-xs text-red-600">{errors.email.message}</span>
                  )}
                </div>
                <div className="grid gap-2">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>                  
                  <input
                    id="password"
                    type="password"
                    className="h-11 rounded-md border border-black/20 bg-white px-3 outline-none focus:ring-2 focus:ring-black/20"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                  />
                  {errors.password?.message && (
                    <span className="text-xs text-red-600">{errors.password.message}</span>
                  )}
                </div>
                <Button
                  type="submit"
                  className="h-11 w-full bg-black text-white cursor-pointer disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
                <a href="#" className="text-xs text-black/60 hover:text-black text-center">Forgot password?</a>

              </form>
              <p className="mt-4 text-center text-xs text-black/50">
                By continuing you agree to our <a href="#" className="underline hover:text-black">Terms</a> and <a href="#" className="underline hover:text-black">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}