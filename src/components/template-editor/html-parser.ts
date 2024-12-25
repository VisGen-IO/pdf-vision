'use client';

import { Element, ElementType } from './types';
import { nanoid } from './utils';

export function parseHTMLToTemplate(html: string): Element[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  function extractStyles(element: HTMLElement): Record<string, string> {
    const styleObj: Record<string, string> = {};
    
    // Extract inline styles
    const inlineStyles = element.getAttribute('style');
    if (inlineStyles) {
      const styleRegex = /([^:]+):\s*([^;]+)/g;
      let match;
      while ((match = styleRegex.exec(inlineStyles)) !== null) {
        const [, property, value] = match;
        const camelProperty = property.trim().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        styleObj[camelProperty] = value.trim();
      }
    }

    return styleObj;
  }

  let yOffset = 20;
  const xPadding = 20;

  function createElementObject(
    type: ElementType,
    content: string,
    styles: Record<string, string>,
    size: { width: number; height: number },
    parentId?: string
  ): Element {
    const element = {
      id: nanoid(),
      type,
      position: { x: xPadding, y: yOffset },
      size,
      content,
      styles: {
        backgroundColor: styles.backgroundColor || 'transparent',
        color: styles.color || '#000000',
        padding: styles.padding || '1rem',
        borderRadius: styles.borderRadius || '0.5rem',
        border: styles.border || 'none',
        fontSize: styles.fontSize || '14px',
        fontWeight: styles.fontWeight || 'normal',
        ...styles
      },
      conditions: [],
      parentId,
    };

    // Increment yOffset for next element
    yOffset += size.height + 20;
    return element;
  }

  function parseElement(node: Node, parentId?: string): Element[] {
    const elements: Element[] = [];

    if (!node) return elements;

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        elements.push(
          createElementObject(
            'text',
            text,
            {},
            { width: 300, height: 40 },
            parentId
          )
        );
      }
      return elements;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return elements;

    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();
    const styles = extractStyles(element);

    // Skip body and html tags
    if (tagName === 'body' || tagName === 'html') {
      Array.from(element.children).forEach(child => {
        elements.push(...parseElement(child));
      });
      return elements;
    }

    switch (tagName) {
      case 'img': {
        const imgElement = createElementObject(
          'image',
          (element as HTMLImageElement).src,
          { ...styles, objectFit: 'cover' },
          { width: 200, height: 200 },
          parentId
        );
        elements.push(imgElement);
        break;
      }

      case 'div':
      case 'section':
      case 'article': {
        const containerElement = createElementObject(
          'container',
          '',
          { ...styles, border: styles.border || '1px solid #e2e8f0' },
          { width: 400, height: Math.max(300, element.children.length * 100) },
          parentId
        );
        
        elements.push(containerElement);

        // Save current yOffset
        const parentYOffset = yOffset;
        // Reset yOffset for children
        yOffset = 20;

        // Parse children
        Array.from(element.children).forEach(child => {
          const childElements = parseElement(child, containerElement.id);
          elements.push(...childElements);
        });

        // Restore yOffset for siblings
        yOffset = parentYOffset + containerElement.size.height + 20;
        break;
      }

      case 'p':
      case 'span':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        const textElement = createElementObject(
          'text',
          element.innerHTML,
          styles,
          { width: 300, height: 40 },
          parentId
        );
        elements.push(textElement);
        break;
      }

      default:
        Array.from(element.children).forEach(child => {
          elements.push(...parseElement(child, parentId));
        });
    }

    return elements;
  }

  // Start parsing from body's direct children
  return Array.from(doc.body.children).reduce((acc: Element[], child) => {
    return [...acc, ...parseElement(child)];
  }, []);
}