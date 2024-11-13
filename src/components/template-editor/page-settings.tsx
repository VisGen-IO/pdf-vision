"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageSize } from "./types";

const PAGE_SIZES: Record<Exclude<PageSize, "Custom">, { width: number; height: number }> = {
  "A4": { width: 794, height: 1123 }, // 210mm × 297mm in pixels at 96 DPI
  "A3": { width: 1123, height: 1587 }, // 297mm × 420mm
  "A5": { width: 559, height: 794 }, // 148mm × 210mm
  "Letter": { width: 816, height: 1056 }, // 216mm × 279mm
};

interface PageSettingsProps {
  pageSize: PageSize;
  customDimensions?: { width: number; height: number };
  onPageSizeChange: (size: PageSize) => void;
  onCustomDimensionsChange: (dimensions: { width: number; height: number }) => void;
  onExport: () => void;
}

export function PageSettings({ 
  pageSize, 
  customDimensions,
  onPageSizeChange, 
  onCustomDimensionsChange,
  onExport 
}: PageSettingsProps) {
  return (
    <Card className="p-4 mb-4">
      <div className="flex items-start gap-6">
        <div className="space-y-2">
          <Label>Page Size</Label>
          <Select value={pageSize} onValueChange={(value: PageSize) => onPageSizeChange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(PAGE_SIZES).map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {pageSize === "Custom" && (
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label>Width (px)</Label>
              <Input
                type="number"
                min="100"
                value={customDimensions?.width || 800}
                onChange={(e) => onCustomDimensionsChange({
                  width: Number(e.target.value),
                  height: customDimensions?.height || 1000
                })}
                className="w-24"
              />
            </div>
            <div className="space-y-2">
              <Label>Height (px)</Label>
              <Input
                type="number"
                min="100"
                value={customDimensions?.height || 1000}
                onChange={(e) => onCustomDimensionsChange({
                  width: customDimensions?.width || 800,
                  height: Number(e.target.value)
                })}
                className="w-24"
              />
            </div>
          </div>
        )}

        <div className="ml-auto">
          <Button onClick={onExport}>Export Template</Button>
        </div>
      </div>
    </Card>
  );
}