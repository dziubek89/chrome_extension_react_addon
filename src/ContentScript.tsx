import { useState, useEffect } from "react";
import NotesSidebar from "./components/NotesSidebarDevelopment";

const ContentScript = () => {
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Odfiltruj niechciane eventy
      if (event.source !== window) return;
      if (!event.data || event.data.type !== "SET_TOKEN") return;

      console.log("[content script] Odebrano token:", event.data.token);

      // Wyślij token do background.js
      chrome.runtime.sendMessage(
        { type: "SET_TOKEN", token: event.data.token },
        (response) => {
          console.log("[content script] Odpowiedź z background:", response);
        }
      );
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        maxWidth: "500px",
        margin: "20px auto",
        borderRadius: "8px",
        background: "#f9f9f9",
        position: "fixed",
        top: "0",
        right: "0",
      }}
    >
      {/* Przycisk minimalizuj/rozwiń */}
      <button
        onClick={() => setMinimized((prev) => !prev)}
        style={{
          marginBottom: "10px",
          padding: "6px 12px",
          cursor: "pointer",
        }}
      >
        {minimized ? "Rozwiń" : "Minimalizuj"}
      </button>

      {/* Zawartość, którą można zwinąć */}
      {!minimized && (
        <div>
          <NotesSidebar />
        </div>
      )}
    </div>
  );
};

export default ContentScript;
