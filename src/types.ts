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

/** Configuration for auto-naming branches */
export type AutoBranchConfig = {
  /** Whether merge nodes (multiple parents) create new branches (default: true) */
  mergeCreatesBranch?: boolean;
  /** 
   * Function to generate branch names.
   * Defaults to the node ID in lowercase.
   * 
   * @param firstNodeId - The ID of the first node in this branch
   * @param nodeMap - Map of all nodes in the graph (nodeId -> Node)
   * @returns The name for this branch
   */
  nameBranch?: (firstNodeId: string, nodeMap: Map<string, Node>) => string;
};

/**
 * Default branch naming function - uses the node ID in lowercase
 */
const defaultNameBranch = (firstNodeId: string) => firstNodeId.toLowerCase();

export type ResolvedAutoBranchConfig = Required<AutoBranchConfig>;

export const resolveAutoBranchConfig = (config: AutoBranchConfig): ResolvedAutoBranchConfig => ({
  mergeCreatesBranch: config.mergeCreatesBranch ?? true,
  nameBranch: config.nameBranch ?? defaultNameBranch,
});

/** Props for the main GridGraph component */
export type GraphProps = {
  /** Array of nodes to display */
  nodes: Node[];
  /** Array of edges connecting nodes */
  edges: Edge[];
  /** Callback when a node is clicked */
  onClick?: (id: string) => void;
  /** Callback when a node is double-clicked */
  onNodeDoubleClick?: (id: string) => void;
  /** Callback when a node is right-clicked */
  onNodeContextMenu?: (id: string, event: React.MouseEvent) => void;
  /** Callback when mouse enters a node */
  onNodeMouseOver?: (id: string) => void;
  /** Callback when mouse leaves a node */
  onNodeMouseOut?: (id: string) => void;
  /** Controlled selected node ID (for controlled component pattern) */
  selectedNodeId?: string | null;
  /** Callback when selected node changes (for controlled component pattern) */
  onSelectedNodeChange?: (id: string | null) => void;
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
  /** Auto-name branches. Pass true for defaults or an object to configure behavior */
  autoBranches?: boolean | AutoBranchConfig;
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
