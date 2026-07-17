"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase";
import { loginSchema } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useCooldown } from "@/hooks/useCooldown";
import { z } from "zod";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const { cooldown, startCooldown } = useCooldown(3);

  const onSubmit = async (data: LoginForm) => {
    startCooldown();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      const isRateLimit =
        (error as any)?.status === 429 ||
        error.message?.toLowerCase().includes("rate limit") ||
        error.message?.toLowerCase().includes("429") ||
        error.message?.toLowerCase().includes("too many requests");

      if (isRateLimit) {
        toast({
          title: "Too many attempts",
          description: "Rate limit reached — please wait a few minutes and try again.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen brutal-bg-light flex items-center justify-center p-4 relative">
      {/* Grid background */}
      <div className="absolute inset-0 brutal-grid-bg" />

      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-bold brutal-text-dark hover:underline z-10"
        style={{ textDecorationThickness: "2px", textDecorationColor: "var(--mint)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="brutal-card-flat p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 brutal-bg-mint brutal-border-3 brutal-monogram text-xl">S</div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black brutal-text-dark mb-1">Welcome back</h1>
            <p className="text-sm font-bold brutal-text-muted">Sign in to your SiteMint account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold brutal-text-dark">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={errors.email ? "" : ""}
                style={{
                  borderRadius: 0,
                  border: `3px solid ${errors.email ? "#DC2626" : "var(--brutal-black)"}`,
                }}
              />
              {errors.email && (
                <p className="text-xs font-bold" style={{ color: "#DC2626" }}>{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold brutal-text-dark">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  style={{
                    borderRadius: 0,
                    border: `3px solid ${errors.password ? "#DC2626" : "var(--brutal-black)"}`,
                    paddingRight: "2.5rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 brutal-text-muted hover:brutal-text-dark"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-bold" style={{ color: "#DC2626" }}>{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-bold hover:underline"
                style={{ color: "var(--mint-deep)", textDecorationThickness: "2px" }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="brutal-btn brutal-btn-mint w-full justify-center text-base py-3"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {cooldown > 0 ? "Please wait..." : "Signing in..."}</>
              ) : cooldown > 0 ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Wait {cooldown}s</>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Guest login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full" style={{ borderTop: "3px solid var(--brutal-black)" }} />
              </div>
              <div className="relative flex justify-center text-xs font-bold">
                <span className="px-3 brutal-bg-light brutal-text-muted">OR</span>
              </div>
            </div>

            <button
              onClick={async () => {
                setLoading(true);
                const { error } = await supabase.auth.signInAnonymously({
                  options: { data: { is_guest: true, display_name: "Guest" } },
                });
                if (error) {
                  const isSupabaseDisabled =
                    (error as any)?.status === 400 &&
                    (error.message?.toLowerCase().includes("anonymous") ||
                     error.message?.toLowerCase().includes("disabled"));

                  if (isSupabaseDisabled) {
                    toast({
                      title: "Guest sign-in not available",
                      description:
                        "Enable anonymous sign-ins in your Supabase dashboard: " +
                        "Authentication → Settings → Anonymous Sign-Ins.",
                      variant: "destructive",
                    });
                  } else {
                    toast({ title: "Error", description: error.message, variant: "destructive" });
                  }
                  setLoading(false);
                } else {
                  router.push("/dashboard");
                }
              }}
              disabled={loading}
              className="brutal-btn w-full justify-center text-base py-3 mt-6"
              style={{
                background: "var(--brutal-black)",
                color: "#ffffff",
                boxShadow: "6px 6px 0px var(--brutal-black)",
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Continue as Guest
            </button>

            <p className="text-xs font-bold text-center mt-3 brutal-text-muted">
              No sign-up needed. Your data is saved locally.
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-bold brutal-text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" style={{ color: "var(--mint-deep)" }} className="hover:underline font-black">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
