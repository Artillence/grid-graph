"use client";
import React, { useMemo, useState, useLayoutEffect, useRef } from "react";

// # Workflow Graph Layout & Validation Rules

// This component uses a Git-like branching model to create a deterministic and readable graph layout. To ensure the layout is unambiguous, the provided nodes and edges must follow these rules:

// ### 1. Graph Structure
// - **Must be a DAG:** The graph must be a Directed Acyclic Graph. It cannot contain any circular dependencies.

// ### 2. Node Rules
// - **Merge Nodes (`>1` parent):** A node with more than one incoming edge **must** have an explicit `branch` property. This declares which branch the workflow continues on after the merge.
//     ```jsx
//     // Valid: '4' is a merge node and declares its branch.
//     { id: '4', label: 'Merge', branch: 'main' }
//     ```

// - **Branch Point Nodes (`>1` child):** A node that creates a branch by having more than one outgoing edge has two sub-rules:
//     1. **Branch Heads:** All but one of the children **must** have an explicit `branch` property to define the new branch heads. One child is allowed to inherit the parent's branch.
//     2. **Root Node Branching:** If the branch point node is also a root node (no parents), it **must** have an explicit `branch` property itself (e.g., `branch: 'main'`).

//     ```jsx
//     // Valid: 'start' is a branching root and declares its branch.
//     // 'a1' and 'b1' are branch heads. 'c1' inherits from 'start'.
//     { id: 'start', label: 'Start', branch: 'main' },
//     { id: 'a1', label: 'A1', branch: 'feature-A' },
//     { id: 'b1', label: 'B1', branch: 'feature-B' },
//     { id: 'c1', label: 'C1' }, // Inherits 'main'
//     ```

// - **Inheritance:** A node with a single parent and no explicit `branch` property will automatically inherit the branch of its parent.

// ### 3. Layout & Coloring Behavior
// - **Lanes:** Each unique branch name is assigned a permanent, unique vertical column (a "lane"). Lanes are never reused by different branches.
// - **Node Color:** A node's color is determined by the color assigned to its branch.
// - **Edge Color:**
//     - An edge leading *into* a merge node retains the color of its **source** branch.
//     - All other edges (branching out or continuing) take the color of their **target** branch.
// - **Rendering Order:** The graph is rendered top-to-bottom based on a topological sort. Disconnected components are grouped together and will not be interleaved.

type Node = {
  id: string;
  label: string | React.ReactNode;
  branch?: string;
};

type Edge = { id: string; source: string; target: string };

type GraphConfig = {
  rowHeight?: number;
  columnWidth?: number;
  nodeDiameter?: number;
  padding?: number;
  labelLeftMargin?: number;
  colors?: string[];
  cornerRadius?: number;
  headerHeight?: string;
};

type GraphVisibility = {
  showBranchDots?: boolean;
  showBranchNames?: boolean;
  showLaneLines?: boolean;
  showEdges?: boolean;
  showNodeBackgrounds?: boolean;
  showNodeLabels?: boolean;
};

type GraphProps = {
  nodes: Node[];
  edges: Edge[];
  onSelect?: (id: string) => void;
  verticalLabels?: boolean;
  config?: GraphConfig;
  visibility?: GraphVisibility;
  onReorderBranches?: (newOrder: string[]) => void;
  branchOrder?: string[];
};

// --- VALIDATION & TOPOLOGICAL SORT LOGIC ---

/**
 * Validates the graph for all branching rules and cycles.
 * Returns a topologically sorted array of node IDs that respects disconnected components.
 */
