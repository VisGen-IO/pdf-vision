// components/SidebarDroppableItem.tsx
import React from "react";
import { useDrag } from "react-dnd";

interface SidebarDroppableItemProps {
  type: "text" | "image" | "button";
  content?: string;
  src?: string;
  label?: string;
}

const SidebarDroppableItem: React.FC<SidebarDroppableItemProps> = ({
  type,
  content,
  src,
  label,
}) => {
  const [, drag] = useDrag({
    type: "sidebar-item",
    item: { type, content, src, label },
  });

  return (
    <div ref={drag} style={{ cursor: "grab" }}>
      {type === "text" && <p>{content}</p>}
      {type === "image" && <img src={src} alt="Draggable" width="100" />}
      {type === "button" && <button>{label}</button>}
    </div>
  );
};

export default SidebarDroppableItem;
