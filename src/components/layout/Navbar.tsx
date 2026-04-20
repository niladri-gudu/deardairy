/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemePicker } from "../ui/theme-picker";
import { getGithubStars } from "@/app/actions/github";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

/**
 * Navbar component for WithInk.me
 * Features:
 * - Glassmorphism background with backdrop blur
 * - Dynamic GitHub star fetching via server actions
 * - Thematic branding matching the "Think in ink." landing page
 */
export function Navbar() {
  const [starCount, setStarCount] = useState<number | null>(null);

  const { data: session } = useSession();

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
  }, []);

  const logoHref = session ? "/journal" : "/";

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

          {/* GitHub Star Counter Button */}
          <Link
            href="https://github.com/niladri-gudu/deardiary"
            target="_blank"
            rel="noreferrer"
            className="flex items-center"
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-9 rounded-full px-3 gap-2.5 text-muted-foreground transition-all duration-300",
                "hover:text-foreground border border-transparent hover:border-border/40 hover:bg-muted/30",
              )}
            >
              <GithubIcon className="h-4 w-4" />
              <div className="h-3 w-px bg-muted-foreground/20" />
              <span className="text-xs font-mono font-bold tracking-tighter">
                {starCount !== null ? starCount.toLocaleString() : "..."}
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

/**
 * Internal GithubIcon component to avoid extra lucide-react dependencies
 * and maintain consistent SVG control.
 */
const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
