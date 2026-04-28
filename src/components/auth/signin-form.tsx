/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { GoogleIcon } from "../icons/google";

export function SigninForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Identity required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid structure";
    if (!password) newErrors.password = "Secret Key required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    setIsLoading(true);
    const res = await signIn.email({ email, password });
    setIsLoading(false);
    if (res.error) {
      if (res.error.status === 401) {
        setErrors({
          email: "Invalid credentials",
          password: "Check secret key",
        });
      } else {
        toast.error(res.error.message);
      }
      return;
    }
    router.refresh();
    router.push("/home");
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-8 antialiased">
      <div className="w-full max-w-sm mx-auto space-y-10">
        <div className="space-y-3">
          <h1 className="text-5xl font-black tracking-tighter leading-[0.85]">
            Welcome <br />
            <span className="text-primary/60 italic font-serif font-light text-6xl">
              back.
            </span>
          </h1>
          <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
            Verification required // Accessing the archives
          </p>
        </div>

        <form onSubmit={handleSignin} className="space-y-6">
          <div className="space-y-2 relative">
            <div className="flex justify-between items-end">
              <Label className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">
                Identity.Email
              </Label>
              {errors.email && (
                <span className="text-[9px] font-mono text-destructive uppercase tracking-tighter animate-in fade-in slide-in-from-right-1">
                  // {errors.email}
                </span>
              )}
            </div>
            <Input
              type="email"
              placeholder="name@example.com"
              className={`h-12 bg-transparent border-0 border-b rounded-none px-0 focus-visible:ring-0 transition-all placeholder:text-muted-foreground/30 text-lg ${errors.email ? "border-destructive/50" : "border-border/50 focus-visible:border-primary"}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-end">
              <Label className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">
                Secret.Key
              </Label>
              {errors.password && (
                <span className="text-[9px] font-mono text-destructive uppercase tracking-tighter animate-in fade-in slide-in-from-right-1">
                  // {errors.password}
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`h-12 bg-transparent border-0 border-b rounded-none px-0 pr-10 focus-visible:ring-0 transition-all placeholder:text-muted-foreground/30 text-lg ${errors.password ? "border-destructive/50" : "border-border/50 focus-visible:border-primary"}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: undefined }));
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors px-2 py-1"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <Button
              type="submit"
              className="w-full h-14 rounded-full font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden"
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-2 w-full transition-all duration-200">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-primary">
                    <Loader2 className="h-5 w-5 animate-spin shrink-0" />
                    <span>Accessing...</span>
                  </div>
                )}
                <div
                  className={`flex items-center justify-center gap-2 transition-opacity duration-200 ${isLoading ? "opacity-0" : "opacity-100"}`}
                >
                  <span>Access Journal</span>
                </div>
              </div>
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full h-12 rounded-full font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
              onClick={() =>
                signIn.social({ provider: "google", callbackURL: "/home" })
              }
            >
              <GoogleIcon />
              Continue with Google
            </Button>
          </div>
        </form>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/forgot-password"
            className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors italic"
          >
            Forgot_Password?
          </Link>
          <p className="text-center text-[11px] font-medium text-muted-foreground/60">
            New here?{" "}
            <Link
              href="/signup"
              className="text-foreground font-bold border-b border-primary/40 hover:border-primary transition-all pb-0.5 ml-1"
            >
              Start_New_Journey
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
