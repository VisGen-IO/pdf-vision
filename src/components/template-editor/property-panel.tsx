"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { Element } from "./types";

interface PropertyPanelProps {
  element: Element | null;
  onUpdate: (element: Element) => void;
  onDelete: (id: string) => void;
  availableKeys: string[];
  jsonData: any;
  isArrayPath: (path: string) => boolean;
}

export function PropertyPanel({
  element,
  onUpdate,
  onDelete,
  availableKeys,
  jsonData,
  isArrayPath,
}: PropertyPanelProps) {
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

    const handleDataKeyChange = (value: string) => {
      const isArray = isArrayPath(value);
      const defaultAlias = value.split(".").pop() || "item";

      onUpdate({
        ...element,
        dataBinding: {
          key: isArray ? undefined : value,
          arrayPath: isArray ? value : undefined,
          itemAlias: isArray ? defaultAlias : undefined,
        },
        isRepeatable: isArray && element.type === "container",
      });
    };

    const handleRepeatableChange = (checked: boolean) => {
      const arrayPath = element.dataBinding?.arrayPath;
      const defaultAlias = arrayPath?.split(".").pop() || "item";

      onUpdate({
        ...element,
        isRepeatable: checked,
        dataBinding: {
          ...element.dataBinding,
          itemAlias: checked ? defaultAlias : undefined,
        },
      });
    };

    return (
      <div className="space-y-4">
        <div>
          <Label>Data Key</Label>
          <Select
            value={
              element.dataBinding?.key || element.dataBinding?.arrayPath || ""
            }
            onValueChange={handleDataKeyChange}
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
          <p className="text-xs text-muted-foreground mt-1">
            {element.dataBinding?.arrayPath
              ? "Selected key is an array. Enable 'Repeat for each item' to iterate."
              : "Selected key will be used as placeholder in format: {{key}}"}
          </p>
        </div>

        {element?.type === "container" && element?.dataBinding?.arrayPath && (
          <>
            <div className="flex items-center space-x-2">
              <Switch
                checked={element?.isRepeatable}
                onCheckedChange={handleRepeatableChange}
              />
              <Label>Repeat for each item</Label>
            </div>

            {element?.isRepeatable && (
              <div>
                <Label>Item Variable Name</Label>
                <Input
                  value={element.dataBinding.itemAlias || ""}
                  onChange={(e) =>
                    onUpdate({
                      ...element,
                      dataBinding: {
                        ...element.dataBinding,
                        itemAlias: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter variable name"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {
                    "This will be used as the variable name in the loop (e.g., {% for {name} in array %})"
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderElementSpecificControls = () => {
    switch (element.type) {
      case "text":
        return (
          <div className="space-y-4">
            <div>
              <Label>Content</Label>
              <Textarea
                value={element.content}
                onChange={(e) =>
                  onUpdate({ ...element, content: e.target.value })
                }
                placeholder="Enter content or select a data key"
                className="font-mono"
                rows={5}
              />
            </div>
            <div>
              <Label>Custom CSS</Label>
              <Textarea
                value={element.customCSS || ""}
                onChange={(e) => {
                  const updatedElement = {
                    ...element,
                    customCSS: e.target.value,
                  };
                  try {
                    if (e.target.value) {
                      const cssObj = JSON.parse(e.target.value);
                      if (typeof cssObj !== "object" || Array.isArray(cssObj)) {
                        updatedElement.cssError = "CSS must be a valid object";
                      } else {
                        const invalidProps = Object.entries(cssObj).filter(
                          ([_, value]) => typeof value !== "string"
                        );
                        if (invalidProps.length > 0) {
                          updatedElement.cssError = `Invalid values for properties: ${invalidProps
                            .map(([key]) => key)
                            .join(", ")}`;
                        } else {
                          updatedElement.cssError = "";
                        }
                      }
                    } else {
                      updatedElement.cssError = "";
                    }
                  } catch (err) {
                    updatedElement.cssError = "Invalid JSON format";
                  }
                  onUpdate(updatedElement);
                }}
                placeholder={
                  '{\n  "margin": "0",\n  "color": "#515151",\n  "height": "16px"\n}'
                }
                className={`font-mono ${
                  element.cssError ? "border-red-500" : ""
                }`}
                rows={5}
              />
              {element.cssError && (
                <p className="text-xs text-red-500 mt-1">{element.cssError}</p>
              )}
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <Label>Image URL</Label>
              <Input
                value={element.content}
                onChange={(e) =>
                  onUpdate({ ...element, content: e.target.value })
                }
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
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {renderElementSpecificControls()}
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          {renderDataBindingControls()}
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <div>
            <Label>Font Size</Label>
            <Input
              value={element.styles.fontSize}
              onChange={(e) => updateStyle("fontSize", e.target.value)}
              placeholder="12px"
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
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
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
            <Label>Margin</Label>
            <Input
              value={element.styles.margin}
              onChange={(e) => updateStyle("margin", e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <Label>Height</Label>
            <Input
              value={element.styles.height}
              onChange={(e) => updateStyle("height", e.target.value)}
              placeholder="16px"
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
