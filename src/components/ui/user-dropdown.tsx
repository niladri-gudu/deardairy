/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  Settings,
  MessageSquareWarning,
  LifeBuoy,
  LogOut,
  User,
} from "lucide-react";
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
import { FeedbackModal } from "../journal/feedback-modal";
import { SettingsModal } from "../settings/settings-modal";
import Image from "next/image"; 

interface UserDropdownProps {
  session: any;
}

export function UserDropdown({ session }: UserDropdownProps) {
  const [activeView, setActiveView] = React.useState<"issue" | "feedback" | "settings" | null>(
    null,
  );

  if (!session?.user) return null;

  // 🚀 Standardized Fallback Logic
  const userImage = session.user.image;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full border border-border/40 p-0 overflow-hidden hover:bg-muted/30 transition-all group"
          >
            {userImage ? (
              <Image
                src={userImage}
                alt={session.user.name ?? "Avatar"}
                fill
                className="object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
                unoptimized // 🚀 Helps with external URLs like Google if they vary
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
            <div className="flex items-center gap-3">
              {/* 🚀 Mini Avatar in Label */}
              <div className="relative h-8 w-8 rounded-full overflow-hidden border border-border/40 shrink-0">
                {userImage ? (
                  <Image src={userImage} alt="User" fill className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-secondary flex items-center justify-center"><User size={12} /></div>
                )}
              </div>
              <div className="flex flex-col space-y-0.5 overflow-hidden">
                <p className="text-sm font-bold leading-none tracking-tight text-foreground truncate">
                  {session.user.name}
                </p>
                <p className="text-[9px] leading-none text-muted-foreground font-mono tracking-widest opacity-60 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-border/40 mx-2" />

          <div className="space-y-1 pt-1.5">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setActiveView("settings");
              }}
              className="gap-3 cursor-pointer rounded-xl py-2.5 px-3 focus:bg-accent focus:text-accent-foreground transition-colors"
            >
              <Settings className="h-4 w-4 opacity-70" />
              <span className="text-sm font-medium">Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setActiveView("issue");
              }}
              className="gap-3 cursor-pointer rounded-xl py-2.5 px-3 focus:bg-accent focus:text-accent-foreground transition-colors"
            >
              <MessageSquareWarning className="h-4 w-4 opacity-70" />
              <span className="text-sm font-medium">Report an Issue</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setActiveView("feedback");
              }}
              className="gap-3 cursor-pointer rounded-xl py-2.5 px-3 focus:bg-accent focus:text-accent-foreground transition-colors"
            >
              <LifeBuoy className="h-4 w-4 opacity-70" />
              <span className="text-sm font-medium">Feedback</span>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="bg-border/40 mx-2 mt-1.5" />

          <div className="pt-1.5 pb-0.5">
            <DropdownMenuItem
              className={cn(
                "gap-3 cursor-pointer rounded-[22px] py-3 px-4 transition-all duration-200 text-red-500 font-semibold tracking-tight focus:bg-red-500/10 focus:text-red-500 focus:scale-[0.98] active:scale-95",
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

      <SettingsModal 
        user={session.user} 
        open={activeView === "settings"} 
        onOpenChange={(open) => !open && setActiveView(null)} 
      />

      <FeedbackModal
        type={activeView === "feedback" ? "feedback" : "issue"}
        open={activeView === "issue" || activeView === "feedback"}
        onOpenChange={(open) => !open && setActiveView(null)}
      />
    </>
  );
}