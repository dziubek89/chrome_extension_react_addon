import React, { useState, useEffect } from "react";
import "../styles/addNoteStyles.css";
import { sendMessageAsync } from "../utils/handleMessage";

// type Props = {
//   onSend: (note: string) => Promise<void>;
// };

const AddNote: React.FC = () => {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [minimized, setMinimized] = useState(false);
  const [note, setNote] = useState("");

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
  };

  const handleSend = async () => {
    console.log("handle send note");
    const currentUrl = window.location.href.split("?")[0];

    const response = await sendMessageAsync({
      type: "ADD_NOTE",
      url: currentUrl,
      note: note,
    });

    console.log(response);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setPos({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  if (minimized) {
    return (
      <button className="note-minimized" onClick={() => setMinimized(false)}>
        📝
      </button>
    );
  }

  return (
    <div
      className="note-container"
      style={{ top: `${pos.y}px`, left: `${pos.x}px` }}
    >
      <div className="note-header" onMouseDown={handleMouseDown}>
        📝 Notatka
        <button
          className="note-minimize-btn"
          onClick={() => setMinimized(true)}
        >
          –
        </button>
      </div>

      <textarea
        className="note-textarea"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        className="note-send-btn"
        // onClick={async () => {
        //   await onSend(note);
        //   setNote("");
        // }}
        onClick={handleSend}
      >
        Wyślij
      </button>
    </div>
  );
};

export default AddNote;
