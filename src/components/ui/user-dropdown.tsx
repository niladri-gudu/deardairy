/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Settings, MessageSquareWarning, LifeBuoy, LogOut, User } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserDropdownProps {
  session: any;
}

export function UserDropdown({ session }: UserDropdownProps) {
  if (!session?.user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full border border-border/40 p-0 overflow-hidden hover:bg-muted/30 transition-all"
        >
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name ?? "Avatar"}
              className="h-full w-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted/50 text-muted-foreground">
              <User className="h-4 w-4" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 mt-3 rounded-4xl border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl antialiased p-2"
      >
        <DropdownMenuLabel className="font-normal px-3 py-4">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-bold leading-none tracking-tight text-foreground">
              {session.user.name}
            </p>
            <p className="text-[10px] leading-none text-muted-foreground font-mono tracking-widest opacity-60">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-border/40 mx-2" />

        <div className="space-y-1 pt-1.5">
          {/* Settings - The primary destination */}
          <DropdownMenuItem className="gap-3 cursor-pointer rounded-xl py-2.5 px-3 focus:bg-accent focus:text-accent-foreground transition-colors">
            <Settings className="h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">Settings</span>
          </DropdownMenuItem>

          {/* Support / Issue Reporting */}
          <DropdownMenuItem className="gap-3 cursor-pointer rounded-xl py-2.5 px-3 focus:bg-accent focus:text-accent-foreground transition-colors">
            <MessageSquareWarning className="h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">Report an Issue</span>
          </DropdownMenuItem>

          {/* General Help / Feedback */}
          <DropdownMenuItem className="gap-3 cursor-pointer rounded-xl py-2.5 px-3 focus:bg-accent focus:text-accent-foreground transition-colors">
            <LifeBuoy className="h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">Feedback</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-border/40 mx-2 mt-1.5" />

        <div className="pt-1.5 pb-0.5">
<DropdownMenuItem
  // We override the CSS variable locally so the component "thinks" 
  // the highlight color should be red.
  style={{ "--accent-foreground": "239 68 68" } as React.CSSProperties} 
  className={cn(
    "gap-3 cursor-pointer rounded-[22px] py-3 px-4 transition-all duration-200",
    "text-red-500 font-semibold tracking-tight",
    "focus:bg-red-500/10 focus:text-red-500",
    "focus:scale-[0.98] active:scale-95"
  )}
  onClick={async () => {
    await signOut();
    window.location.href = "/";
  }}
>
  <LogOut className="h-4 w-4 stroke-[2.5px]" />
  <span className="text-sm">Sign out</span>
</DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}