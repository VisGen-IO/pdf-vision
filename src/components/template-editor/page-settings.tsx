'use client';

import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageSize } from './types';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';

const PAGE_SIZES: Record<
  Exclude<PageSize, 'Custom'>,
  { width: number; height: number }
> = {
  A4: { width: 794, height: 1123 },
  A3: { width: 1123, height: 1587 },
  A5: { width: 559, height: 794 },
  Letter: { width: 816, height: 1056 },
  Custom: { width: 800, height: 1000 },
};

interface PageSettingsProps {
  pageSize: PageSize;
  customDimensions?: { width: number; height: number };
  onPageSizeChange: (size: PageSize) => void;
  onCustomDimensionsChange: (dimensions: {
    width: number;
    height: number;
  }) => void;
}

export function PageSettings({
  pageSize,
  customDimensions,
  onPageSizeChange,
  onCustomDimensionsChange,
}: PageSettingsProps) {
  return (
    <Card className="p-4 flex items-center gap-4">
      <div>
        <label className="text-sm font-medium">Page Size</label>
        <Select
          value={pageSize}
          onValueChange={(value: PageSize) => onPageSizeChange(value)}
        >
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
      {pageSize === 'Custom' && (
        <div className="flex gap-4">
          <div className="space-y-2">
            <Label>Width (px)</Label>
            <Input
              type="number"
              min="100"
              value={customDimensions?.width || 800}
              onChange={(e) =>
                onCustomDimensionsChange({
                  width: Number(e.target.value),
                  height: customDimensions?.height || 1000,
                })
              }
              className="w-24"
            />
          </div>
          <div className="space-y-2">
            <Label>Height (px)</Label>
            <Input
              type="number"
              min="100"
              value={customDimensions?.height || 1000}
              onChange={(e) =>
                onCustomDimensionsChange({
                  width: customDimensions?.width || 800,
                  height: Number(e.target.value),
                })
              }
              className="w-24"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
