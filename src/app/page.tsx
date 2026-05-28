/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ImageIcon,
  List,
  Italic,
  Bold,
  Undo,
  Redo,
  Flame,
  Hash,
  Type,
  LayoutDashboard,
  Lock,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { GithubIcon } from "@/components/icons/github";
import { useSession } from "@/lib/auth-client";

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.08] -z-20 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-primary/10 via-background/0 to-transparent -z-20 pointer-events-none" />

      {/* HERO SECTION */}
      <header className="relative max-w-7xl mx-auto pt-32 md:pt-48 pb-20 md:pb-32 px-6 grid lg:grid-cols-2 gap-16 md:gap-12 items-center">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse duration-1000" />

        <div className="text-left space-y-6 md:space-y-10 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-border/50 bg-background/50 backdrop-blur-md text-muted-foreground text-[11px] font-mono tracking-tight shadow-sm">
            <span
              className={cn(
                "flex h-2 w-2 rounded-full",
                session ? "bg-green-500 animate-pulse" : "bg-primary animate-pulse",
              )}
            />
            {session ? "System Active" : "v1.0.0 — The Private Sanctuary"}
          </div>

          <h1 className="text-[clamp(4rem,12vw,8.5rem)] font-black tracking-tighter leading-[0.8] drop-shadow-sm">
            Think in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary/80 to-muted-foreground italic font-serif font-light pr-8">
              ink.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed font-medium">
            A sanctuary for your digital thoughts. No distractions, no tracking,
            just a clean slate for your mind to breathe.
          </p>

          {/* ACTION AREA */}
          <div className="flex flex-col gap-6 pt-4">
            <div className="flex flex-col sm:flex-row gap-4 md:gap-5">
              <Link
                href={session ? "/home" : "/signup"}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="w-full rounded-2xl px-10 h-14 md:h-16 font-bold text-lg shadow-[0_0_40px_rgba(var(--primary),0.2)] hover:shadow-[0_0_60px_rgba(var(--primary),0.4)] hover:-translate-y-1 transition-all duration-300"
                >
                  {session ? "Enter Workspace" : "Start Writing"}
                  {session ? (
                    <LayoutDashboard className="ml-2 h-5 w-5" />
                  ) : (
                    <ArrowRight className="ml-2 h-5 w-5" />
                  )}
                </Button>
              </Link>

              <Link
                href="https://github.com/niladri-gudu/withink"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-2xl px-10 h-14 md:h-16 font-mono text-sm border-border/50 bg-background/50 backdrop-blur-md hover:bg-muted/50 transition-all duration-300"
                >
                  <GithubIcon className="mr-2 h-5 w-5" />
                  Source Code
                </Button>
              </Link>
            </div>

            {!session && (
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground/60">
                <div className="h-px w-10 bg-border/80" />
                <span>Returning to your sanctuary?</span>
                <Link
                  href="/signin"
                  className="text-foreground hover:text-primary transition-colors font-bold underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Editor Mockup Hero Visual */}
        <div className="relative hidden lg:block perspective-1000">
          <div className="absolute -inset-10 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 blur-3xl opacity-60 rounded-full" />
          <div className="relative border border-border/40 bg-card/60 backdrop-blur-2xl rounded-[40px] p-12 shadow-2xl rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-0 hover:scale-[1.02] transition-all duration-700 ease-out group">
            <div className="space-y-2 mb-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                  <span className="text-[11px] font-mono uppercase tracking-widest opacity-60">
                    AES-256 Encrypted
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] px-3 py-1 rounded-full font-bold">
                    #reflection
                  </span>
                  <span className="bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                    <Flame className="w-3 h-3" /> 12 day streak
                  </span>
                </div>
              </div>
              <h2 className="text-4xl font-black tracking-tighter font-sans pt-4">
                on finding focus.
              </h2>
              <p className="text-sm font-medium opacity-40 italic">
                Wednesday, April 15, 2026
              </p>
            </div>
            <div className="space-y-6 font-serif text-xl leading-relaxed opacity-90 text-left">
              <p>
                Some days, the goal isn&apos;t to be productive—it&apos;s just
                to be{" "}
                <span className="bg-primary/15 border border-primary/20 px-1.5 py-0.5 rounded-md text-primary font-mono text-base mx-1 shadow-sm">
                  present
                </span>
                . Writing things down helps pull the signal from the noise.
              </p>
              <p>
                There is a certain clarity that only comes when you stop moving
                and start reflecting.
              </p>
              <p className="border-l-4 border-primary/30 pl-5 italic opacity-70 text-2xl font-light mt-8">
                Focus on the process, not the record.
              </p>
            </div>

            {/* MINIMALIST MOCK TOOLBAR */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[75%] h-14 bg-background/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center justify-center gap-10 px-8 transition-all group-hover:scale-105 group-hover:-bottom-10 duration-500 ease-out">
              <div className="flex items-center gap-5">
                <Undo className="h-4 w-4 text-muted-foreground/40 hover:text-foreground cursor-pointer transition-colors" />
                <Redo className="h-4 w-4 text-muted-foreground/40 hover:text-foreground cursor-pointer transition-colors" />
              </div>
              <div className="h-6 w-px bg-border/50" />
              <div className="flex items-center gap-6">
                <Type className="h-4 w-4 text-muted-foreground/60 hover:text-foreground cursor-pointer transition-colors" />
                <Bold className="h-4 w-4 text-foreground cursor-pointer transition-colors" />
                <Italic className="h-4 w-4 text-muted-foreground/60 hover:text-foreground cursor-pointer transition-colors" />
              </div>
              <div className="h-6 w-px bg-border/50" />
              <div className="flex items-center gap-6">
                <List className="h-4 w-4 text-muted-foreground/40 hover:text-foreground cursor-pointer transition-colors" />
                <Hash className="h-4 w-4 text-primary drop-shadow-sm cursor-pointer" />
                <ImageIcon className="h-4 w-4 text-muted-foreground/40 hover:text-foreground cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* STATS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="flex flex-col items-center text-center space-y-4 mb-16 md:mb-24">
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.4em] font-bold">
            System Specifications
          </p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            Built for{" "}
            <span className="text-muted-foreground/40 italic font-serif font-light">
              longevity.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border border-border/50 rounded-[32px] overflow-hidden bg-card/20 backdrop-blur-sm shadow-xl">
          {[
            { label: "Security", value: "AES-256" },
            { label: "Habits", value: "Streaks" },
            { label: "Media", value: "R2 Hosted" },
            { label: "Themes", value: "Curated" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "flex flex-col gap-2 p-8 md:p-12 group hover:bg-muted/30 transition-colors duration-300",
                i % 2 === 0 ? "border-r border-border/50" : "",
                i < 2 ? "border-b md:border-b-0 border-border/50" : "",
                i === 1 ? "md:border-r border-border/50" : "",
                i === 2 ? "md:border-r border-border/50" : "",
              )}
            >
              <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground/50 group-hover:text-primary transition-colors duration-300">
                {stat.label}
              </span>
              <span className="text-2xl md:text-4xl font-black tracking-tight drop-shadow-sm">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32 space-y-24 md:space-y-48">
        <div className="flex flex-col items-center text-center space-y-4 mb-16 md:mb-32">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-balance">
            Purposefully{" "}
            <span className="text-muted-foreground/40 italic font-serif font-light">
              minimal.
            </span>
          </h2>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.4em] font-bold">
            The complete toolkit
          </p>
        </div>

        <div className="grid grid-cols-1 gap-24 md:gap-40">
          <FeatureRow
            num="01"
            title="Focus & Habit"
            desc="Keep the momentum alive with built-in streak tracking and reflection heatmaps. Consistency is the only metric that matters."
            mockup={<HeatmapMockup />}
          />
          <FeatureRow
            num="02"
            title="Aesthetic Variety"
            desc="Personalize your writing environment with custom themes. Switch between modes that complement your focus and environment."
            mockup={<ThemeMockup />}
            reverse
          />
          <FeatureRow
            num="03"
            title="Military-Grade Privacy"
            desc="AES-256 client-side encryption ensures your deepest thoughts remain yours. Private by default, secure by design."
            mockup={<PrivacyMockup />}
          />
          <FeatureRow
            num="04"
            title="Seamless Media"
            desc="Effortlessly integrate images into your narrative. Hosted securely on Cloudflare R2 for lightning-fast, persistent memories."
            mockup={<MediaMockup />}
            reverse
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24 md:py-48 text-center relative">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full -z-10" />
        <div className="bg-card/40 border border-border/50 rounded-[40px] md:rounded-[60px] p-12 md:p-32 backdrop-blur-md shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-10 group-hover:bg-primary/20 transition-colors duration-700" />
          
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 md:mb-10 text-balance">
            {session ? "Welcome back." : "Ready to write?"}
          </h2>
          
          <div className="flex flex-col items-center gap-6">
            <Link
              href={session ? "/home" : "/signup"}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="rounded-full px-10 md:px-14 h-14 md:h-16 font-bold text-lg md:text-xl w-full sm:w-auto shadow-xl shadow-primary/20 hover:scale-105 hover:shadow-primary/30 transition-all duration-300"
              >
                {session ? "Continue Writing" : "Open your diary"}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            
            {!session && (
              <Link
                href="/signin"
                className="text-sm md:text-base font-medium opacity-50 hover:opacity-100 hover:text-primary transition-all underline underline-offset-4 decoration-transparent hover:decoration-primary/50"
              >
                I already have an account
              </Link>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* --- COMPONENTS --- */

interface FeatureRowProps {
  num: string;
  title: string;
  desc: string;
  mockup: React.ReactNode;
  reverse?: boolean;
}

function FeatureRow({ num, title, desc, mockup, reverse }: FeatureRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row gap-12 md:gap-20 items-center group",
        reverse && "md:flex-row-reverse",
      )}
    >
      <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
        <span className="text-7xl md:text-[10rem] leading-none font-serif italic text-primary/5 select-none block -mb-6 md:-mb-12 font-black transition-colors duration-700 group-hover:text-primary/10">
          {num}
        </span>
        <h3 className="text-4xl md:text-6xl font-black tracking-tighter">
          {title}
        </h3>
        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-lg mx-auto md:mx-0 font-medium">
          {desc}
        </p>
      </div>
      <div className="flex-1 w-full flex justify-center items-center relative z-0">
        <div className="relative w-full max-w-sm aspect-square md:max-w-none md:w-[500px] md:h-[500px]">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-[80px] opacity-50 group-hover:opacity-100 group-hover:bg-primary/10 transition-all duration-700" />
          <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.02]">
            {mockup}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- MOCKUPS --- */

function HeatmapMockup() {
  const [grid, setGrid] = useState<number[][]>([]);

  useEffect(() => {
    const cols = 14;
    const rows = 7;
    const newGrid = Array.from({ length: cols }).map(() =>
      Array.from({ length: rows }).map(() => {
        const isActive = Math.random() > 0.4;
        return isActive ? Math.floor(Math.random() * 5) + 1 : 0;
      })
    );
    setGrid(newGrid);
  }, []);

  return (
    <div className="w-full h-full border border-border/50 bg-card/40 backdrop-blur-xl rounded-[40px] md:rounded-[60px] flex flex-col items-center justify-center p-8 shadow-2xl">
      <div className="w-full max-w-[280px]">
        <div className="flex items-center justify-between mb-6 opacity-60">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Activity</span>
          <Flame className="w-4 h-4 text-orange-500" />
        </div>
        <div className="flex gap-2 justify-center">
          {grid.length > 0 ? (
            grid.map((col, c) => (
              <div key={c} className="flex flex-col gap-2">
                {col.map((val, r) => {
                  const opacities = [
                    "bg-muted/20 border-border/10", 
                    "bg-primary/20 border-primary/10", 
                    "bg-primary/40 border-primary/20", 
                    "bg-primary/60 border-primary/30", 
                    "bg-primary/80 border-primary/40", 
                    "bg-primary border-primary/50 shadow-[0_0_8px_rgba(var(--primary),0.6)]"
                  ];
                  return (
                    <div
                      key={r}
                      className={cn(
                        "w-3.5 h-3.5 rounded-[3px] border transition-all duration-1000",
                        opacities[val]
                      )}
                      style={{ transitionDelay: `${(c * 7 + r) * 15}ms` }}
                    />
                  );
                })}
              </div>
            ))
          ) : (
            <div className="h-32 w-full animate-pulse bg-muted/20 rounded-xl" />
          )}
        </div>
      </div>
    </div>
  );
}

function ThemeMockup() {
  const [activeTheme, setActiveTheme] = useState(0);
  const themes = [
    { name: "Zen", bg: "#f8f9fa", primary: "#212529", muted: "#e9ecef" },
    { name: "Moonlight", bg: "#0f172a", primary: "#818cf8", muted: "#1e293b" },
    { name: "Matrix", bg: "#000000", primary: "#4ade80", muted: "#111111" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTheme((prev) => (prev + 1) % themes.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [themes.length]);

  const t = themes[activeTheme];

  return (
    <div className="w-full h-full border border-border/50 bg-card/40 backdrop-blur-xl rounded-[40px] md:rounded-[60px] flex items-center justify-center p-8 shadow-2xl">
      <div 
        className="w-full max-w-[280px] rounded-3xl p-8 transition-colors duration-1000 shadow-2xl border border-white/5"
        style={{ backgroundColor: t.bg }}
      >
        <div className="flex gap-3 mb-8 justify-center">
          {themes.map((theme, i) => (
            <div
              key={theme.name}
              className="w-6 h-6 rounded-full border-2 transition-all duration-500 flex items-center justify-center"
              style={{ 
                borderColor: activeTheme === i ? theme.primary : "transparent",
                opacity: activeTheme === i ? 1 : 0.4
              }}
            >
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.primary }}
              />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-6 w-3/4 rounded-md transition-colors duration-1000" style={{ backgroundColor: t.primary, opacity: 0.9 }} />
          <div className="h-4 w-full rounded-md transition-colors duration-1000" style={{ backgroundColor: t.primary, opacity: 0.3 }} />
          <div className="h-4 w-5/6 rounded-md transition-colors duration-1000" style={{ backgroundColor: t.primary, opacity: 0.3 }} />
          <div className="h-4 w-4/6 rounded-md transition-colors duration-1000" style={{ backgroundColor: t.primary, opacity: 0.3 }} />
        </div>
      </div>
    </div>
  );
}

function PrivacyMockup() {
  const [isLocked, setIsLocked] = useState(false);
  const [text, setText] = useState("Dear diary, today I found absolute clarity.");
  const original = "Dear diary, today I found absolute clarity.";
  const chars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLocked((prev) => !prev);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLocked) {
      let iteration = 0;
      const interval = setInterval(() => {
        setText(original.split("").map((char, index) => {
          if (index < iteration) return chars[Math.floor(Math.random() * chars.length)];
          return char;
        }).join(""));
        if (iteration >= original.length) clearInterval(interval);
        iteration += 1;
      }, 20);
      return () => clearInterval(interval);
    } else {
      setText(original);
    }
  }, [isLocked]);

  return (
    <div className="w-full h-full border border-border/50 bg-card/40 backdrop-blur-xl rounded-[40px] md:rounded-[60px] flex items-center justify-center p-8 shadow-2xl relative">
      <div className="relative w-full max-w-[300px] bg-background/80 border border-border/80 rounded-2xl p-8 shadow-2xl font-mono text-sm break-all h-40 flex flex-col justify-center overflow-hidden">
        <div className={cn("absolute top-4 right-4 transition-all duration-500", isLocked ? "text-primary" : "text-muted-foreground/40")}>
          {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
        </div>
        <div className={cn("transition-colors duration-300 text-lg leading-relaxed mt-2", isLocked ? "text-primary/60 font-bold tracking-widest" : "text-foreground")}>
          {text}
        </div>
        {isLocked && (
           <div className="absolute inset-0 bg-primary/5 backdrop-blur-[2px] rounded-2xl transition-all duration-500" />
        )}
      </div>
    </div>
  );
}

function MediaMockup() {
  return (
    <div className="w-full h-full border border-border/50 bg-card/40 backdrop-blur-xl rounded-[40px] md:rounded-[60px] flex items-center justify-center p-8 shadow-2xl overflow-hidden relative group">
      <div className="relative w-full h-full max-w-[320px] max-h-[320px]">
        {/* Image 1 */}
        <div className="absolute top-8 left-4 w-40 h-48 bg-background border border-border/80 shadow-2xl rounded-xl p-2.5 rotate-[-8deg] group-hover:rotate-[-12deg] group-hover:-translate-x-4 transition-all duration-700 z-10 ease-out">
          <div className="w-full h-32 bg-muted rounded-lg mb-3 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent" />
            <ImageIcon className="absolute inset-0 m-auto w-8 h-8 text-foreground/20" />
          </div>
          <div className="h-2 w-1/2 bg-muted-foreground/20 rounded-full" />
        </div>
        {/* Image 2 */}
        <div className="absolute bottom-10 right-4 w-40 h-48 bg-background border border-border/80 shadow-2xl rounded-xl p-2.5 rotate-[6deg] group-hover:rotate-[10deg] group-hover:translate-x-4 transition-all duration-700 z-20 ease-out">
          <div className="w-full h-32 bg-muted rounded-lg mb-3 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-bl from-primary/40 to-transparent" />
            <ImageIcon className="absolute inset-0 m-auto w-8 h-8 text-foreground/20" />
          </div>
          <div className="h-2 w-2/3 bg-muted-foreground/20 rounded-full" />
        </div>
        
        {/* Upload Button Mockup */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
          <div className="h-12 w-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.6)]">
            <ArrowRight className="h-5 w-5 -rotate-90" />
          </div>
        </div>
      </div>
    </div>
  );
}
