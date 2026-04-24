/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import UnderlineExt from "@tiptap/extension-underline";
import ImageExt from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { toast } from "sonner"; // Assuming you want to show errors

export default function Editor({
  content = "",
  onChange,
  onEditorReady,
}: {
  content?: string;
  onChange?: (data: { html: string; text: string; json: any }) => void;
  onEditorReady?: (editor: any) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      UnderlineExt,
      ImageExt.configure({ inline: false, allowBase64: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Placeholder.configure({
        placeholder: "Start writing your thoughts...",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "tiptap max-w-none focus:outline-none text-lg leading-snug text-foreground",
      },
      // --- PASTE HANDLER START ---
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find((item) => item.type.startsWith("image"));

        if (imageItem) {
          const file = imageItem.getAsFile();
          if (file) {
            uploadAndInsertImage(view.state, view.dispatch, file);
            return true; // "true" prevents the default paste behavior
          }
        }
        return false; // Carry on with normal paste for text/links
      },
      // --- PASTE HANDLER END ---
    },
    onCreate({ editor }) {
      onEditorReady?.(editor);
    },
    onUpdate({ editor }) {
      const json = editor.getJSON();
      const html = editor.getHTML();
      const text = editor.getText();

      // Explicitly check if it's "empty" but still trigger the change
      onChange?.({
        html: html === "<p></p>" ? "" : html, // Normalize empty state
        text: text.trim(),
        json: json,
      });
    },
    immediatelyRender: false,
  });

  // Reusable upload logic (similar to your Toolbar logic)
  async function uploadAndInsertImage(state: any, dispatch: any, file: File) {
    if (!editor) return;

    const tempId = `upload-${Date.now()}`;

    // 1. Insert placeholder image
    editor
      .chain()
      .focus()
      .setImage({ src: "/uploading.png", alt: tempId })
      .run();

    try {
      // 2. Get Presigned URL
      const res = await fetch("/api/media/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });

      const { presignedUrl, publicUrl } = await res.json();

      // 3. Upload to storage
      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      // 4. Replace placeholder with actual URL
      const { doc } = editor.state;
      doc.descendants((node, pos) => {
        if (node.type.name === "image" && node.attrs.alt === tempId) {
          editor
            .chain()
            .focus()
            .setNodeSelection(pos) // Select the placeholder
            .deleteSelection() // Remove it
            .setImage({ src: publicUrl }) // Insert the new one
            .run();
        }
      });
    } catch (err) {
      toast.error("Image upload failed");
      // Remove placeholder on failure
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "image" && node.attrs.alt === tempId) {
          editor.chain().focus().setNodeSelection(pos).deleteSelection().run();
        }
      });
    }
  }

  if (!editor) return null;

  return (
    <div className="bg-background">
      <div className="px-4 py-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
