"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Type, 
  Square, 
  Image as ImageIcon, 
  Variable,
  Link,
  SplitSquareVertical,
  List,
  Table2,
  Circle,
  MousePointer2
} from "lucide-react";
import { ElementType } from "./types";

const elements: { type: ElementType; icon: React.ComponentType; label: string }[] = [
  { type: "text", icon: Type, label: "Static Text" },
  { type: "container", icon: Square, label: "Container" },
  { type: "image", icon: ImageIcon, label: "Image" },
  { type: "button", icon: MousePointer2, label: "Button" },
  { type: "link", icon: Link, label: "Link" },
  { type: "divider", icon: SplitSquareVertical, label: "Divider" },
  { type: "list", icon: List, label: "List" },
  { type: "table", icon: Table2, label: "Table" },
];

const elementCategories = [
  {
    title: "Basic",
    elements: ["text", "container", "image", "dynamic-text"],
  },
  {
    title: "Interactive",
    elements: ["button", "link"],
  },
  {
    title: "Layout",
    elements: ["divider", "list", "table", "shape"],
  },
];

export function ElementToolbar() {
  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData("elementType", type);
  };

  return (
    <Card className="w-64 h-full p-4 rounded-none border-r overflow-y-auto">
      <h2 className="font-semibold mb-4">Elements</h2>
      <div className="space-y-6">
        {elementCategories.map((category) => (
          <div key={category.title}>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {category.title}
            </h3>
            <div className="space-y-2">
              {elements
                .filter((el) => category.elements.includes(el.type))
                .map(({ type, icon: Icon, label }:any) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="w-full justify-start gap-2"
                    draggable
                    onDragStart={(e) => handleDragStart(e, type)}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                ))}
            </div>
            {category.title !== elementCategories[elementCategories.length - 1].title && (
              <Separator className="my-4" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}