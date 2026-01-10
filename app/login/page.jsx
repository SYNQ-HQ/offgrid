"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createPageUrl } from "@/lib/utils";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        console.error("Login error:", res.error);
        setError("Invalid email or password");
      } else {
        router.refresh();
        router.push(from);
      }
    } catch (err) {
      console.error("Login exception:", err);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-black/10 p-8 shadow-sm text-black">
        <Link
          href={createPageUrl("Home")}
          className="flex items-center gap-2 text-black/60 hover:text-[#FF5401] transition-colors duration-300 text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back Home
        </Link>
        
        <h1 className="text-2xl font-light mb-6">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-black/60">Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-black/60">Password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="bg-[#F5EDE4] border-black/10 rounded-none h-10 text-black placeholder:text-black/30"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-[#FF5401] text-white rounded-none h-10"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-black/60">Don't have an account? </span>
          <Link href="/register" className="text-[#FF5401] hover:underline">
            Register
          </Link>
        </div>
      </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5EDE4] flex flex-col items-center justify-center p-6">
      <Suspense fallback={<div className="text-black/50">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}