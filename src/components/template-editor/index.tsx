'use client';

import { useState } from 'react';
import { ElementToolbar } from './element-toolbar';
import { Canvas } from './canvas';
import { PropertyPanel } from './property-panel';
import { PageSettings } from './page-settings';
import { HTMLUpload } from './html-upload';
import { ElementType, Element, PageSize } from './types';
import { nanoid } from './utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TemplateEditor() {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [jsonData, setJsonData] = useState<any>(null);
  const [jsonError, setJsonError] = useState<string>('');
  const [customDimensions, setCustomDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 800,
    height: 1000,
  });

  const handleJsonDataChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setJsonData(parsed);
      setJsonError('');
    } catch (e) {
      setJsonError('Invalid JSON format');
    }
  };

  const getLeafAndArrayPaths = (obj: any, parentPath = '', isRoot = true): string[] => {
    if (!obj || typeof obj !== 'object') return [];
    
    // If we're at the root level, only return first-level keys
    if (isRoot) {
      return Object.keys(obj);
    }

    const paths: string[] = [];
    const processObject = (obj: any, currentPath: string) => {
      for (const key in obj) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        const value = obj[key];

        if (Array.isArray(value)) {
          paths.push(newPath);
        } else if (typeof value === 'object' && value !== null) {
          processObject(value, newPath);
        } else {
          paths.push(newPath);
        }
      }
    };

    processObject(obj, parentPath);
    return paths;
  };

  const getAvailableKeys = (parentId?: string): string[] => {
    if (!jsonData) return [];

    const parent = elements.find((el) => el.id === parentId);
    if (!parent?.dataBinding?.arrayPath) {
      return getLeafAndArrayPaths(jsonData);
    }

    const parentValue = getValueFromPath(jsonData, parent.dataBinding.arrayPath);
    if (Array.isArray(parentValue) && parentValue.length > 0) {
      return getLeafAndArrayPaths(parentValue[0], '', false);
    }

    return [];
  };

  const isArrayPath = (path: string): boolean => {
    const value = getValueFromPath(jsonData, path);
    return Array.isArray(value);
  };

  const getValueFromPath = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => {
      if (part.endsWith(']')) {
        const [arrayName, index] = part.split('[');
        return acc?.[arrayName]?.[parseInt(index)];
      }
      return acc?.[part];
    }, obj);
  };

  const generateHTML = () => {
    const generateElementHTML = (element: Element, itemPrefix = ''): string => {
      let html = '';
      const styles = generateStyles(element.styles);
      let customStyles = '';
      
      if (element.customCSS) {
        try {
          const cssObj = JSON.parse(element.customCSS);
          customStyles = Object.entries(cssObj)
            .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
            .join('; ');
        } catch (e) {
          // Ignore invalid CSS
        }
      }

      const combinedStyles = `${styles}${customStyles ? '; ' + customStyles : ''}`;

      if (element.isRepeatable && element.dataBinding?.arrayPath) {
        const arrayPath = element.dataBinding.arrayPath;
        const itemAlias = `${element?.dataBinding?.itemAlias || element?.dataBinding?.arrayPath}_item`|| arrayPath.split('.').pop() || 'item';
        html = `{% for ${itemAlias} in ${arrayPath} %}\n`;
        
        const childElements = elements.filter((el) => el.parentId === element.id);
        const containerHTML = `<div style="${combinedStyles}">${
          childElements
            .map((child) => generateElementHTML(child, `${itemAlias}.`))
            .join('\n')
        }</div>`;
        
        html += containerHTML;
        html += `\n{% endfor %}`;
        return html;
      }

      switch (element.type) {
        case 'container':
          const childElements = elements.filter((el) => el.parentId === element.id);
          html = `<div style="${combinedStyles}">${
            childElements
              .map((child) => generateElementHTML(child, itemPrefix))
              .join('\n')
          }</div>`;
          break;

        case 'text':
          const content = element.dataBinding?.key
            ? `{{${itemPrefix}${element.dataBinding.key}}}`
            : element.content;
          html = `<p style="${combinedStyles}">${content}</p>`;
          break;

        case 'image':
          html = `<img src="${element.content}" alt="${element.styles.alt || ''}" style="${combinedStyles}"/>`;
          break;

        default:
          html = `<div style="${combinedStyles}">${element.content}</div>`;
          break;
      }

      return html;
    };

    const generateStyles = (styles: Element['styles']): string => {
      return Object.entries(styles)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');
    };

    const rootElements = elements.filter((element) => !element.parentId);
    const bodyContent = rootElements
      .map((element) => generateElementHTML(element))
      .join('\n');

    const html = `<!DOCTYPE html>
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
      size: {
        width: type === 'text' ? 300 : 200,
        height: type === 'text' ? 40 : 200,
      },
      content: type === 'text' ? 'Edit this text' : '',
      styles: {
        backgroundColor: type === 'container' ? '#ffffff' : 'transparent',
        color: '#515151',
        padding: '0',
        borderRadius: '0',
        border: type === 'container' ? '1px solid #e2e8f0' : 'none',
        fontSize: '12px',
        fontWeight: 'normal',
        margin: '0',
        display: type === 'container' ? 'flex' : undefined,
        flexDirection: type === 'container' ? 'column' : undefined,
        gap: type === 'container' ? '4px' : undefined,
      },
      conditions: [],
      parentId,
    };

    setElements((prev) => [...prev, newElement]);
    setSelectedElement(newElement);
  };

  const updateElement = (updatedElement: Element) => {
    setElements((prev) =>
      prev.map((el) => (el.id === updatedElement.id ? updatedElement : el))
    );
    setSelectedElement(updatedElement);
  };

  const deleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedElement(null);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="w-full p-4 border-b flex justify-between items-center  bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <PageSettings
            pageSize={pageSize}
            customDimensions={customDimensions}
            onPageSizeChange={setPageSize}
            onCustomDimensionsChange={setCustomDimensions}
          />
          <HTMLUpload onTemplateGenerated={setElements} />
        </div>
        <div className="flex gap-2 mr-4">
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
          customDimensions={customDimensions}
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