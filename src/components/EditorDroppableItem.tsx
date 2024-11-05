// components/EditorDroppableItem.tsx
import React from "react";
import { useDrag } from "react-dnd";

interface EditorDroppableItemProps {
  id: number;
  type: "text" | "image" | "button";
  content?: string;
  src?: string;
  label?: string;
  x: number;
  y: number;
  updatePosition: (id: number, x: number, y: number) => void;
}

const EditorDroppableItem: React.FC<EditorDroppableItemProps> = ({
  id,
  type,
  content,
  src,
  label,
  x,
  y,
  updatePosition,
}) => {
  const [, drag] = useDrag({
    type: "editor-item",
    item: { id },
    end: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (offset) {
        updatePosition(id, offset.x, offset.y);
      }
    },
  });

  return (
    <div
      ref={drag}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        cursor: "move",
      }}
    >
      {type === "text" && <p>{content}</p>}
      {type === "image" && <img src={src} alt="Draggable" width="100" />}
      {type === "button" && <button>{label}</button>}
    </div>
  );
};

export default EditorDroppableItem;
