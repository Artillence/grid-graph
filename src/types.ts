export type Node = {
  id: string;
  label: string | React.ReactNode;
  branch?: string;
};

export type Edge = {
  id: string;
  source: string;
  target: string;
};

export type GraphConfig = {
  rowHeight?: number;
  columnWidth?: number;
  nodeDiameter?: number;
  padding?: number;
  labelLeftMargin?: number;
  colors?: string[];
  cornerRadius?: number;
  headerHeight?: string;
};

export type ResolvedGraphConfig = Required<
  Omit<GraphConfig, "headerHeight">
> & {
  headerHeight?: string;
};

export type GraphProps = {
  nodes: Node[];
  edges: Edge[];
  onSelect?: (id: string) => void;
  verticalLabels?: boolean;
  config?: GraphConfig;
  className?: string;
  onReorderBranches?: (newOrder: string[]) => void;
  branchOrder?: string[];
};

export type LayoutData = {
  nodeColumnMap: Map<string, number>;
  nodeBranchMap: Map<string, string>;
  branchLaneMap: Map<string, number>;
  maxCol: number;
  branchColorMap: Map<string, string>;
  nodeRenderIndex: Map<string, number>;
  error: string | null;
};

export type NodePosition = {
  x: number;
  y: number;
};
