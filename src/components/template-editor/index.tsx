"use client";

import { useState } from "react";
import { ElementToolbar } from "./element-toolbar";
import { Canvas } from "./canvas";
import { PropertyPanel } from "./property-panel";
import { PageSettings } from "./page-settings";
import { ElementType, Element, PageSize } from "./types";
import { nanoid } from "./utils";

export function TemplateEditor() {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [pageSize, setPageSize] = useState<PageSize>("A4");
  const [customDimensions, setCustomDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 1000,
  });

  const handleDrop = (
    type: ElementType,
    position: { x: number; y: number },
    parentId?: string
  ) => {
    const newElement: Element = {
      id: nanoid(),
      type,
      position,
      size: { width: 200, height: type === "text" || type === "dynamic-text" ? 40 : 200 },
      content: type === "dynamic-text" ? "{{variable}}" : type === "text" ? "Edit this text" : "",
      dynamicKey: type === "dynamic-text" ? "variable" : undefined,
      dataSource: undefined,
      isRepeatable: type === "container" ? false : undefined,
      styles: {
        backgroundColor: type === "container" ? "#ffffff" : "transparent",
        color: "#000000",
        padding: "1rem",
        borderRadius: "0.5rem",
        border: type === "container" ? "1px solid #e2e8f0" : "none",
        fontSize: "14px",
        fontWeight: "normal",
      },
      conditions: [],
      parentId,
      children: type === "container" ? [] : undefined,
    };

    setElements((prev) => {
      const updatedElements = [...prev, newElement];
      if (parentId) {
        const parentElement = prev.find((el) => el.id === parentId);
        if (parentElement) {
          const updatedParent = {
            ...parentElement,
            children: [...(parentElement.children || []), newElement.id],
          };
          return updatedElements.map((el) =>
            el.id === parentId ? updatedParent : el
          );
        }
      }
      return updatedElements;
    });
    setSelectedElement(newElement);
  };

  const updateElement = (updatedElement: Element) => {
    setElements((prev) =>
      prev.map((el) => (el.id === updatedElement.id ? updatedElement : el))
    );
    setSelectedElement(updatedElement);
  };

  const deleteElement = (id: string) => {
    setElements((prev) => {
      const elementToDelete = prev.find((el) => el.id === id);
      if (!elementToDelete) return prev;

      const idsToRemove = new Set<string>([id]);
      const addChildrenIds = (parentId: string) => {
        prev.forEach((el) => {
          if (el.parentId === parentId) {
            idsToRemove.add(el.id);
            addChildrenIds(el.id);
          }
        });
      };
      addChildrenIds(id);

      return prev
        .filter((el) => !idsToRemove.has(el.id))
        .map((el) => {
          if (el.children?.includes(id)) {
            return {
              ...el,
              children: el.children.filter((childId) => childId !== id),
            };
          }
          return el;
        });
    });
    setSelectedElement(null);
  };

  const exportTemplate = () => {
    const template = {
      elements: elements.map(({ id, type, position, size, content, dynamicKey, dataSource, isRepeatable, styles, conditions }) => ({
        id,
        type,
        position,
        size,
        content,
        dynamicKey,
        dataSource,
        isRepeatable,
        styles,
        conditions,
      })),
      pageSize,
      customDimensions: pageSize === "Custom" ? customDimensions : undefined,
    };
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b">
        <PageSettings 
          pageSize={pageSize} 
          customDimensions={customDimensions}
          onPageSizeChange={setPageSize}
          onCustomDimensionsChange={setCustomDimensions}
          onExport={exportTemplate}
        />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <ElementToolbar />
        <Canvas
          elements={elements}
          selectedElement={selectedElement}
          onSelect={setSelectedElement}
          onDrop={handleDrop}
          onUpdate={updateElement}
          onDelete={deleteElement}
          pageSize={pageSize}
          customDimensions={customDimensions}
        />
        <PropertyPanel
          element={selectedElement}
          onUpdate={updateElement}
          onDelete={deleteElement}
        />
      </div>
    </div>
  );
}