const validateAndSort = (nodes: Node[], edges: Edge[]): string[] => {
  if (nodes.length === 0) return [];

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const parentMap = new Map<string, string[]>();
  const childMap = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const node of nodes) {
    inDegree.set(node.id, 0);
    parentMap.set(node.id, []);
    childMap.set(node.id, []);
  }

  for (const edge of edges) {
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
    parentMap.get(edge.target)?.push(edge.source);
    childMap.get(edge.source)?.push(edge.target);
  }

  // --- VALIDATION RULES (Run on the whole graph) ---
  for (const [nodeId, parents] of parentMap.entries()) {
    if (parents.length > 1) {
      const node = nodeMap.get(nodeId);
      if (!node?.branch) {
        throw new Error(
          `Validation Error: Node "${nodeId}" is a merge node (multiple parents) but does not specify a 'branch' property.`,
        );
      }
    }
  }

  for (const [nodeId, children] of childMap.entries()) {
    if (children.length > 1) {
      const node = nodeMap.get(nodeId)!;
      if ((parentMap.get(nodeId) || []).length === 0 && !node.branch) {
        throw new Error(
          `Validation Error: Node "${nodeId}" is a root node that creates a branch. It must specify a 'branch' property (e.g., 'main').`,
        );
      }
      const childrenWithoutBranch = children.filter(
        (childId) => !nodeMap.get(childId)?.branch,
      );
      if (childrenWithoutBranch.length > 1) {
        throw new Error(
          `Validation Error: Node "${nodeId}" creates a branch. To avoid ambiguity, all but one of its children must have an explicit 'branch' property. Found ${childrenWithoutBranch.length} children without one.`,
        );
      }
    }
  }

  const validationInDegree = new Map(inDegree);
  const validationQueue = nodes
    .map((n) => n.id)
    .filter((id) => validationInDegree.get(id) === 0);
  const validatedNodes = [];
  while (validationQueue.length > 0) {
    const u = validationQueue.shift()!;
    validatedNodes.push(u);
    for (const v of childMap.get(u) || []) {
      validationInDegree.set(v, validationInDegree.get(v)! - 1);
      if (validationInDegree.get(v) === 0) validationQueue.push(v);
    }
  }
  if (validatedNodes.length !== nodes.length) {
    throw new Error(
      "Validation Error: The graph contains a cycle and is not a valid DAG.",
    );
  }

  const renderSortedNodes: string[] = [];
  const visited = new Set<string>();
  for (const node of nodes) {
    if (!visited.has(node.id) && inDegree.get(node.id) === 0) {
      const componentQueue = [node.id];
      visited.add(node.id);
      let head = 0;
      while (head < componentQueue.length) {
        const u = componentQueue[head++]!;
        renderSortedNodes.push(u);
        for (const v of childMap.get(u) || []) {
          if (!visited.has(v)) {
            visited.add(v);
            componentQueue.push(v);
          }
        }
      }
    }
  }
  return renderSortedNodes;
};

// --- LAYOUT CALCULATION LOGIC ---

const calculateLayout = (
  nodes: Node[],
  edges: Edge[],
  sortedNodeIds: string[],
  branchOrder?: string[],
) => {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const parentMap = new Map<string, string[]>(nodes.map((n) => [n.id, []]));
  edges.forEach((e) => parentMap.get(e.target)?.push(e.source));

  const nodeColumnMap = new Map<string, number>();
  const nodeBranchMap = new Map<string, string>();

  //  Each branch name gets a permanent column.
  const branchLaneMap = new Map<string, number>();
  let nextLane = 0;

  for (const nodeId of sortedNodeIds) {
    const node = nodeMap.get(nodeId)!;
    const parents = parentMap.get(nodeId) || [];
    let currentNodeBranch: string;

    if (node.branch) {
      currentNodeBranch = node.branch;
    } else if (parents.length === 1) {
      currentNodeBranch = nodeBranchMap.get(parents[0])!;
    } else {
      currentNodeBranch = node.id;
    }
    nodeBranchMap.set(nodeId, currentNodeBranch);

    let col: number;
    // If we've seen this branch before, use its permanent lane.
    if (branchLaneMap.has(currentNodeBranch)) {
      col = branchLaneMap.get(currentNodeBranch)!;
    } else {
      // If it's a new branch, assign it the next available lane number permanently.
      col = nextLane++;
      branchLaneMap.set(currentNodeBranch, col);
    }
    nodeColumnMap.set(nodeId, col);
  }

  // Apply custom branch order if provided
  if (branchOrder && branchOrder.length > 0) {
    const reorderedBranchLaneMap = new Map<string, number>();
    const allBranches = Array.from(branchLaneMap.keys());

    // First, place branches from the custom order
    branchOrder.forEach((branchName, index) => {
      if (branchLaneMap.has(branchName)) {
        reorderedBranchLaneMap.set(branchName, index);
      }
    });

    // Then add any branches not in the custom order
    let nextIndex = branchOrder.length;
    allBranches.forEach((branchName) => {
      if (!reorderedBranchLaneMap.has(branchName)) {
        reorderedBranchLaneMap.set(branchName, nextIndex++);
      }
    });

    // Update nodeColumnMap with new positions
    nodeColumnMap.forEach((_, nodeId) => {
      const branch = nodeBranchMap.get(nodeId)!;
      const newCol = reorderedBranchLaneMap.get(branch)!;
      nodeColumnMap.set(nodeId, newCol);
    });

    return {
      nodeColumnMap,
      nodeBranchMap,
      branchLaneMap: reorderedBranchLaneMap,
    };
  }

  return { nodeColumnMap, nodeBranchMap, branchLaneMap };
};

