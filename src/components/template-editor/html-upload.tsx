'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { parseHTMLToTemplate } from "./html-parser";
import { Element } from "./types";
import { useState } from "react";

interface HTMLUploadProps {
  onTemplateGenerated: (elements: Element[]) => void;
}

export function HTMLUpload({ onTemplateGenerated }: HTMLUploadProps) {
  const [open, setOpen] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const html = event.target?.result as string;
      
      // Create a temporary container to parse the HTML
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = '800px'; // Set a default width for proper style computation
      document.body.appendChild(container);
      
      container.innerHTML = html;
      
      // Allow the browser to compute styles
      requestAnimationFrame(() => {
        const elements = parseHTMLToTemplate(html);
        document.body.removeChild(container);
        onTemplateGenerated(elements);
        setOpen(false); // Close the dialog after processing
      });
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Import HTML
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload HTML File</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept=".html"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />
            <p className="text-sm text-muted-foreground text-center">
              Upload an HTML file to automatically generate a template layout.
              The system will analyze the HTML structure and create corresponding elements.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}