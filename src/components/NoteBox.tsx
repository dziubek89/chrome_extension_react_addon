import React, { useEffect, useRef, useState } from "react";
import "../styles/noteBox.css";

interface NoteBoxProps {
  id: string;
  label: string;
  icon: string;
  valueKey: string;
  posKey: string;
  sizeKey: string;
  collapsedKey: string;
  defaultX: number;
  defaultY: number;
}

const NoteBox: React.FC<NoteBoxProps> = ({
  id,
  label,
  icon,
  valueKey,
  posKey,
  sizeKey,
  collapsedKey,
  defaultX,
  defaultY,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState<boolean>(
    localStorage.getItem(collapsedKey) === "true"
  );
  const [value, setValue] = useState<string>(
    localStorage.getItem(valueKey) || ""
  );
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    const saved = localStorage.getItem(posKey);
    return saved ? JSON.parse(saved) : { x: defaultX, y: defaultY };
  });
  const [size, setSize] = useState<{ w: number; h: number }>(() => {
    const saved = localStorage.getItem(sizeKey);
    return saved ? JSON.parse(saved) : { w: 250, h: 150 };
  });

  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragging = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const minMargin = 10;
      const maxX = window.innerWidth - size.w - minMargin;
      const maxY = window.innerHeight - size.h - minMargin;
      let x = e.clientX - dragOffset.current.x;
      let y = e.clientY - dragOffset.current.y;
      x = Math.max(minMargin, Math.min(x, maxX));
      y = Math.max(minMargin, Math.min(y, maxY));
      setPos({ x, y });
    };
    const onMouseUp = () => {
      if (dragging.current) {
        localStorage.setItem(posKey, JSON.stringify(pos));
      }
      dragging.current = false;
      document.body.style.userSelect = "";
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [pos, size, posKey]);

  useEffect(() => {
    localStorage.setItem(valueKey, value);
  }, [value, valueKey]);

  useEffect(() => {
    if (!boxRef.current) return;
    const observer = new ResizeObserver(() => {
      if (boxRef.current) {
        const rect = boxRef.current.getBoundingClientRect();
        localStorage.setItem(
          sizeKey,
          JSON.stringify({ w: rect.width, h: rect.height })
        );
        setSize({ w: rect.width, h: rect.height });
      }
    });
    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, [sizeKey]);

  if (collapsed) {
    return (
      <button
        onClick={() => {
          setCollapsed(false);
          localStorage.setItem(collapsedKey, "false");
        }}
        className="note-icon"
        style={{
          right: icon === "🌍" ? "10px" : "60px",
        }}
        title={label}
      >
        {icon}
      </button>
    );
  }

  return (
    <div
      ref={boxRef}
      id={id}
      className="note-box"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${size.w}px`,
        height: `${size.h}px`,
      }}
    >
      <div className="note-header" onMouseDown={onMouseDown}>
        {label}
      </div>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="note-textarea"
      />

      <button
        onClick={() => {
          setCollapsed(true);
          localStorage.setItem(collapsedKey, "true");
        }}
        className="note-minimize"
        title="Zminimalizuj"
      >
        –
      </button>
    </div>
  );
};

export default NoteBox;
