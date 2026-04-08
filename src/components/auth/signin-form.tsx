"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, Home } from "lucide-react";

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

export function SigninForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignin = async () => {
    setIsLoading(true);
    const res = await signIn.email({ email, password });
    setIsLoading(false);

    if (res.error) {
      alert(res.error.message);
      return;
    }

    router.refresh();

    router.push("/app");
  };

  return (
    <Card className="w-full max-w-md bg-slate-950 border-slate-800 shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          Welcome back
        </CardTitle>
        <CardDescription className="text-slate-400">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-slate-200">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="bg-slate-900 border-slate-800 pl-10 text-white focus-visible:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password" className="text-slate-200">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input
              id="password"
              type="password"
              className="bg-slate-900 border-slate-800 pl-10 text-white focus-visible:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all"
          onClick={handleSignin}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-950 px-2 text-slate-500">
              Or continue with
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
