"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { uploadFile } from "./upload";
import { cn } from "@/lib/utils";

/** TipTap editor posting its HTML as `name` (blog post bodies). */
export function RichTextEditor({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  const [html, setHtml] = useState(defaultValue ?? "");
  const [source, setSource] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write something…" }),
    ],
    content: defaultValue ?? "",
    editorProps: {
      attributes: { class: "prose prose-neutral max-w-none min-h-[320px] px-4 py-3 focus:outline-none" },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  return (
    <div className="rounded-md border border-neutral-300 bg-white">
      <input type="hidden" name={name} value={html} />
      <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-neutral-50 p-1.5">
        {editor && !source && <Toolbar editor={editor} />}
        <button
          type="button"
          className="ml-auto rounded px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-200"
          onClick={() => {
            if (source) editor?.commands.setContent(html);
            setSource(!source);
          }}
        >
          {source ? "Visual editor" : "HTML source"}
        </button>
      </div>
      {source ? (
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          className="min-h-[320px] w-full resize-y p-3 font-mono text-xs focus:outline-none"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const b = (label: string, active: boolean, run: () => void, title = label) => (
    <button
      key={title}
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={run}
      className={cn(
        "min-w-8 rounded px-2 py-1 text-sm hover:bg-neutral-200",
        active ? "bg-neutral-200 font-semibold text-neutral-900" : "text-neutral-700",
      )}
    >
      {label}
    </button>
  );
  const chain = () => editor.chain().focus();

  return (
    <>
      {b("B", editor.isActive("bold"), () => chain().toggleBold().run(), "Bold")}
      {b("I", editor.isActive("italic"), () => chain().toggleItalic().run(), "Italic")}
      {b("H2", editor.isActive("heading", { level: 2 }), () => chain().toggleHeading({ level: 2 }).run())}
      {b("H3", editor.isActive("heading", { level: 3 }), () => chain().toggleHeading({ level: 3 }).run())}
      {b("• List", editor.isActive("bulletList"), () => chain().toggleBulletList().run(), "Bullet list")}
      {b("1. List", editor.isActive("orderedList"), () => chain().toggleOrderedList().run(), "Numbered list")}
      {b("❝", editor.isActive("blockquote"), () => chain().toggleBlockquote().run(), "Quote")}
      {b("Link", editor.isActive("link"), () => {
        const prev = editor.getAttributes("link").href as string | undefined;
        const url = prompt("Link URL (leave empty to remove)", prev ?? "https://");
        if (url === null) return;
        if (!url) chain().unsetLink().run();
        else chain().extendMarkRange("link").setLink({ href: url }).run();
      })}
      {b("Image", false, () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;
          try {
            chain().setImage({ src: await uploadFile(file) }).run();
          } catch (e) {
            alert((e as Error).message);
          }
        };
        input.click();
      })}
      {b("↶", false, () => chain().undo().run(), "Undo")}
      {b("↷", false, () => chain().redo().run(), "Redo")}
    </>
  );
}
