import React, { useState } from "react";
import "../styles/displayNotes.css";
import NoteBox from "./NoteBox";

interface NotesPanelProps {
  notes: string[];
  onEdit: () => void;
}

//@ts-ignore
const DisplayNotes: React.FC<NotesPanelProps> = ({ notes, onEdit }) => {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <div className="notes-minimized" onClick={() => setMinimized(false)}>
        📝 Notatki
      </div>
    );
  }

  {
    /* <NoteBox
  id="globalNote"
  label="🌐 Notatka globalna"
  icon="🌍"
  valueKey="notatka_globalna"
  posKey="notatka_pos_globalna"
  sizeKey="notatka_size_globalna"
  collapsedKey="notatka_min_globalna"
  defaultX={window.innerWidth - 300}
  defaultY={window.innerHeight - 200}
/> */
  }

  return (
    <div className="notes-panel">
      <NoteBox
        id="pageNote"
        label="📄 Notatka dla tej strony"
        icon="📝"
        valueKey={"notatka_" + window.location.href}
        posKey={"notatka_pos_" + window.location.origin}
        sizeKey={"notatka_size_" + window.location.origin}
        collapsedKey={"notatka_min_" + window.location.origin}
        defaultX={20}
        defaultY={window.innerHeight - 200}
      />

      {/* <div className="notes-header">
        <h3>📄 Notatki</h3>
        <div className="notes-actions">
          <button className="edit-btn" onClick={onEdit}>
            ✏️ Edytuj
          </button>
          <button className="minimize-btn" onClick={() => setMinimized(true)}>
            –
          </button>
        </div>
      </div>

      {notes.length > 0 ? (
        <ul className="notes-list">
          {notes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      ) : (
        <p className="no-notes">Brak notatek dla tej strony</p>
      )} */}
    </div>
  );
};

export default DisplayNotes;
