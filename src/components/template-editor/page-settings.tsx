"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageSize } from "./types";

const PAGE_SIZES: Record<PageSize, { width: number; height: number }> = {
  "A4": { width: 794, height: 1123 }, // 210mm × 297mm in pixels at 96 DPI
  "A3": { width: 1123, height: 1587 }, // 297mm × 420mm
  "A5": { width: 559, height: 794 }, // 148mm × 210mm
  "Letter": { width: 816, height: 1056 }, // 216mm × 279mm
};

interface PageSettingsProps {
  pageSize: PageSize;
  onPageSizeChange: (size: PageSize) => void;
  onExport: () => void;
}

export function PageSettings({ pageSize, onPageSizeChange, onExport }: PageSettingsProps) {
  return (
    <Card className="p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <label className="text-sm font-medium">Page Size</label>
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
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={onExport}>Export Template</Button>
    </Card>
  );
}