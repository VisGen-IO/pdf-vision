'use client';

import { useRef, useState } from 'react';
import { Element } from './types';

interface ResizableElementProps {
  element: Element;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onUpdate: (element: Element) => void;
  onDelete: (id: string) => void;
  onDrop: (e: React.DragEvent, parentId: string) => void;
  children?: React.ReactNode;
}

export function ResizableElement({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDrop,
  children,
}: ResizableElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);

    const startX = e.clientX - element.position.x;
    const startY = e.clientY - element.position.y;

    const handleMouseMove = (e: MouseEvent) => {
      onUpdate({
        ...element,
        position: {
          x: e.clientX - startX,
          y: e.clientY - startY,
        },
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.size.width;
    const startHeight = element.size.height;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const newSize = {
        width: Math.max(
          100,
          startWidth + (direction.includes('e') ? deltaX : 0)
        ),
        height: Math.max(
          100,
          startHeight + (direction.includes('s') ? deltaY : 0)
        ),
      };

      onUpdate({
        ...element,
        size: newSize,
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      onDelete(element.id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (element.type === 'container') {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (element.type !== 'container') return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    onDrop(e, element.id);
  };

  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <p
            contentEditable
            suppressContentEditableWarning
            className="w-full h-full outline-none"
            onBlur={(e) =>
              onUpdate({
                ...element,
                content: e.currentTarget.textContent || '',
              })
            }
            onClick={(e) => e.stopPropagation()}
          >
            {element.content}
          </p>
        );
      case 'image':
        return (
          <img
            src={element.content}
            alt="Template element"
            className="w-full h-full"
            style={{
              objectFit: (element.styles.objectFit as any) || 'cover',
            }}
          />
        );
      case 'divider':
        return (
          <hr
            className="w-full h-px"
            style={{ backgroundColor: element.styles.backgroundColor }}
          />
        );
      case 'container':
        return (
          <div className="w-full h-full relative">
            {element.isRepeatable && (
              <div className="absolute -top-6 left-0 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                Repeatable: {element.dataSource?.array}
              </div>
            )}
            {children}
          </div>
        );
      case 'list':
        const ListComponent =
          element.styles.listStyle === 'ordered' ? 'ol' : 'ul';
        return (
          <ListComponent
            className="w-full h-full list-inside"
            style={{ listStyleType: element.styles.listStyle }}
          >
            {element.listItems?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ListComponent>
        );
      case 'table':
        return (
          <table className="w-full h-full border-collapse">
            <thead>
              <tr>
                {element.tableData?.headers.map((header, index) => (
                  <th key={index} className="border p-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {element.tableData?.data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return element.content;
    }
  };

  let customCSS = {};
  if (element.customCSS && !element.cssError) {
    try {
      customCSS = JSON.parse(element.customCSS);
    } catch (e) {
      // Ignore invalid CSS
    }
  }

  const combinedStyles: any = {
    left: element.position.x,
    top: element.position.y,
    width: element.size.width,
    height: element.size.height,
    cursor: isDragging ? 'grabbing' : 'grab',
    ...element.styles,
    ...customCSS,
  };
  return (
    <div
      ref={elementRef}
      className={`absolute ${isSelected ? 'ring-2 ring-primary' : ''} ${
        element.type === 'container' ? 'overflow-visible' : ''
      } ${isDragOver ? 'ring-2 ring-primary ring-dashed' : ''}`}
      style={combinedStyles}
      onClick={onSelect}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      tabIndex={0}
    >
      {renderContent()}

      {isSelected && (
        <>
          <div
            className="absolute -right-1 -bottom-1 w-3 h-3 bg-primary cursor-se-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          />
          <div
            className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary cursor-e-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
          />
          <div
            className="absolute right-1/2 -bottom-1 translate-x-1/2 w-3 h-3 bg-primary cursor-s-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
          />
        </>
      )}
    </div>
  );
}
