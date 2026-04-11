"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import UnderlineExt from "@tiptap/extension-underline";
import ImageExt from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { Toolbar } from "./toolbar";

export default function Editor({
  content = "",
  onChange,
}: {
  content?: string;
  onChange?: (data: { html: string; text: string; json: any }) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExt,
      Highlight,
      Typography,
      ImageExt.configure({ inline: false, allowBase64: true }),
      Youtube.configure({ width: 640, height: 360 }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Start writing your thoughts...",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[60vh] text-lg leading-relaxed text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-code:text-foreground prose-hr:border-border prose-a:text-primary",
      },
    },
    onUpdate({ editor }) {
      onChange?.({
        html: editor.getHTML(),
        text: editor.getText(),
        json: editor.getJSON(),
      });
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) editor.commands.focus("end");
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-zinc-800/60 overflow-hidden bg-zinc-950/40">
      <Toolbar editor={editor} />
      <div className="px-8 py-8">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
