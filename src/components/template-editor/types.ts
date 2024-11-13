export type ElementType = 
  | "text" 
  | "container" 
  | "image" 
  | "dynamic-text"
  | "button"
  | "link"
  | "divider"
  | "list"
  | "table"
  | "shape";

export type PageSize = "A4" | "A3" | "A5" | "Letter";

export interface PageDimensions {
  width: number;
  height: number;
}

export interface Element {
  id: string;
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
  dynamicKey?: string;
  dataSource?: {
    array?: string;
    field?: string;
  };
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
    [key: string]: string | undefined;
  };
  conditions: Array<{
    id: string;
    type: "show" | "hide";
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
}