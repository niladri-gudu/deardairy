/* eslint-disable react/jsx-no-comment-textnodes */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VerifiedContent() {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-8 antialiased">
      <div className="w-full max-w-sm mx-auto space-y-10">
        <div className="space-y-3">
          <h1 className="text-5xl font-black tracking-tighter leading-[0.85]">
            Identity <br />
            <span className="text-primary/60 italic font-serif font-light text-6xl">
              verified.
            </span>
          </h1>
          <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
            Verification successful // Entry permitted
          </p>
        </div>
        <div className="pt-4 space-y-6">
          <Link href="/home" className="block w-full">
            <Button className="w-full h-14 rounded-full font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
              Go to Journal <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <div className="text-center">
            <Link
              href="/"
              className="inline-block text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40 hover:text-foreground transition-all"
            >
              // Return_Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}