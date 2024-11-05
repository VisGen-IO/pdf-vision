"use client";
// pages/index.tsx
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SidePanel from "@/components/SidePanel";
import DroppableEditor from "@/components/DroppableEditor";

const HomePage: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex" }}>
        <SidePanel />
        <DroppableEditor />
      </div>
    </DndProvider>
  );
};

export default HomePage;
