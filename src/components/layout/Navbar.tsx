/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, LayoutDashboard, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemePicker } from "../ui/theme-picker";
import { getGithubStars } from "@/app/actions/github";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDropdown } from "../ui/user-dropdown";
import { GithubIcon } from "../icons/github";

/**
 * Navbar component for WithInk.me
 * Features:
 * - Glassmorphism background with backdrop blur
 * - Dynamic GitHub star fetching via server actions
 * - Thematic branding matching the "Think in ink." landing page
 */
export function Navbar() {
  const pathname = usePathname();
  const [starCount, setStarCount] = useState<number | null>(null);
  const { data: session } = useSession();

  const isJournalPage = pathname.startsWith("/journal");
  const logoHref = session ? "/journal" : "/";

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const stars = await getGithubStars();
        setStarCount(stars);
      } catch (error) {
        console.error("Error fetching GitHub stars:", error);
        setStarCount(null);
      }
    };
    fetchStars();
  }, [isJournalPage]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-md antialiased border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Brand Section */}
        <Link
          href={logoHref}
          className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
        >
          <PenLine className="h-4 w-4 text-primary group-hover:-rotate-12 transition-transform duration-300" />
          <span className="text-xl font-extrabold tracking-tighter">
            withink
            <span className="text-primary/60 italic font-serif font-light text-2xl ml-0.5">
              .
            </span>
          </span>
        </Link>

        {/* Right Actions: Theme & GitHub */}
        <div className="flex items-center gap-3">
          <ThemePicker />

          <div className="h-4 w-px bg-border/60 mx-1" />

          {session ? (
            isJournalPage ? (
              <UserDropdown session={session} />
            ) : (
              <Link href="/journal">
                <Button
                  size="sm"
                  className="h-9 rounded-full px-5 font-bold tracking-tight gap-2 shadow-sm"
                >
                  Go to Journal
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
              </Link>
            )
          ) : (
            <Link
              href="https://github.com/niladri-gudu/deardiary"
              target="_blank"
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-full px-3 gap-2.5 text-muted-foreground hover:text-foreground"
              >
                <GithubIcon className="h-4 w-4" />
                <div className="h-3 w-px bg-muted-foreground/20" />
                <span className="text-xs font-mono font-bold tracking-tighter">
                  {starCount ?? "..."}
                </span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}