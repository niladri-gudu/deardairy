"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { createSimpleEditorConfig } from "@/lib/editor/config";

export default function Editor({ content = "" }) {
  const editor = useEditor(createSimpleEditorConfig({ content }));

  if (!editor) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-16">
      <input
        placeholder="Untitled"
        className="block w-full max-w-2xl mx-auto text-3xl font-semibold bg-transparent outline-none mb-6 placeholder-gray-500"
      />

      <EditorContent editor={editor} />
    </div>
  );
}