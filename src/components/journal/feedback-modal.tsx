"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // Ensure you have this shadcn component
import { Image as ImageIcon, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "issue" | "feedback";
}

export function FeedbackModal({ open, onOpenChange, type }: ReportModalProps) {
  const [title, setTitle] = useState(""); 
  const [text, setText] = useState("");
  const [image, setImage] = useState<{ url: string; key: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
      });
      const { presignedUrl, publicUrl } = await res.json();
      await fetch(presignedUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      setImage({ url: publicUrl, key: file.name });
      toast.success("Evidence attached.");
    } catch (err) {
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return toast.error("Title required.");
    if (!text.trim()) return toast.error("Description required.");
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text, imageUrl: image?.url, type }),
      });
      if (res.ok) {
        toast.success(type === "issue" ? "Dispatch successful." : "Feedback received.");
        onOpenChange(false);
        setTitle("");
        setText("");
        setImage(null);
      }
    } catch (err) {
      toast.error("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm w-[90vw] no-scrollbar rounded-[40px] border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl antialiased p-8 focus:outline-none overflow-y-auto max-h-[90vh]">
        <DialogHeader className="text-left space-y-3">
          <DialogTitle className="text-5xl font-black tracking-tighter leading-[0.85] capitalize">
            {type === "issue" ? "Report" : "Send"} <br />
            <span className="text-primary/60 italic font-serif font-light text-6xl lowercase">
              {type === "issue" ? "anomaly." : "thought."}
            </span>
          </DialogTitle>
          <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
            {type === "issue" ? "System Diagnostic // Report Bug" : "Direct Channel // Feedback Loop"}
          </p>
        </DialogHeader>

        <div className="space-y-6 pt-6">
          {/* 🚀 New Title Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">
              Summary.Heading
            </label>
            <Input
              placeholder={type === "issue" ? "Short glitch summary" : "Headline for your thought"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 bg-transparent border-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 transition-all placeholder:text-muted-foreground/30 text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">
              Message.Input
            </label>
            <Textarea
              placeholder={
                type === "issue"
                  ? "Describe the glitch in the sanctuary..."
                  : "What should we add to the archives?"
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-30 bg-transparent border-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 resize-none transition-all placeholder:text-muted-foreground/30 text-lg"
            />
          </div>

          {image ? (
            <div className="relative rounded-2xl overflow-hidden border border-border/40 aspect-video group animate-in fade-in zoom-in duration-300">
              <Image
                src={image.url}
                alt="Upload"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 90vw, 384px"
                unoptimized
              />
              <button
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full hover:bg-background transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 w-full py-6 border border-dashed border-border/60 rounded-[28px] cursor-pointer hover:bg-muted/30 transition-all group">
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5 opacity-40 group-hover:opacity-100" />}
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {isUploading ? "Uploading..." : "Attach_Evidence"}
              </span>
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </label>
          )}

          <div className="pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isUploading}
              className="w-full h-14 rounded-full font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Dispatching...</span>
                </div>
              ) : type === "issue" ? "Report Anomaly" : "Send Thought"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}