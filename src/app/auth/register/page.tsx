"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase";
import { registerSchema } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useCooldown } from "@/hooks/useCooldown";
import { z } from "zod";

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const { cooldown, startCooldown } = useCooldown(3);

  const onSubmit = async (data: RegisterForm) => {
    startCooldown();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { display_name: data.email.split("@")[0] } },
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
      toast({ title: "Success!", description: "Welcome to SiteMint!", variant: "success" });
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen brutal-bg-light flex items-center justify-center p-4 relative">
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
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 brutal-bg-mint brutal-border-3 brutal-monogram text-xl">S</div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black brutal-text-dark mb-1">Create your account</h1>
            <p className="text-sm font-bold brutal-text-muted">Start building your website in minutes</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold brutal-text-dark">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
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
                  placeholder="At least 6 characters"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-bold brutal-text-dark">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  {...register("confirmPassword")}
                  style={{
                    borderRadius: 0,
                    border: `3px solid ${errors.confirmPassword ? "#DC2626" : "var(--brutal-black)"}`,
                    paddingRight: "2.5rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 brutal-text-muted hover:brutal-text-dark"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-bold" style={{ color: "#DC2626" }}>{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="brutal-btn brutal-btn-mint w-full justify-center text-base py-3"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {cooldown > 0 ? "Please wait..." : "Creating account..."}</>
              ) : cooldown > 0 ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Wait {cooldown}s</>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-xs font-bold text-center brutal-text-muted">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-bold brutal-text-muted">
              Already have an account?{" "}
              <Link href="/auth/login" style={{ color: "var(--mint-deep)" }} className="hover:underline font-black">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
