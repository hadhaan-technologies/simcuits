import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { filterXSS } from "xss";

const extensions = [
  StarterKit,

  Underline,

  Image.configure({
    allowBase64: true,
  }),

  Link.configure({
    openOnClick: true,
    HTMLAttributes: {
      target: "_blank",
      rel: "noopener noreferrer",
    },
  }),

  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];

const emptyDoc = {
  type: "doc",
  content: [],
};

export function renderArticleHtml(content) {
  let html = "";

  try {
    // MongoDB currently stores TipTap content as a JSON string
    const parsedContent =
      typeof content === "string" ? JSON.parse(content) : content || emptyDoc;

    html = generateHTML(parsedContent, extensions);
  } catch (error) {
    console.error("ARTICLE RENDER ERROR:", error);
    return "";
  }

  return filterXSS(html, {
    whiteList: {
      p: ["class", "style"],
      br: [],
      strong: [],
      b: [],
      em: [],
      i: [],
      u: [],
      s: [],
      a: ["href", "target", "rel"],
      ul: ["class"],
      ol: ["class"],
      li: ["class"],
      h1: ["class", "style"],
      h2: ["class", "style"],
      h3: ["class", "style"],
      h4: ["class", "style"],
      blockquote: ["class"],
      pre: ["class"],
      code: ["class"],
      img: ["src", "alt", "title", "class", "loading"],
      hr: ["class"],
    },

    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script", "style"],
  });
}

export default function ArticleContent({ content }) {
  const html = useMemo(() => renderArticleHtml(content), [content]);

  return (
    <div
      className="prose-article"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
