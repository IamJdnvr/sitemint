"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase";
import { forgotPasswordSchema } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type ForgotForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotForm) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/login`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  // ─── Sent state ──────────────────────────────────────────
  if (sent) {
    return (
      <div className="min-h-screen brutal-bg-light flex items-center justify-center p-4 relative">
        <div className="absolute inset-0 brutal-grid-bg" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="brutal-card-mint p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 brutal-bg-white brutal-border-3 flex items-center justify-center">
              <CheckCircle className="w-10 h-10" style={{ color: "var(--mint-deep)" }} />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Check your email</h2>
            <p className="text-sm font-bold mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
              We&apos;ve sent you a password reset link. Please check your inbox.
            </p>
            <Link href="/auth/login">
              <span className="brutal-btn" style={{ borderColor: "#ffffff", color: "var(--brutal-black)" }}>
                Back to login
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Form state ─────────────────────────────────────────
  return (
    <div className="min-h-screen brutal-bg-light flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 brutal-grid-bg" />

      <Link
        href="/auth/login"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-bold brutal-text-dark hover:underline z-10"
        style={{ textDecorationThickness: "2px", textDecorationColor: "var(--mint)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
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
            <h1 className="text-2xl font-black brutal-text-dark mb-1">Reset password</h1>
            <p className="text-sm font-bold brutal-text-muted">
              Enter your email and we&apos;ll send you a reset link
            </p>
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

            <button
              type="submit"
              disabled={loading}
              className="brutal-btn brutal-btn-mint w-full justify-center text-base py-3"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
