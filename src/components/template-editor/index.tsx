"use client";

import { useState } from "react";
import { ElementToolbar } from "./element-toolbar";
import { Canvas } from "./canvas";
import { PropertyPanel } from "./property-panel";
import { PageSettings } from "./page-settings";
import { ElementType, Element, PageSize } from "./types";
import { nanoid } from "./utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function TemplateEditor() {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [pageSize, setPageSize] = useState<PageSize>("A4");
  const [jsonData, setJsonData] = useState<any>(null);
  const [jsonError, setJsonError] = useState<string>("");

  const handleJsonDataChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setJsonData(parsed);
      setJsonError("");
    } catch (e) {
      setJsonError("Invalid JSON format");
    }
  };

  const getLeafAndArrayPaths = (obj: any, parentPath = ""): string[] => {
    const paths: string[] = [];
    
    for (const key in obj) {
      const currentPath = parentPath ? `${parentPath}.${key}` : key;
      const value = obj[key];
      
      if (Array.isArray(value)) {
        paths.push(currentPath);
      } else if (typeof value === "object" && value !== null) {
        paths.push(...getLeafAndArrayPaths(value, currentPath));
      } else {
        paths.push(currentPath);
      }
    }
    
    return paths;
  };

  const getAvailableKeys = (parentId?: string): string[] => {
    if (!jsonData) return [];

    const parent = elements.find(el => el.id === parentId);
    if (!parent?.dataBinding?.key) {
      return getLeafAndArrayPaths(jsonData);
    }

    const parentValue = getValueFromPath(jsonData, parent.dataBinding.key);
    if (Array.isArray(parentValue) && parentValue.length > 0) {
      return Object.keys(parentValue[0]);
    }

    return [];
  };

  const isArrayPath = (path: string): boolean => {
    const value = getValueFromPath(jsonData, path);
    return Array.isArray(value);
  };

  const getValueFromPath = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  const generateHTML = () => {
    const resolveValue = (element: Element, data: any) => {
      if (!element.dataBinding?.key) return element.content;
      return getValueFromPath(data, element.dataBinding.key) || element.content;
    };

    const generateElementHTML = (element: Element, data: any = jsonData): string => {
      let html = '';
      
      if (element.isRepeatable && element.dataBinding?.arrayPath) {
        const arrayData = getValueFromPath(data, element.dataBinding.arrayPath);
        if (Array.isArray(arrayData)) {
          return arrayData.map(item => generateElementHTML({ ...element, isRepeatable: false }, item)).join('\n');
        }
      }

      switch (element.type) {
        case "container":
          const childElements = elements.filter(el => el.parentId === element.id);
          const childrenHTML = childElements.map(child => generateElementHTML(child, data)).join('\n');
          html = `<div style="${generateStyles(element.styles)}">${childrenHTML}</div>`;
          break;
        case "text":
        case "dynamic-text":
          const content = resolveValue(element, data);
          html = `<div style="${generateStyles(element.styles)}">${content}</div>`;
          break;
        case "image":
          const imageUrl = resolveValue(element, data);
          html = `<img src="${imageUrl}" alt="${element.styles.alt || ''}" style="${generateStyles(element.styles)}"/>`;
          break;
      }

      return html;
    };

    const generateStyles = (styles: Element['styles']): string => {
      return Object.entries(styles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');
    };

    const rootElements = elements.filter(element => !element.parentId);
    const bodyContent = rootElements.map(element => generateElementHTML(element)).join('\n');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Template</title>
</head>
<body style="margin: 0; padding: 20px;">
  ${bodyContent}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
      elements: elements.map(({ id, type, position, size, content, dynamicKey, dataSource, isRepeatable, styles, conditions, dataBinding }) => ({
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
        dataBinding,
      })),
      pageSize,
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
      <div className="p-4 border-b flex justify-between items-center">
        <PageSettings 
          pageSize={pageSize} 
          onPageSizeChange={setPageSize}
        />
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Load JSON Data</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Load JSON Data</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Textarea
                  placeholder="Paste your JSON data here..."
                  className="min-h-[300px] font-mono"
                  onChange={(e) => handleJsonDataChange(e.target.value)}
                />
                {jsonError && (
                  <p className="text-sm text-red-500">{jsonError}</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportTemplate}>
                Export Template (JSON)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={generateHTML}>
                Export HTML
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
        />
       {selectedElement && <PropertyPanel
          element={selectedElement}
          onUpdate={updateElement}
          onDelete={deleteElement}
          availableKeys={getAvailableKeys(selectedElement?.parentId)}
          jsonData={jsonData}
          isArrayPath={isArrayPath}
        />}
      </div>
    </div>
  );
}