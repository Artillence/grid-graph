/** A node in the graph */
export type Node = {
  /** Unique identifier for the node */
  id: string;
  /** Display label (can be string or React component) */
  label: string | React.ReactNode;
  /** Branch/lane name (defaults to 'main' if not specified) */
  branch?: string;
};

/** An edge connecting two nodes */
export type Edge = {
  /** Unique identifier for the edge */
  id: string;
  /** ID of the source node */
  source: string;
  /** ID of the target node */
  target: string;
};

/** Configuration options for graph dimensions and styling */
export type GraphConfig = {
  /** Height of each row in pixels (default: 38) */
  rowHeight?: number;
  /** Width of each column in pixels (default: 18) */
  columnWidth?: number;
  /** Diameter of node circles in pixels (default: 13) */
  nodeDiameter?: number;
  /** Padding around the graph in pixels (default: 20) */
  padding?: number;
  /** Left margin for node labels in pixels (default: 20) */
  labelLeftMargin?: number;
  /** Array of colors for branch lanes */
  colors?: string[];
  cornerRadius?: number;
  /** Custom header height (auto-calculated if not provided) */
  headerHeight?: string;
};

export type ResolvedGraphConfig = Required<
  Omit<GraphConfig, "headerHeight">
> & {
  headerHeight?: string;
};

/** Props for the main GridGraph component */
export type GraphProps = {
  /** Array of nodes to display */
  nodes: Node[];
  /** Array of edges connecting nodes */
  edges: Edge[];
  /** Callback when a node is clicked */
  onSelect?: (id: string) => void;
  /** Display branch labels vertically (default: true) */
  verticalLabels?: boolean;
  /** Configuration for dimensions and styling */
  config?: GraphConfig;
  /** Custom CSS class for the root container */
  className?: string;
  /** Callback when branches are reordered via drag-and-drop */
  onReorderBranches?: (newOrder: string[]) => void;
  /** Initial order of branches (lane arrangement) */
  branchOrder?: string[];
  /** Custom inline styles for the root container */
  style?: React.CSSProperties;
  /** Auto-name branches after their first node (default: false) */
  autoNameBranches?: boolean;
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
