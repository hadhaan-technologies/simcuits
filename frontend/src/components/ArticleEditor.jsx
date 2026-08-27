import { useCallback, useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Save,
  Settings,
  Underline as UnderlineIcon,
} from "lucide-react";

import ArticleContent from "./ArticleContent";

function ToolbarButton({ children, onClick, label, active = false }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`grid h-8 w-8 place-items-center rounded-md border transition ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function EditorToolbar({ editor }) {
  const [imageInput] = useState(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    return input;
  });

  if (!editor) return null;

  const addImageFromDevice = () => {
    imageInput.value = "";

    imageInput.onchange = () => {
      const file = imageInput.files?.[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const src = reader.result;

        editor
          .chain()
          .focus()
          .setImage({
            src,
            alt: file.name,
            title: file.name,
          })
          .run();
      };

      reader.readAsDataURL(file);
    };

    imageInput.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href || "";

    const url = window.prompt("Enter URL", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url,
        target: "_blank",
      })
      .run();
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-1 rounded-xl border border-border bg-muted/30 p-2">
      <ToolbarButton
        label="Paragraph"
        active={editor.isActive("paragraph")}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow size={15} />
      </ToolbarButton>

      <ToolbarButton
        label="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={15} />
      </ToolbarButton>

      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={15} />
      </ToolbarButton>

      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={15} />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={15} />
      </ToolbarButton>

      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={15} />
      </ToolbarButton>

      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={15} />
      </ToolbarButton>

      <ToolbarButton
        label="Insert link"
        active={editor.isActive("link")}
        onClick={setLink}
      >
        <Link2 size={15} />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        label="Align left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft size={15} />
      </ToolbarButton>

      <ToolbarButton
        label="Align center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={15} />
      </ToolbarButton>

      <ToolbarButton
        label="Align right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={15} />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={15} />
      </ToolbarButton>

      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={15} />
      </ToolbarButton>

      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={15} />
      </ToolbarButton>

      <ToolbarButton
        label="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code2 size={15} />
      </ToolbarButton>

      <ToolbarButton
        label="Insert image from device"
        onClick={addImageFromDevice}
      >
        <ImageIcon size={15} />
      </ToolbarButton>

      <ToolbarButton
        label="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={15} />
      </ToolbarButton>
    </div>
  );
}

function calculateReadingTime(doc) {
  let text = "";

  const walk = (node) => {
    if (node.text) {
      text += `${node.text} `;
    }

    if (node.content) {
      node.content.forEach(walk);
    }
  };

  walk(doc);

  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

export default function ArticleEditor({
  form,
  setForm,
  onSave,
  onPublish,
  loading,
  error,
}) {
  const [activeTab, setActiveTab] = useState("write");

  const extensions = useMemo(
    () => [
      StarterKit,
      Underline,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Start writing your article...",
      }),
    ],
    [],
  );

  const editor = useEditor({
    extensions,
    content: form.content,

    editorProps: {
      attributes: {
        class:
          "min-h-[500px] rounded-xl border border-border bg-background px-6 py-5 outline-none focus:border-primary/40 prose-article",
      },
    },

    onUpdate: ({ editor: currentEditor }) => {
      setForm((previous) => ({
        ...previous,
        content: currentEditor.getJSON(),
      }));
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (JSON.stringify(editor.getJSON()) !== JSON.stringify(form.content)) {
      editor.commands.setContent(form.content);
    }
  }, [editor]);

  const patch = useCallback(
    (updates) => {
      setForm((previous) => ({
        ...previous,
        ...updates,
      }));
    },
    [setForm],
  );

  const handleCoverImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      patch({
        coverImageUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleTags = (value) => {
    patch({
      tags: value
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    });
  };

  const readingMinutes = calculateReadingTime(form.content);

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Article</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Write, format and publish your article.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border px-3 py-1 text-xs">
            {form.status === "published" ? "Published" : "Draft"}
          </span>

          <span className="text-xs text-muted-foreground">
            {readingMinutes} min read
          </span>

          <button
            type="button"
            onClick={onSave}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
          >
            <Save size={15} />

            {loading ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="button"
            onClick={onPublish}
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("write")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm ${
            activeTab === "write"
              ? "bg-background shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          <Pilcrow size={15} />
          Write
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm ${
            activeTab === "settings"
              ? "bg-background shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          <Settings size={15} />
          Settings
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm ${
            activeTab === "preview"
              ? "bg-background shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          <Eye size={15} />
          Preview
        </button>
      </div>

      {/* WRITE */}
      {activeTab === "write" && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7">
          <input
            value={form.title}
            onChange={(e) =>
              patch({
                title: e.target.value,
              })
            }
            placeholder="Article title"
            className="w-full bg-transparent text-4xl font-bold outline-none placeholder:text-muted-foreground/50"
          />

          <input
            value={form.subtitle}
            onChange={(e) =>
              patch({
                subtitle: e.target.value,
              })
            }
            placeholder="Subtitle or short description"
            className="mt-3 w-full bg-transparent text-xl text-muted-foreground outline-none placeholder:text-muted-foreground/50"
          />

          <div className="mt-8">
            <EditorToolbar editor={editor} />

            <EditorContent editor={editor} />

            {editor && (
              <div className="mt-2 text-right text-xs text-muted-foreground">
                {editor.storage.characterCount?.characters?.() || ""}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {activeTab === "settings" && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Cover image */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Cover Image
              </label>

              <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border p-8 transition hover:border-primary/50 hover:bg-muted/30">
                <div className="text-center">
                  <ImageIcon className="mx-auto mb-3" size={28} />

                  <p className="text-sm font-medium">
                    Choose image from your device
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG, JPG, JPEG, WEBP
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImage}
                  className="hidden"
                />
              </label>

              {form.coverImageUrl && (
                <img
                  src={form.coverImageUrl}
                  alt="Cover preview"
                  className="mt-4 h-56 w-full rounded-xl object-cover"
                />
              )}
            </div>

            {/* Excerpt */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Excerpt</label>

              <textarea
                value={form.excerpt}
                onChange={(e) =>
                  patch({
                    excerpt: e.target.value,
                  })
                }
                rows={4}
                maxLength={300}
                placeholder="A short description shown in article listings..."
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Tags</label>

              <input
                value={form.tags.join(", ")}
                onChange={(e) => handleTags(e.target.value)}
                placeholder="verilog, fpga, embedded, beginners"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {activeTab === "preview" && (
        <article className="rounded-2xl border border-border bg-card p-6 md:p-10">
          {form.coverImageUrl && (
            <img
              src={form.coverImageUrl}
              alt={form.title}
              className="mb-8 h-64 w-full rounded-xl object-cover"
            />
          )}

          <h1 className="text-4xl font-bold">
            {form.title || "Untitled Article"}
          </h1>

          {form.subtitle && (
            <p className="mt-3 text-xl text-muted-foreground">
              {form.subtitle}
            </p>
          )}

          <div className="mt-8">
            <ArticleContent content={form.content} />
          </div>
        </article>
      )}
    </div>
  );
}
