"use client";
import "../styles/NoteEditor.css";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import CodeBlock from "@tiptap/extension-code-block";
import { Extension } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import { useState } from "react";

type Props = {
  setNoteHandler: (html: string) => void;
};

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run(),
    };
  },
});

export default function NoteEditor({ setNoteHandler }: Props) {
  const [isButtonActive, setButtonActive] = useState<{
    [key: string]: boolean;
  }>({
    bold: false,
    italic: false,
    bulletList: false,
    orderedList: false,
    codeBlock: false,
    link: false,
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        bulletList: {},
        orderedList: {},
      }),
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      FontSize,
      CodeBlock.extend({
        addOptions() {
          return {
            //@ts-ignore
            ...this.parent?.(),
            HTMLAttributes: {
              class: "code-block",
              style: `
                background: #000000;
                color: #ffffff;
                padding: 10px;
                margin: 10px;
                border-radius: 6px;
                border: 1px solid #333;
                font-family: monospace;
              `,
            },
          };
        },
      }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
      }),
    ],
    content: `<div style="min-height: 200px;"></div>`,
    editorProps: {
      attributes: {
        class: "chromeExtensionEditorContent",
      },
    },
    onUpdate({ editor }) {
      setNoteHandler(editor.getHTML());
    },
  });

  if (!editor) return null;

  const buttonStyle = (active: boolean) => ({
    padding: "6px 10px",
    borderRadius: "6px",
    border: active ? "1px solid #007bff" : "1px solid #ccc",
    backgroundColor: active ? "#e7f1ff" : "white",
    color: active ? "#007bff" : "#333",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: active ? "0 0 4px rgba(0, 123, 255, 0.5)" : "none",
    transition: "all 0.2s ease",
  });

  const onChangeHandler = (element: string) => {
    switch (element) {
      case "bold":
        editor.chain().focus().toggleBold().run();
        break;
      case "italic":
        editor.chain().focus().toggleItalic().run();
        break;
      case "bulletList":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "orderedList":
        editor.chain().focus().toggleOrderedList().run();
        break;
      case "codeBlock":
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case "link":
        const url = prompt("Enter URL:");
        if (url) {
          const urlHttp = /^https?:\/\//i.test(url) ? url : `https://${url}`;
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: urlHttp })
            .run();
        }
        break;
      default:
        console.log("Nieznana komenda:", element);
    }

    setButtonActive({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      codeBlock: editor.isActive("codeBlock"),
      link: editor.isActive("link"),
    });
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        background: "white",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="color"
          onInput={(e) =>
            editor.chain().focus().setColor(e.currentTarget.value).run()
          }
          style={{
            width: "40px",
            height: "35px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        />

        <select
          onChange={(e) => {
            const size = e.target.value;
            if (size === "default")
              editor.chain().focus().unsetFontSize().run();
            else editor.chain().focus().setFontSize(size).run();
          }}
          style={{
            padding: "6px 8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          <option value="default">Font Size</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
        </select>

        <button
          onClick={() => onChangeHandler("bold")}
          style={buttonStyle(isButtonActive["bold"])}
        >
          B
        </button>

        <button
          onClick={() => onChangeHandler("italic")}
          style={buttonStyle(isButtonActive["italic"])}
        >
          I
        </button>

        <button
          onClick={() => onChangeHandler("bulletList")}
          style={buttonStyle(isButtonActive["bulletList"])}
        >
          • List
        </button>

        <button
          onClick={() => onChangeHandler("orderedList")}
          style={buttonStyle(isButtonActive["orderedList"])}
        >
          1. List
        </button>

        <button
          onClick={() => onChangeHandler("codeBlock")}
          style={buttonStyle(isButtonActive["codeBlock"])}
        >
          {"</> Code"}
        </button>

        <button
          onClick={() => onChangeHandler("link")}
          style={buttonStyle(isButtonActive["link"])}
        >
          🔗 Link
        </button>
      </div>

      {/* Edytor */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <EditorContent
          className="chromeExtensionEditorContent"
          editor={editor}
          style={{ minHeight: "200px", padding: "8px", outline: "none" }}
        />
      </div>

      {/* Style globalne */}
      {/* <style jsx global>{`
        .chromeExtensionEditorContent ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .chromeExtensionEditorContent ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .chromeExtensionEditorContent li {
          margin: 0.3rem 0;
        }

        .chromeExtensionEditorContent a {
          color: #1d4ed8;
          text-decoration: underline;
        }
      `}</style> */}
    </div>
  );
}
