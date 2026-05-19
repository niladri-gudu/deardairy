/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, X, Loader2, ImageIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { getFullMediaLibrary, deleteMediaFile } from "@/actions/storage";
import { toast } from "sonner";


type MediaFile = {
  key: string;
  url: string;
  size: number;
  lastModified: string | null;
};

interface MediaLibraryDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteComplete?: () => void; // to refresh stats in parent
}

export function MediaLibraryDialog({
  userId,
  open,
  onOpenChange,
  onDeleteComplete,
}: MediaLibraryDialogProps) {
  const [files, setFiles] = React.useState<MediaFile[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    queueMicrotask(() => setLoading(true));
    getFullMediaLibrary(userId)
      .then(setFiles)
      .finally(() => setLoading(false));
  }, [open, userId]);

  const handleDelete = async (file: MediaFile) => {
    setDeleting(file.key);
    const toastId = toast.loading("Purging from archives...");
    try {
      await deleteMediaFile(userId, file.key);
      setFiles((prev) => prev.filter((f) => f.key !== file.key));
      if (lightboxIndex !== null) setLightboxIndex(null);
      onDeleteComplete?.();
      toast.success("Image removed from sanctuary.", { id: toastId });
    } catch (e: any) {
      toast.error(e.message || "Deletion failed.", { id: toastId });
    } finally {
      setDeleting(null);
    }
  };

  const lightboxFile = lightboxIndex !== null ? files[lightboxIndex] : null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl h-[85vh] p-0 border-border/40 bg-background/95 backdrop-blur-xl rounded-3xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border/10">
            <div>
              <DialogTitle className="text-base font-black tracking-tight">
                Media Library
              </DialogTitle>
              <DialogDescription className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
                {files.length} objects stored
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              <X size={16} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : files.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 opacity-30">
                <ImageIcon size={40} />
                <p className="text-xs font-bold uppercase tracking-widest">No media found</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                {files.map((file, i) => (
                  <button
                    key={file.key}
                    onClick={() => setLightboxIndex(i)}
                    className="relative aspect-square rounded-xl overflow-hidden border border-border/20 bg-secondary/30 group"
                  >
                    <Image
                      src={file.url}
                      fill
                      alt="Media"
                      className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75"
                      sizes="(max-width: 640px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[9px] font-black uppercase tracking-widest bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                        View
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={() => setLightboxIndex(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl p-0 border-border/40 bg-background/95 backdrop-blur-xl rounded-3xl overflow-hidden">
          <div className="sr-only">
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>View and manage this media file.</DialogDescription>
          </div>

          {lightboxFile && (
            <>
              <div className="relative w-full aspect-video bg-black">
                <Image
                  src={lightboxFile.url}
                  fill
                  alt="Preview"
                  className="object-contain"
                  sizes="90vw"
                />
                {/* Prev / Next */}
                {lightboxIndex! > 0 && (
                  <button
                    onClick={() => setLightboxIndex((i) => i! - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all"
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}
                {lightboxIndex! < files.length - 1 && (
                  <button
                    onClick={() => setLightboxIndex((i) => i! + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all"
                  >
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>

              <div className="p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground truncate max-w-xs">
                    {lightboxFile.key.split("/").pop()}
                  </p>
                  <p className="text-[9px] text-muted-foreground/60 uppercase font-bold tracking-widest mt-0.5">
                    {(lightboxFile.size / 1024).toFixed(1)} KB
                    {lightboxFile.lastModified && ` · ${new Date(lightboxFile.lastModified).toLocaleDateString()}`}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleting === lightboxFile.key}
                  onClick={() => handleDelete(lightboxFile)}
                  className="gap-2 rounded-xl text-xs font-black uppercase tracking-widest shrink-0"
                >
                  {deleting === lightboxFile.key ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}