import Link from "next/link";
import { PenLine } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 pt-24 pb-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">

          {/* Brand Section */}
          <div className="md:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <PenLine className="h-5 w-5 text-primary" />
              <span className="font-semibold tracking-tighter text-xl text-foreground">
                journal</span>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm font-medium">
              An open-source sanctuary for your digital thoughts. 
              Designed for clarity, privacy, and the modern developer.
            </p>
          </div>

          {/* Links Section - Using Monospaced Labels */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/50">Project</span>
            <ul className="space-y-3">
              <FooterLink href="https://github.com/niladri-gudu/deardiary">Source Code</FooterLink>
              <FooterLink href="#">Changelog</FooterLink>
              <FooterLink href="#">Documentation</FooterLink>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/50">Connect</span>
            <ul className="space-y-3">
              <FooterLink href="https://twitter.com/dev_niladri">Twitter / X</FooterLink>
              <FooterLink href="mailto:hello@deardiary.ai">Support</FooterLink>
              <FooterLink href="https://github.com/niladri-gudu">Developer</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Minimalist */}
        <div className="border-t border-border/40 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-[11px] font-mono tracking-tight">
            © {new Date().getFullYear()} JOURNAL. BUILT BY <span className="text-foreground font-bold underline underline-offset-4 decoration-primary/20">NILADRI</span>
          </p>
          
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-border/40 bg-muted/30">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}