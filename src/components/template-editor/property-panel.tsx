"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, X } from "lucide-react";
import { Element } from "./types";

interface PropertyPanelProps {
  element: Element | null;
  onUpdate: (element: Element) => void;
  onDelete: (id: string) => void;
  availableKeys: string[];
  jsonData: any;
  isArrayPath: (path: string) => boolean;
}

export function PropertyPanel({ element, onUpdate, onDelete, availableKeys, jsonData, isArrayPath }: PropertyPanelProps) {
  if (!element) {
    return (
      <Card className="w-80 h-full p-4 rounded-none border-l">
        <div className="text-muted-foreground text-center mt-8">
          Select an element to edit its properties
        </div>
      </Card>
    );
  }

  const updateStyle = (property: string, value: string) => {
    onUpdate({
      ...element,
      styles: {
        ...element.styles,
        [property]: value,
      },
    });
  };

  const renderDataBindingControls = () => {
    if (!jsonData) return null;

    return (
      <div className="space-y-4">
        <div>
          <Label>Data Binding</Label>
          <Select
            value={element.dataBinding?.key || ""}
            onValueChange={(value) => {
              const isArray = isArrayPath(value);
              onUpdate({
                ...element,
                dataBinding: {
                  key: value,
                  arrayPath: isArray ? value : undefined
                },
                isRepeatable: isArray && element.type === "container"
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select data key" />
            </SelectTrigger>
            <SelectContent>
              {availableKeys.map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {element.type === "container" && element.dataBinding?.arrayPath && (
          <div className="flex items-center space-x-2">
            <Switch
              checked={element.isRepeatable}
              onCheckedChange={(checked) =>
                onUpdate({ ...element, isRepeatable: checked })
              }
            />
            <Label>Repeat for each item</Label>
          </div>
        )}
      </div>
    );
  };

  const renderElementSpecificControls = () => {
    switch (element.type) {
      case "text":
      case "dynamic-text":
        return (
          <div className="space-y-4">
            <div>
              <Label>Content</Label>
              <Input
                value={element.content}
                onChange={(e) => onUpdate({ ...element, content: e.target.value })}
                placeholder="Enter text content"
              />
            </div>
            {element.type === "dynamic-text" && (
              <div>
                <Label>Variable Key</Label>
                <Input
                  value={element.dynamicKey || ""}
                  onChange={(e) => onUpdate({ ...element, dynamicKey: e.target.value })}
                  placeholder="Enter variable name"
                />
              </div>
            )}
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <Label>Image URL</Label>
              <Input
                value={element.content}
                onChange={(e) => onUpdate({ ...element, content: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={element.styles.alt || ""}
                onChange={(e) => updateStyle("alt", e.target.value)}
                placeholder="Enter alt text"
              />
            </div>
            <div>
              <Label>Object Fit</Label>
              <Select
                value={element.styles.objectFit || "cover"}
                onValueChange={(value) => updateStyle("objectFit", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="contain">Contain</SelectItem>
                  <SelectItem value="fill">Fill</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-80 h-full p-4 rounded-none border-l overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Properties</h2>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(element.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {renderElementSpecificControls()}
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          {renderDataBindingControls()}
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <div>
            <Label>Background Color</Label>
            <Input
              type="color"
              value={element.styles.backgroundColor}
              onChange={(e) => updateStyle("backgroundColor", e.target.value)}
            />
          </div>

          <div>
            <Label>Text Color</Label>
            <Input
              type="color"
              value={element.styles.color}
              onChange={(e) => updateStyle("color", e.target.value)}
            />
          </div>

          <div>
            <Label>Font Size</Label>
            <Input
              value={element.styles.fontSize}
              onChange={(e) => updateStyle("fontSize", e.target.value)}
              placeholder="16px"
            />
          </div>

          <div>
            <Label>Font Weight</Label>
            <Select
              value={element.styles.fontWeight || "normal"}
              onValueChange={(value) => updateStyle("fontWeight", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Text Align</Label>
            <Select
              value={element.styles.textAlign || "left"}
              onValueChange={(value) => updateStyle("textAlign", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Border Radius</Label>
            <Input
              value={element.styles.borderRadius}
              onChange={(e) => updateStyle("borderRadius", e.target.value)}
              placeholder="0.5rem"
            />
          </div>

          <div>
            <Label>Border</Label>
            <Input
              value={element.styles.border}
              onChange={(e) => updateStyle("border", e.target.value)}
              placeholder="1px solid #000"
            />
          </div>

          <div>
            <Label>Opacity</Label>
            <Input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={element.styles.opacity || "1"}
              onChange={(e) => updateStyle("opacity", e.target.value)}
            />
          </div>

          <div>
            <Label>Box Shadow</Label>
            <Input
              value={element.styles.boxShadow || ""}
              onChange={(e) => updateStyle("boxShadow", e.target.value)}
              placeholder="0 2px 4px rgba(0,0,0,0.1)"
            />
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Position X</Label>
              <Input
                type="number"
                value={element.position.x}
                onChange={(e) =>
                  onUpdate({
                    ...element,
                    position: { ...element.position, x: Number(e.target.value) },
                  })
                }
              />
            </div>
            <div>
              <Label>Position Y</Label>
              <Input
                type="number"
                value={element.position.y}
                onChange={(e) =>
                  onUpdate({
                    ...element,
                    position: { ...element.position, y: Number(e.target.value) },
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Width</Label>
              <Input
                type="number"
                value={element.size.width}
                onChange={(e) =>
                  onUpdate({
                    ...element,
                    size: { ...element.size, width: Number(e.target.value) },
                  })
                }
              />
            </div>
            <div>
              <Label>Height</Label>
              <Input
                type="number"
                value={element.size.height}
                onChange={(e) =>
                  onUpdate({
                    ...element,
                    size: { ...element.size, height: Number(e.target.value) },
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label>Padding</Label>
            <Input
              value={element.styles.padding}
              onChange={(e) => updateStyle("padding", e.target.value)}
              placeholder="1rem"
            />
          </div>

          <div>
            <Label>Z-Index</Label>
            <Input
              type="number"
              value={element.styles.zIndex || "0"}
              onChange={(e) => updateStyle("zIndex", e.target.value)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}