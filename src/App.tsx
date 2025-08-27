import { useState, useEffect } from "react";
import NotesSidebar from "./components/NotesSidebarDevelopment";

function App() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window) return;
      if (!event.data || event.data.type !== "SET_TOKEN") return;

      console.log("[content script] Odebrano token:", event.data.token);

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
        position: "fixed",
        top: "50%",
        right: "0",
        transform: "translateY(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      {/* Mały przycisk widget */}
      {open ? null : (
        <button
          onClick={() => setOpen((prev) => !prev)}
          style={{
            padding: "10px 14px",
            borderRadius: "8px 0 0 8px",
            border: "1px solid #ccc",
            background: "#f9f9f9",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          💬
        </button>
      )}

      {/* Panel rozwijany */}
      {open && (
        <div
          style={{
            width: "520px",
            maxHeight: "80vh",
            border: "1px solid #ccc",
            borderRadius: "8px 0 0 8px",
            background: "#fff",
            marginTop: "5px",
            padding: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            overflowY: "auto",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Zawartość panelu */}
          <NotesSidebar />

          <button
            onClick={() => setOpen(false)}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "none",
              background: "#f0f0f0",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

// import { useState } from "react";
// import NotesSidebar from "./components/NotesSidebarDevelopment";

// function App() {
//   const [minimized, setMinimized] = useState(false);
//   return (
//     <div
//       style={{
//         border: "1px solid #ccc",
//         padding: "10px",
//         maxWidth: "500px",
//         margin: "20px auto",
//         borderRadius: "8px",
//         background: "#f9f9f9",
//         position: "fixed",
//         top: "0",
//         right: "0",
//       }}
//     >
//       {/* Przycisk minimalizuj/rozwiń */}
//       <button
//         onClick={() => setMinimized((prev) => !prev)}
//         style={{
//           marginBottom: "10px",
//           padding: "6px 12px",
//           cursor: "pointer",
//         }}
//       >
//         {minimized ? "Rozwiń" : "Minimalizuj"}
//       </button>

//       {/* Zawartość, którą można zwinąć */}
//       {!minimized && (
//         <div>
//           <NotesSidebar />
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
