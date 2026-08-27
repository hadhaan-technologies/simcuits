import { useRef, useState } from "react";

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
  Underline as UnderlineIcon,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { createArticle } from "../api/articles";

/* -------------------------------------------------------
   TipTap extensions
------------------------------------------------------- */

const extensions = [
  StarterKit,
  Underline,
  Image,
  Link.configure({
    openOnClick: false,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Placeholder.configure({
    placeholder: "Start writing your article...",
  }),
];

/* -------------------------------------------------------
   Toolbar Button
------------------------------------------------------- */

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
  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;

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
      })
      .run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL", "https://");

    if (!url) return;

    editor
      .chain()
      .focus()
      .setImage({
        src: url,
      })
      .run();
  };

  return (
    <div className="mb-3 flex flex-wrap items-center gap-1 rounded-lg border border-border bg-muted/30 p-2">
      {/* Paragraph */}

      <ToolbarButton
        label="Paragraph"
        active={editor.isActive("paragraph")}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow className="h-4 w-4" />
      </ToolbarButton>

      {/* Headings */}

      <ToolbarButton
        label="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      {/* Text formatting */}

      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Insert link"
        active={editor.isActive("link")}
        onClick={addLink}
      >
        <Link2 className="h-4 w-4" />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      {/* Alignment */}

      <ToolbarButton
        label="Align left"
        active={editor.isActive({
          textAlign: "left",
        })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Align center"
        active={editor.isActive({
          textAlign: "center",
        })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Align right"
        active={editor.isActive({
          textAlign: "right",
        })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      {/* Lists */}

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code2 className="h-4 w-4" />
      </ToolbarButton>

      {/* Image */}

      <ToolbarButton label="Insert image URL" onClick={addImage}>
        <ImageIcon className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

export default function CreateArticle() {
  const navigate = useNavigate();

  /* File input reference */
  const fileInputRef = useRef(null);

  /* Article form */

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    excerpt: "",
    tags: "",
    coverImage: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------------------------------------------------------
     TipTap editor
  ------------------------------------------------------- */

  const editor = useEditor({
    extensions,

    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    },

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "prose-article min-h-[450px] w-full rounded-lg border border-border bg-background px-5 py-4 outline-none focus:border-primary/40",
      },
    },
  });

  /* -------------------------------------------------------
     Normal input changes
  ------------------------------------------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* -------------------------------------------------------
     Cover image
  ------------------------------------------------------- */
  const [coverFile, setCoverFile] = useState(null);
  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFile(file);

    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      coverImage: previewUrl,
    }));
  };

  /* -------------------------------------------------------
     RESET FORM
  ------------------------------------------------------- */

  const resetForm = () => {
    setForm({
      title: "",
      subtitle: "",
      excerpt: "",
      tags: "",
      coverImage: "",
    });

    setCoverFile(null);

    editor?.commands.setContent({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [],
        },
      ],
    });
  };

  /* -------------------------------------------------------
     Submit
  ------------------------------------------------------- */

  const handleSubmit = async (publishNow) => {
    if (!editor) return;

    setLoading(true);
    setError("");

    try {
      const contentJSON = editor.getJSON();
      const content = JSON.stringify(contentJSON);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("subtitle", form.subtitle);
      formData.append("excerpt", form.excerpt);
      formData.append("tags", form.tags);
      formData.append("content", content);
      formData.append("status", publishNow ? "published" : "draft");

      if (coverFile) {
        formData.append("coverImage", coverFile);
      }

      console.log("ARTICLE PAYLOAD:", Object.fromEntries(formData));

      const response = await createArticle(formData);

      console.log("ARTICLE CREATED:", response);

      /*
       * IMPORTANT:
       *
       * Only reset the form AFTER the backend
       * successfully creates the article.
       */

      resetForm();

      /*
       * Show appropriate message
       */

      if (publishNow) {
        console.log("ARTICLE PUBLISHED SUCCESSFULLY");

        /*
         * Go to Learn so you can immediately
         * see the published article.
         */

        navigate("/learn");
      } else {
        console.log("DRAFT SAVED SUCCESSFULLY");

        navigate("/dashboard");
      }
    } catch (err) {
      console.error("CREATE ARTICLE ERROR:", err);

      console.error("STATUS:", err.response?.status);

      console.error("RESPONSE:", err.response?.data);

      console.error("REQUEST:", err.config);

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Article</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Write, format and publish your article.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* -------------------------------------------------
           Main editor
        ------------------------------------------------- */}

        <div className="rounded-xl border border-border bg-card p-6">
          {/* Title */}

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full bg-transparent text-4xl font-bold outline-none placeholder:text-muted-foreground/50"
          />

          {/* Subtitle */}

          <input
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="Subtitle or short description"
            className="mt-3 w-full bg-transparent text-lg text-muted-foreground outline-none placeholder:text-muted-foreground/50"
          />

          {/* Editor */}

          <div className="mt-7">
            <EditorToolbar editor={editor} />

            <EditorContent editor={editor} />
          </div>

          {/* Character count */}

          {editor && (
            <div className="mt-2 text-right text-xs text-muted-foreground">
              {editor.storage.characterCount?.characters?.() ||
                editor.getText().length}{" "}
              characters
            </div>
          )}
        </div>

        {/* -------------------------------------------------
           Settings
        ------------------------------------------------- */}

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-5 text-lg font-semibold">Article Settings</h2>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Cover image */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Cover Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="block w-full rounded-lg border border-border p-2 text-sm"
              />

              {form.coverImage && (
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  className="mt-3 h-48 w-full rounded-lg object-cover"
                />
              )}
            </div>

            {/* Excerpt */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Excerpt</label>

              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={3}
                maxLength={300}
                placeholder="A short description shown on article cards..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
              />
            </div>

            {/* Tags */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Tags</label>

              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="verilog, fpga, embedded"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* -------------------------------------------------
           Actions
        ------------------------------------------------- */}

        <div className="flex justify-end gap-3">
          {/* Save Draft */}

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit(false)}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Draft"}
          </button>

          {/* Publish */}

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit(true)}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
