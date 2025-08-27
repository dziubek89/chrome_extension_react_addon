import { useState } from "react";
import { sendMessageAsync } from "../utils/handleMessage";
import NoteEditor from "./NoteEditorDevelopment";

export default function NotesSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const handleSaveNote = async () => {
    console.log("handle send note");
    const currentUrl = window.location.href.split("?")[0];

    console.log(note);

    const response = await sendMessageAsync({
      type: "ADD_NOTE",
      url: currentUrl,
      note: note,
      category: category,
      title: title,
    });

    console.log("Zapisano notatkę:", { title, category, note });
    setTitle("");
    setCategory("");
    setNote("");
    setIsOpen(false);
    console.log("response", response);
  };

  return (
    <>
      {/* Przycisk otwierający panel */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            // position: "fixed",
            // top: "50%",
            right: 0,
            // transform: "translateY(-50%)",
            background: "#4CAF50",
            color: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            zIndex: 999999,
          }}
        >
          ✏️ Add note
        </button>
      )}

      {/* Panel boczny */}
      {isOpen && (
        <div
          style={{
            // position: "fixed",
            top: 0,
            right: 0,
            // height: "100vh",
            width: "500px",
            background: "#fff",
            boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            zIndex: 999999,
            overflow: "auto",
          }}
        >
          {/* Nagłówek panelu */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <h3 style={{ margin: 0 }}>New Note</h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>

          {/* Pole: Title */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              marginBottom: 8,
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />

          {/* Pole: Category */}
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              marginBottom: 8,
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />

          <NoteEditor setNoteHandler={setNote} />

          {/* Przycisk zapisu */}
          <button
            onClick={handleSaveNote}
            style={{
              marginTop: 10,
              background: "#4CAF50",
              color: "white",
              padding: "8px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      )}
    </>
  );
}
