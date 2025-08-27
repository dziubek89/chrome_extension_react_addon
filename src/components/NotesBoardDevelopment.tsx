import ContentEditable from "react-contenteditable";
import { useEffect, useState } from "react";
import { sendMessageAsync } from "../utils/handleMessage";

type Note = {
  _id: string;
  title: string;
  content: string;
  expanded: boolean;
  category: string;
};

function Note({ note, onSave, onToggleExpand }: any) {
  const [localTitle, setLocalTitle] = useState(note.title);
  const [localContent, setLocalContent] = useState(note.content);

  // const isTruncated = localContent.length > 30 && !note.expanded;
  // const displayedDetails = isTruncated
  //   ? localContent.slice(0, 30) + "..."
  //   : localContent;

  const hasChanges = localTitle !== note.title || localContent !== note.content;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "8px",
        marginBottom: "8px",
        background: "#fff",
      }}
    >
      {/* Edytowalny tytuł */}
      <ContentEditable
        html={localTitle}
        onChange={(e) => setLocalTitle(e.target.value)}
        style={{ fontWeight: "bold", marginBottom: "4px" }}
      />

      {/* Edytowalny opis */}
      <ContentEditable
        html={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        style={{ marginTop: "8px", color: "#555" }}
      />

      {/* Pokaż więcej / Zwiń */}
      {note.content.length > 30 && (
        <button
          onClick={() => onToggleExpand(note._id)}
          style={{ marginTop: "4px" }}
        >
          {note.expanded ? "Zwiń" : "Pokaż więcej"}
        </button>
      )}

      {/* Zapisz zmiany */}
      {hasChanges && (
        <button
          onClick={() => onSave(note._id, localTitle, localContent)}
          style={{
            marginTop: "6px",
            padding: "4px 8px",
            fontSize: "12px",
            background: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Zapisz
        </button>
      )}
    </div>
  );
}

// Cała tablica notatek
export default function NotesBoard() {
  const [notes, setNotes] = useState<Note[]>([]);

  const isChromeExtension =
    typeof chrome !== "undefined" &&
    typeof chrome.runtime !== "undefined" &&
    typeof chrome.runtime.id !== "undefined";

  useEffect(() => {
    if (isChromeExtension) {
      const handleClick = async () => {
        const currentUrl = window.location.href.split("?")[0];

        try {
          const response = await sendMessageAsync({
            type: "GET_NOTES",
            url: currentUrl,
          });

          if (response?.notes?.notes?.length > 0) {
            setNotes(response.notes.notes);
          }
        } catch (err) {
          console.error("Błąd podczas pobierania notatek:", err);
        }
      };
      handleClick();
    } else {
      // development
      setNotes([
        {
          _id: "1",
          title: "Notka 1",
          content:
            "To jest bardzo długa notatka. Zawiera mnóstwo interesujących rzeczy...",
          expanded: false,
          category: "js",
        },
        {
          _id: "2",
          title: "Notka 2",
          content: "Krótsza treść, która nie wymaga rozwijania.",
          expanded: false,
          category: "js",
        },
      ]);
    }
  }, []);

  // Zapisz zmiany w notce
  const handleSave = (id: string, newTitle: string, newContent: string) => {
    setNotes((items) =>
      items.map((note) =>
        note._id === id
          ? { ...note, title: newTitle, content: newContent }
          : note
      )
    );

    // tu można podpiąć request do bazy:
    console.log("Zapisuję w DB:", { id, newTitle, newContent });
    sendMessageAsync({
      type: "UPDATE_NOTE",
      id,
      title: newTitle,
      content: newContent,
    });
  };

  // Rozwiń/zwiń
  const handleToggleExpand = (id: string) => {
    setNotes((items) =>
      items.map((note) =>
        note._id === id ? { ...note, expanded: !note.expanded } : note
      )
    );
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto" }}>
      <h2>Moje notki</h2>
      {notes.map((note) => (
        <Note
          key={note._id}
          note={note}
          onSave={handleSave}
          onToggleExpand={handleToggleExpand}
        />
      ))}
    </div>
  );
}
