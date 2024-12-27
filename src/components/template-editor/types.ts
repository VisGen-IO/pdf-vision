export type ElementType =
  | 'text'
  | 'container'
  | 'image'
  | 'dynamic-text'
  | 'button'
  | 'link'
  | 'divider'
  | 'list'
  | 'table'
  | 'shape';

export type PageSize = 'A4' | 'A3' | 'A5' | 'Letter' | 'Custom' | string;

export interface PageDimensions {
  width: number;
  height: number;
}

export interface DataBinding {
  itemAlias: string;
  key?: string;
  arrayPath?: string;
  itemPrefix?: string;
}

export interface Element {
  id: string;
  dataSource?: any;
  type: ElementType;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  content: string;
  dataBinding?: DataBinding | any;
  isRepeatable?: boolean;
  styles: {
    backgroundColor: string;
    color: string;
    padding: string;
    borderRadius: string;
    border: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: string;
    opacity?: string;
    transform?: string;
    boxShadow?: string;
    textDecoration?: string;
    lineHeight?: string;
    letterSpacing?: string;
    listStyle?: string;
    tableLayout?: string;
    borderCollapse?: string;
    shapeType?: string;
    margin?: string;
    height?: string;
    display?: string;
    flexDirection?: string;
    gap?: string;
    [key: string]: string | undefined;
  };
  conditions: Array<{
    id: string;
    type: 'show' | 'hide';
    expression: string;
  }>;
  href?: string;
  listItems?: string[];
  tableData?: {
    rows: number;
    cols: number;
    headers: string[];
    data: string[][];
  };
  parentId?: string;
  children?: string[];
  customCSS?: string;
  cssError?: string;
}