// --- REACT COMPONENT ---

// Branch Dots Component
const BranchDots: React.FC<{
  branchLaneMap: Map<string, number>;
  branchColorMap: Map<string, string>;
  COLUMN_WIDTH: number;
  PADDING: number;
  NODE_DIAMETER: number;
  onReorderBranches?: (newOrder: string[]) => void;
}> = ({
  branchLaneMap,
  branchColorMap,
  COLUMN_WIDTH,
  PADDING,
  NODE_DIAMETER,
  onReorderBranches,
}) => {
  const [draggedBranch, setDraggedBranch] = useState<string | null>(null);
  const [hoverBranch, setHoverBranch] = useState<string | null>(null);
  const dragStartX = useRef<number>(0);
  const dotRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (branchName: string, e: React.MouseEvent) => {
    if (!onReorderBranches) return;

    setDraggedBranch(branchName);
    dragStartX.current = e.clientX;
    e.preventDefault();
  };

  useLayoutEffect(() => {
    if (!draggedBranch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const branches = Array.from(branchLaneMap.entries()).sort(
        (a, b) => a[1] - b[1],
      );
      const currentIndex = branches.findIndex(
        ([name]) => name === draggedBranch,
      );

      if (currentIndex === -1) return;

      // Calculate which branch we're hovering over based on X position
      const deltaX = e.clientX - dragStartX.current;
      const columnOffset = Math.round(deltaX / COLUMN_WIDTH);
      const targetIndex = Math.max(
        0,
        Math.min(branches.length - 1, currentIndex + columnOffset),
      );

      if (targetIndex !== currentIndex) {
        const targetBranch = branches[targetIndex][0];
        setHoverBranch(targetBranch);
      } else {
        setHoverBranch(null);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!onReorderBranches) return;

      const branches = Array.from(branchLaneMap.entries()).sort(
        (a, b) => a[1] - b[1],
      );
      const currentIndex = branches.findIndex(
        ([name]) => name === draggedBranch,
      );

      if (currentIndex === -1) {
        setDraggedBranch(null);
        setHoverBranch(null);
        return;
      }

      // Calculate target position
      const deltaX = e.clientX - dragStartX.current;
      const columnOffset = Math.round(deltaX / COLUMN_WIDTH);
      const targetIndex = Math.max(
        0,
        Math.min(branches.length - 1, currentIndex + columnOffset),
      );

      if (targetIndex !== currentIndex) {
        // Swap the branches
        const newOrder = [...branches.map(([name]) => name)];
        [newOrder[currentIndex], newOrder[targetIndex]] = [
          newOrder[targetIndex],
          newOrder[currentIndex],
        ];
        onReorderBranches(newOrder);
      }

      setDraggedBranch(null);
      setHoverBranch(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedBranch, branchLaneMap, COLUMN_WIDTH, onReorderBranches]);

  return (
    <div className="absolute inset-0 z-20">
      {Array.from(branchLaneMap.entries()).map(([branchName, colIndex]) => {
        const xPos = colIndex * COLUMN_WIDTH + PADDING / 2 + NODE_DIAMETER / 2;
        const color = branchColorMap.get(branchName) ?? "#ccc";
        const isDragging = draggedBranch === branchName;
        const isHoverTarget = hoverBranch === branchName;

        return (
          <div
            key={`dot-${branchName}`}
            ref={isDragging ? dotRef : null}
            className="absolute top-0 h-3 w-3 rounded-full transition-all duration-200"
            style={{
              left: xPos,
              transform: `translateX(-50%) ${isDragging ? "scale(1.3)" : "scale(1)"}`,
              backgroundColor: color,
              opacity: isDragging ? 0.7 : 1,
              cursor: onReorderBranches ? "grab" : "default",
              pointerEvents: onReorderBranches ? "auto" : "none",
              boxShadow: isHoverTarget
                ? "0 0 0 3px rgba(59, 130, 246, 0.5)"
                : "none",
            }}
            onMouseDown={(e) => handleMouseDown(branchName, e)}
          />
        );
      })}
    </div>
  );
};

// Branch Names Component
const BranchNames: React.FC<{
  branchLaneMap: Map<string, number>;
  verticalLabels: boolean;
  COLUMN_WIDTH: number;
  PADDING: number;
  NODE_DIAMETER: number;
}> = ({
  branchLaneMap,
  verticalLabels,
  COLUMN_WIDTH,
  PADDING,
  NODE_DIAMETER,
}) => (
  <div className="pointer-events-none absolute top-4 right-0 left-0 z-20">
    {Array.from(branchLaneMap.entries()).map(([branchName, colIndex]) => {
      const xPos = colIndex * COLUMN_WIDTH + PADDING / 2 + NODE_DIAMETER / 2;

      return verticalLabels ? (
        <div
          key={`label-v-${branchName}`}
          className="absolute rounded-full bg-slate-100 px-2 py-0 text-xs tracking-wider text-slate-600 transition-all duration-300"
          style={{
            top: 0,
            left: xPos,
            transform: "translateX(-50%) rotate(180deg)",
            writingMode: "vertical-lr",
            whiteSpace: "nowrap",
          }}
        >
          {branchName}
        </div>
      ) : (
        <div
          key={`label-h-${branchName}`}
          className="absolute rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 transition-all duration-300"
          style={{
            left: xPos,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          {branchName}
        </div>
      );
    })}
  </div>
);

// Lane Lines Component
const LaneLines: React.FC<{
  maxCol: number;
  COLUMN_WIDTH: number;
  PADDING: number;
  NODE_DIAMETER: number;
  headerHeight: string;
}> = ({ maxCol, COLUMN_WIDTH, PADDING, NODE_DIAMETER, headerHeight }) => (
  <div
    className="pointer-events-none absolute z-[1]"
    style={{
      top: `-${headerHeight}`,
      bottom: 0,
    }}
  >
    {Array.from({ length: maxCol + 1 }).map((_, colIndex) => {
      const xPos = colIndex * COLUMN_WIDTH + PADDING / 2 + NODE_DIAMETER / 2;
      return (
        <div
          key={`lane-line-${colIndex}`}
          className="absolute top-0 bottom-0 border-l-2 border-dashed border-slate-200 transition-all duration-300"
          style={{
            left: xPos - 1,
          }}
        />
      );
    })}
  </div>
);

// Node Backgrounds Component
const NodeBackgrounds: React.FC<{
  nodeRenderIndex: Map<string, number>;
  selected: string | null;
  hovered: string | null;
  ROW_HEIGHT: number;
}> = ({ nodeRenderIndex, selected, hovered, ROW_HEIGHT }) => (
  <div className="relative z-0">
    {Array.from(nodeRenderIndex.entries()).map(([nodeId, index]) => (
      <div
        key={`bg-${nodeId}`}
        style={{
          height: ROW_HEIGHT,
          position: "absolute",
          top: index * ROW_HEIGHT,
          left: 0,
          right: 0,
        }}
        className={`pointer-events-none rounded-md transition-all duration-150 ${
          selected === nodeId
            ? "bg-blue-100"
            : hovered === nodeId
              ? "bg-gray-100"
              : ""
        }`}
      />
    ))}
  </div>
);

// Edges Component
const Edges: React.FC<{
  edgePaths: { id: string; path: string; color: string }[];
}> = ({ edgePaths }) => (
  <svg className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full">
    {edgePaths.map((edge) => (
      <path
        key={edge.id}
        d={edge.path}
        stroke={edge.color}
        strokeWidth={2.5}
        fill="none"
        style={{
          transition: "d 0.3s ease-in-out",
        }}
      />
    ))}
  </svg>
);

// Nodes Component
const Nodes: React.FC<{
  nodes: Node[];
  nodeColumnMap: Map<string, number>;
  nodeBranchMap: Map<string, string>;
  branchColorMap: Map<string, string>;
  nodeRenderIndex: Map<string, number>;
  selected: string | null;
  hovered: string | null;
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  onNodeClick: (id: string) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
  ROW_HEIGHT: number;
  COLUMN_WIDTH: number;
  PADDING: number;
  NODE_DIAMETER: number;
  LABEL_LEFT_MARGIN: number;
  graphWidth: number;
  showNodeLabels: boolean;
}> = ({
  nodes,
  nodeColumnMap,
  nodeBranchMap,
  branchColorMap,
  nodeRenderIndex,
  selected,
  hovered,
  nodeRefs,
  onNodeClick,
  onMouseEnter,
  onMouseLeave,
  ROW_HEIGHT,
  COLUMN_WIDTH,
  PADDING,
  NODE_DIAMETER,
  LABEL_LEFT_MARGIN,
  graphWidth,
  showNodeLabels,
}) => (
  <div className="relative z-20">
    {nodes.map((node) => {
      const col = nodeColumnMap.get(node.id) ?? 0;
      const branch = nodeBranchMap.get(node.id);
      const color = branch ? (branchColorMap.get(branch) ?? "#ccc") : "#ccc";
      const isSelected = selected === node.id;
      const isHovered = hovered === node.id;
      const top = (nodeRenderIndex.get(node.id) ?? 0) * ROW_HEIGHT;
      return (
        <div
          key={node.id}
          onClick={() => onNodeClick(node.id)}
          onMouseEnter={() => onMouseEnter(node.id)}
          onMouseLeave={onMouseLeave}
          style={{
            height: ROW_HEIGHT,
            position: "absolute",
            top,
            width: "100%",
          }}
          className="flex cursor-pointer items-center"
        >
          <div className="flex-shrink-0" style={{ width: graphWidth }}>
            <div
              ref={(el) => {
                if (el) nodeRefs.current.set(node.id, el);
                else nodeRefs.current.delete(node.id);
              }}
              className="relative rounded-full transition-all duration-300"
              style={{
                width: NODE_DIAMETER,
                height: NODE_DIAMETER,
                marginLeft: col * COLUMN_WIDTH + PADDING / 2,
                backgroundColor: color,
                transform: isHovered ? "scale(1.15)" : "scale(1)",
              }}
            >
              <div
                className="absolute inset-[3px] rounded-full"
                style={{ backgroundColor: "white" }}
              />
            </div>
          </div>
          {showNodeLabels && (
            <div
              style={{ marginLeft: LABEL_LEFT_MARGIN }}
              className={`text-sm ${isSelected ? "font-semibold" : ""}`}
            >
              {node.label}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export const WorkflowGraph: React.FC<GraphProps> = ({
  nodes,
  edges,
  onSelect,
  verticalLabels = true,
  config = {},
  visibility = {},
  onReorderBranches,
  branchOrder,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Merge user config with defaults
  const ROW_HEIGHT = config.rowHeight ?? 38;
  const COLUMN_WIDTH = config.columnWidth ?? 18;
  const NODE_DIAMETER = config.nodeDiameter ?? 13;
  const PADDING = config.padding ?? 20;
  const LABEL_LEFT_MARGIN = config.labelLeftMargin ?? 20;
  const CORNER_RADIUS = config.cornerRadius ?? 8;
  const COLORS = config.colors ?? [
    "#4ECDC4",
    "#FF6B6B",
    "#FED766",
    "#45B7D1",
    "#7CFFCB",
    "#F7B267",
    "#F4A261",
    "#E76F51",
  ];

  // Merge visibility settings with defaults
  const {
    showBranchDots = true,
    showBranchNames = true,
    showLaneLines = true,
    showEdges = true,
    showNodeBackgrounds = true,
    showNodeLabels = true,
  } = visibility;

  const layoutData = useMemo(() => {
    try {
      const sortedIds = validateAndSort(nodes, edges);
      const { nodeColumnMap, nodeBranchMap, branchLaneMap } = calculateLayout(
        nodes,
        edges,
        sortedIds,
        branchOrder,
      );
      const renderIndex = new Map(sortedIds.map((id, index) => [id, index]));
      const maxColumn =
        nodeColumnMap.size > 0
          ? Math.max(0, ...Array.from(nodeColumnMap.values()))
          : 0;
      const uniqueBranches = [...new Set(nodeBranchMap.values())];
      const colorMap = new Map<string, string>();
      uniqueBranches.forEach((branch, i) => {
        colorMap.set(branch, COLORS[i % COLORS.length]);
      });
      return {
        nodeColumnMap,
        nodeBranchMap,
        branchLaneMap,
        maxCol: maxColumn,
        branchColorMap: colorMap,
        nodeRenderIndex: renderIndex,
        error: null,
      };
    } catch (e: unknown) {
      console.error(e);
      return {
        nodeColumnMap: new Map(),
        nodeBranchMap: new Map(),
        maxCol: 0,
        branchColorMap: new Map(),
        branchLaneMap: new Map(),
        nodeRenderIndex: new Map(),
        error: (e as Error).message,
      };
    }
  }, [nodes, edges, branchOrder, COLORS]);

  const {
    nodeColumnMap,
    nodeBranchMap,
    maxCol,
    branchColorMap,
    nodeRenderIndex,
    branchLaneMap,
  } = layoutData;

  const layoutError = layoutData.error;

  const [edgePaths, setEdgePaths] = useState<
    { id: string; path: string; color: string }[]
  >([]);
  const [edgeUpdateTrigger, setEdgeUpdateTrigger] = useState(0);

  // Trigger edge recalculation after branch order changes
  useLayoutEffect(() => {
    if (branchOrder && branchOrder.length > 0) {
      // Wait for CSS transitions to complete (300ms) before recalculating edges
      const timer = setTimeout(() => {
        setEdgeUpdateTrigger((prev) => prev + 1);
      }, 320); // Slightly longer than the 300ms transition
      return () => clearTimeout(timer);
    }
  }, [branchOrder]);

  useLayoutEffect(() => {
    if (layoutError) return;
    const parentMap = new Map<string, string[]>();
    nodes.forEach((n) => parentMap.set(n.id, []));
    edges.forEach((e) => parentMap.get(e.target)?.push(e.source));
    const newEdgePaths: { id: string; path: string; color: string }[] = [];
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    for (const edge of edges) {
      const sourceEl = nodeRefs.current.get(edge.source);
      const targetEl = nodeRefs.current.get(edge.target);
      if (!sourceEl || !targetEl) continue;
      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const x1 = sourceRect.left - containerRect.left + sourceRect.width / 2;
      const y1 = sourceRect.top - containerRect.top + sourceRect.height / 2;
      const x2 = targetRect.left - containerRect.left + targetRect.width / 2;
      const y2 = targetRect.top - containerRect.top + targetRect.height / 2;

      const dx = x2 - x1;
      const dy = y2 - y1;
      const cornerRadius = CORNER_RADIUS;
      let path: string;
      if (dx === 0) {
        path = `M ${x1} ${y1} L ${x2} ${y2}`;
      } else if (dy === 0) {
        path = `M ${x1} ${y1} L ${x2} ${y2}`;
      } else {
        const horizontalDir = Math.sign(dx);
        const verticalDir = Math.sign(dy);
        const isMergeEdge = (parentMap.get(edge.target) || []).length > 1;
        if (isMergeEdge) {
          const cornerY = y2 - verticalDir * cornerRadius;
          const cornerX = x1 + horizontalDir * cornerRadius;
          path = `M ${x1} ${y1} L ${x1} ${cornerY} Q ${x1} ${y2}, ${cornerX} ${y2} L ${x2} ${y2}`;
        } else {
          const cornerX = x2 - horizontalDir * cornerRadius;
          const cornerY = y1 + verticalDir * cornerRadius;
          path = `M ${x1} ${y1} L ${cornerX} ${y1} Q ${x2} ${y1}, ${x2} ${cornerY} L ${x2} ${y2}`;
        }
      }

      const sourceBranch = nodeBranchMap.get(edge.source)!;
      const targetBranch = nodeBranchMap.get(edge.target)!;
      const isMergeEdge = (parentMap.get(edge.target) || []).length > 1;
      let edgeBranch: string;
      if (isMergeEdge) {
        edgeBranch = sourceBranch;
      } else {
        edgeBranch = targetBranch;
      }
      const color = branchColorMap.get(edgeBranch) ?? "#ccc";
      newEdgePaths.push({ id: edge.id, path, color });
    }
    setEdgePaths(newEdgePaths);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    edges,
    nodes,
    layoutError,
    CORNER_RADIUS,
    branchOrder, // Use branchOrder as a stable dependency instead of the Maps
    edgeUpdateTrigger, // Trigger recalculation after animations complete
  ]);

  if (layoutError) {
    return (
      <div className="rounded-md border border-red-400 bg-red-100 p-4 text-red-700">
        <h3 className="font-bold">Graph Layout Error</h3>
        <p>{layoutError}</p>
      </div>
    );
  }

  const graphWidth = (maxCol + 1) * COLUMN_WIDTH + PADDING;

  // Calculate header height
  let calculatedHeaderHeight: string;
  if (config.headerHeight) {
    calculatedHeaderHeight = config.headerHeight;
  } else if (showBranchDots || showBranchNames) {
    if (verticalLabels && showBranchNames) {
      // For vertical labels, calculate based on longest branch name
      const maxBranchNameLength = Math.max(
        ...Array.from(branchLaneMap.keys()).map((name) => name.length),
      );
      // Approximate: each character is ~8px wide, plus padding
      const estimatedHeight = Math.max(maxBranchNameLength * 8 + 32, 48);
      calculatedHeaderHeight = `${estimatedHeight}px`;
    } else {
      // For horizontal labels or just dots, use fixed height
      if (showBranchNames) calculatedHeaderHeight = "96px";
      else calculatedHeaderHeight = "12px";
    }
  } else {
    calculatedHeaderHeight = "0px";
  }

  const contentHeight = nodes.length * ROW_HEIGHT;
  const totalHeight = `calc(${calculatedHeaderHeight} + ${contentHeight}px)`;

  // Calculate total width based on whether labels are shown
  const totalWidth = showNodeLabels ? graphWidth + 200 : graphWidth;

  return (
    <div
      className="relative font-sans"
      style={{
        height: totalHeight,
        width: totalWidth,
      }}
    >
      {/* Header container for branch dots and names */}
      {(showBranchDots || showBranchNames) && (
        <div
          className="relative w-full"
          style={{ height: calculatedHeaderHeight }}
        >
          {showBranchDots && (
            <BranchDots
              branchLaneMap={branchLaneMap}
              branchColorMap={branchColorMap}
              COLUMN_WIDTH={COLUMN_WIDTH}
              PADDING={PADDING}
              NODE_DIAMETER={NODE_DIAMETER}
              onReorderBranches={onReorderBranches}
            />
          )}
          {showBranchNames && (
            <BranchNames
              branchLaneMap={branchLaneMap}
              verticalLabels={verticalLabels}
              COLUMN_WIDTH={COLUMN_WIDTH}
              PADDING={PADDING}
              NODE_DIAMETER={NODE_DIAMETER}
            />
          )}
        </div>
      )}

      {/* Content container - positioned below header */}
      <div
        className="relative"
        ref={containerRef}
        style={{ height: contentHeight }}
      >
        {showLaneLines && (
          <LaneLines
            maxCol={maxCol}
            COLUMN_WIDTH={COLUMN_WIDTH}
            PADDING={PADDING}
            NODE_DIAMETER={NODE_DIAMETER}
            headerHeight={calculatedHeaderHeight}
          />
        )}

        {showNodeBackgrounds && (
          <NodeBackgrounds
            nodeRenderIndex={nodeRenderIndex}
            selected={selected}
            hovered={hovered}
            ROW_HEIGHT={ROW_HEIGHT}
          />
        )}

        {showEdges && <Edges edgePaths={edgePaths} />}

        <Nodes
          nodes={nodes}
          nodeColumnMap={nodeColumnMap}
          nodeBranchMap={nodeBranchMap}
          branchColorMap={branchColorMap}
          nodeRenderIndex={nodeRenderIndex}
          selected={selected}
          hovered={hovered}
          nodeRefs={nodeRefs}
          onNodeClick={(id) => {
            setSelected(id);
            onSelect?.(id);
          }}
          onMouseEnter={setHovered}
          onMouseLeave={() => setHovered(null)}
          ROW_HEIGHT={ROW_HEIGHT}
          COLUMN_WIDTH={COLUMN_WIDTH}
          PADDING={PADDING}
          NODE_DIAMETER={NODE_DIAMETER}
          LABEL_LEFT_MARGIN={LABEL_LEFT_MARGIN}
          graphWidth={graphWidth}
          showNodeLabels={showNodeLabels}
        />
      </div>
    </div>
  );
};
