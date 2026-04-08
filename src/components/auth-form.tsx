"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const signUp = async () => {
    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onSuccess: () => alert("Account created in MongoDB!"),
        onError: (ctx) => alert(ctx.error.message),
      },
    );
  };

  const signIn = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => (window.location.href = "/dashboard"),
        onError: (ctx) => alert(ctx.error.message),
      },
    );
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={signUp} className="bg-blue-500 text-white">
        Sign Up
      </button>
      <button onClick={signIn} className="bg-gray-500 text-white">
        Sign In
      </button>
    </div>
  );
}
