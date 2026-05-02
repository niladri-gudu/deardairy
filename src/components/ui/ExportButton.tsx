"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ExportDataButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/user/export");
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `withink-export-${new Date().toLocaleDateString("en-CA")}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("Your sanctuary has been bundled.");
    } catch (error) {
      toast.error("Failed to export data.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleExport}
      disabled={isExporting}
      className="w-full justify-start gap-3 rounded-2xl py-6 border border-border/40 hover:bg-foreground hover:text-background transition-all group"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
      )}
      <div className="flex flex-col items-start leading-none">
        <span className="text-sm font-bold tracking-tight">Export Sanctuary</span>
        <span className="text-[10px] font-mono uppercase tracking-widest opacity-40 mt-1">
          Download all logs & media
        </span>
      </div>
    </Button>
  );
}