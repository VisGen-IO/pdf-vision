// components/DroppableEditor.tsx
import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { renderToStaticMarkup } from "react-dom/server";
import EditorDroppableItem from "./EditorDroppableItem";

interface EditorItem {
  id: number;
  type: "text" | "image" | "button";
  content?: string;
  src?: string;
  label?: string;
  x: number;
  y: number;
}

const DroppableEditor: React.FC = () => {
  const [items, setItems] = useState<EditorItem[]>([]);
  const [generatedHTML, setGeneratedHTML] = useState<string>("");

  // Drop handler for items from `SidebarDroppableItem`
  const [, drop] = useDrop({
    accept: "sidebar-item",
    drop: (item: Omit<EditorItem, "id" | "x" | "y">, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (offset) {
        // Add a new item to the editor at the drop position
        addNewItem({ ...item, x: offset.x, y: offset.y });
      }
    },
  });

  const addNewItem = (item: Omit<EditorItem, "id">) => {
    setItems((prevItems) => [
      ...prevItems,
      { ...item, id: prevItems.length + 1 },
    ]);
  };

  const updateItemPosition = (id: number, x: number, y: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, x, y } : item))
    );
  };

  // Generate HTML whenever `items` changes
  useEffect(() => {
    const content = (
      <div>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              left: `${item.x}px`,
              top: `${item.y}px`,
            }}
          >
            {item.type === "text" && <p>{item.content}</p>}
            {item.type === "image" && (
              <img src={item.src} alt="Dropped" width="150" />
            )}
            {item.type === "button" && <button>{item.label}</button>}
          </div>
        ))}
      </div>
    );
    setGeneratedHTML(renderToStaticMarkup(content));
  }, [items]);

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex" }}>
        <div
          ref={drop}
          style={{
            flex: 1,
            minHeight: "400px",
            border: "1px dashed gray",
            position: "relative",
            backgroundColor: "#f9f9f9",
          }}
        >
          {items.map((item) => (
            <EditorDroppableItem
              key={item.id}
              {...item}
              updatePosition={updateItemPosition}
            />
          ))}
        </div>
      </div>
      {/* Render the generated HTML below the editor */}
      <div style={{ marginTop: "20px" }}>
        <h3>Generated HTML:</h3>
        <pre
          style={{
            backgroundColor: "#f4f4f4",
            padding: "10px",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            borderRadius: "5px",
          }}
        >
          {generatedHTML}
        </pre>
      </div>
    </div>
  );
};

export default DroppableEditor;
