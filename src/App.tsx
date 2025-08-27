import { useState } from "react";
import NotesSidebar from "./components/NotesSidebarDevelopment";

function App() {
  const [minimized, setMinimized] = useState(false);
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
}

export default App;
