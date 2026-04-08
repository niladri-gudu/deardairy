"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, User, Mail, Lock, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    setIsLoading(true);
    const res = await signUp.email({ name, email, password });
    setIsLoading(false);

    if (res.error) {
      alert(res.error.message);
      return;
    }

    router.push("/signin");
  };

  return (
    <Card className="w-full max-w-md bg-slate-950 border-slate-800 shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          Create an account
        </CardTitle>
        <CardDescription className="text-slate-400">
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-slate-200">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input
              id="name"
              placeholder="John Doe"
              className="bg-slate-900 border-slate-800 pl-10 text-white focus-visible:ring-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email-signup" className="text-slate-200">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input
              id="email-signup"
              type="email"
              placeholder="name@example.com"
              className="bg-slate-900 border-slate-800 pl-10 text-white focus-visible:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password-signup" className="text-slate-200">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input
              id="password-signup"
              type="password"
              className="bg-slate-900 border-slate-800 pl-10 text-white focus-visible:ring-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all mt-2"
          onClick={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-950 px-2 text-slate-500">
              Or sign up with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
          onClick={() =>
            signIn.social({ provider: "google", callbackURL: "/app" })
          }
        >
          <Home className="mr-2 h-4 w-4" />
          Google
        </Button>
      </CardContent>
    </Card>
  );
}
