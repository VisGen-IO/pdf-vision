"use client";

import { useRef } from "react";
import { Element, PageSize } from "./types";
import { ResizableElement } from "./resizable-element";
import { Card } from "@/components/ui/card";

const PAGE_SIZES: Record<PageSize, { width: number; height: number }> = {
  "A4": { width: 794, height: 1123 },
  "A3": { width: 1123, height: 1587 },
  "A5": { width: 559, height: 794 },
  "Letter": { width: 816, height: 1056 },
};

interface CanvasProps {
  elements: Element[];
  selectedElement: Element | null;
  pageSize: PageSize;
  onSelect: (element: Element | null) => void;
  onDrop: (type: Element["type"], position: { x: number; y: number }, parentId?: string) => void;
  onUpdate: (element: Element) => void;
  onDelete: (id: string) => void;
}

export function Canvas({
  elements,
  selectedElement,
  pageSize,
  onSelect,
  onDrop,
  onUpdate,
  onDelete,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, parentId?: string) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("elementType") as Element["type"];
    if (!type || !canvasRef.current) return;

    const rect = parentId
      ? (e.currentTarget as HTMLElement).getBoundingClientRect()
      : canvasRef.current.getBoundingClientRect();

    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    onDrop(type, position, parentId);
  };

  const renderElement = (element: Element) => {
    const childElements = elements.filter((el) => el.parentId === element.id);

    return (
      <ResizableElement
        key={element.id}
        element={element}
        isSelected={selectedElement?.id === element.id}
        onSelect={(e) => {
          e.stopPropagation();
          onSelect(element);
        }}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDrop={handleDrop}
      >
        {childElements.map(renderElement)}
      </ResizableElement>
    );
  };

  const rootElements = elements.filter((element) => !element.parentId);
  const pageDimensions = PAGE_SIZES[pageSize];

  return (
    <div className="flex-1 overflow-auto bg-neutral-100 p-8">
      <Card
        ref={canvasRef}
        className="relative mx-auto bg-white shadow-lg"
        style={{
          width: pageDimensions.width,
          height: pageDimensions.height,
        }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e)}
        onClick={() => onSelect(null)}
      >
        {rootElements.map(renderElement)}
      </Card>
    </div>
  );
}