// components/SidePanel.tsx
import React from "react";
import SidebarDroppableItem from "./SidebarDroppableItem";

const SidePanel: React.FC = () => {
  return (
    <div
      style={{ width: "200px", borderRight: "1px solid #ccc", padding: "16px" }}
    >
      <h3>Items</h3>
      <SidebarDroppableItem type="text" content="Sample Text" />
      <SidebarDroppableItem
        type="image"
        src="https://via.placeholder.com/150"
      />
      <SidebarDroppableItem type="button" label="Click Me" />
    </div>
  );
};

export default SidePanel;
