"use client";
import React, { useMemo, useState, useLayoutEffect, useRef } from "react";
import { buildGraphMaps, calculateLayout } from "./layout";
import { detectCycles, topologicalSort } from "./algorithm";
import { Edge, GraphClassNames, GraphNode, GraphProps, GraphVisibility, LayoutData, NodePosition, ResolvedGraphConfig } from "./types";

type EdgePath = {
  id: string;
  path: string;
  color: string;
};
const DEFAULT_CONFIG = {
  rowHeight: 38,
  columnWidth: 18,
  nodeDiameter: 13,
  padding: 20,
  labelLeftMargin: 20,
  cornerRadius: 8,
  colors: [
    "#4ECDC4",
    "#FF6B6B",
    "#FED766",
    "#45B7D1",
    "#7CFFCB",
    "#F7B267",
    "#F4A261",
    "#E76F51",
  ],
};

const DEFAULT_VISIBILITY = {
  showBranchDots: true,
  showBranchNames: true,
  showLaneLines: true,
  showEdges: true,
  showNodeBackgrounds: true,
  showNodeLabels: true,
};

const DEFAULT_CLASSNAMES = {
  container: "relative font-sans",
  nodeLabel: "text-sm",
  nodeLabelSelected: "font-semibold",
  nodeBackground: "pointer-events-none rounded-md transition-all duration-150",
  nodeBackgroundSelected: "bg-blue-100",
  nodeBackgroundHovered: "bg-gray-100",
  branchLabel:
    "absolute rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 transition-all duration-300",
  laneLine:
    "absolute top-0 bottom-0 border-l-2 border-dashed border-slate-200 transition-all duration-300",
};

function validateGraph(
  nodeMap: Map<string, GraphNode>,
  parentMap: Map<string, string[]>,
  childMap: Map<string, string[]>
): void {
  for (const [nodeId, parents] of parentMap.entries()) {
    if (parents.length > 1 && !nodeMap.get(nodeId)?.branch) {
      throw new Error(
        `Node "${nodeId}" is a merge node but lacks a 'branch' property.`
      );
    }
  }

  for (const [nodeId, children] of childMap.entries()) {
    if (children.length > 1) {
      const node = nodeMap.get(nodeId)!;
      const isRoot = (parentMap.get(nodeId) || []).length === 0;

      if (isRoot && !node.branch) {
        throw new Error(
          `Node "${nodeId}" is a root branch point and must have a 'branch' property.`
        );
      }

      const childrenWithoutBranch = children.filter(
        (childId) => !nodeMap.get(childId)?.branch
      );

      if (childrenWithoutBranch.length > 1) {
        throw new Error(
          `Node "${nodeId}" creates a branch. All but one child must have an explicit 'branch' property.`
        );
      }
    }
  }
}

function validateAndSort(nodes: GraphNode[], edges: Edge[]): string[] {
  if (nodes.length === 0) return [];

  const { nodeMap, parentMap, childMap, inDegree } = buildGraphMaps(
    nodes,
    edges
  );

  validateGraph(nodeMap, parentMap, childMap);

  if (detectCycles(nodes, childMap, inDegree)) {
    throw new Error("Graph contains a cycle and is not a valid DAG.");
  }

  return topologicalSort(nodes, childMap, inDegree);
}

function calculateEdgePath(
  source: NodePosition,
  target: NodePosition,
  cornerRadius: number,
  isMergeEdge: boolean
): string {
  const { x: x1, y: y1 } = source;
  const { x: x2, y: y2 } = target;
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 || dy === 0) {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  const horizontalDir = Math.sign(dx);
  const verticalDir = Math.sign(dy);

  if (isMergeEdge) {
    const cornerY = y2 - verticalDir * cornerRadius;
    const cornerX = x1 + horizontalDir * cornerRadius;
    return `M ${x1} ${y1} L ${x1} ${cornerY} Q ${x1} ${y2}, ${cornerX} ${y2} L ${x2} ${y2}`;
  } else {
    const cornerX = x2 - horizontalDir * cornerRadius;
    const cornerY = y1 + verticalDir * cornerRadius;
    return `M ${x1} ${y1} L ${cornerX} ${y1} Q ${x2} ${y1}, ${x2} ${cornerY} L ${x2} ${y2}`;
  }
}

function getNodePosition(
  element: HTMLDivElement,
  containerRect: DOMRect
): NodePosition {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left - containerRect.left + rect.width / 2,
    y: rect.top - containerRect.top + rect.height / 2,
  };
}

function calculateEdgePaths(
  edges: Edge[],
  nodeRefs: Map<string, HTMLDivElement>,
  containerRect: DOMRect | undefined,
  nodeBranchMap: Map<string, string>,
  branchColorMap: Map<string, string>,
  parentMap: Map<string, string[]>,
  cornerRadius: number
): EdgePath[] {
  if (!containerRect) return [];

  return edges.map((edge) => {
    const sourceEl = nodeRefs.get(edge.source);
    const targetEl = nodeRefs.get(edge.target);

    if (!sourceEl || !targetEl) {
      return { id: edge.id, path: "", color: "#ccc" };
    }

    const source = getNodePosition(sourceEl, containerRect);
    const target = getNodePosition(targetEl, containerRect);
    const isMergeEdge = (parentMap.get(edge.target) || []).length > 1;
    const path = calculateEdgePath(source, target, cornerRadius, isMergeEdge);

    const sourceBranch = nodeBranchMap.get(edge.source)!;
    const targetBranch = nodeBranchMap.get(edge.target)!;
    const edgeBranch = isMergeEdge ? sourceBranch : targetBranch;
    const color = branchColorMap.get(edgeBranch) ?? "#ccc";

    return { id: edge.id, path, color };
  });
}

function getLaneXPosition(
  columnIndex: number,
  config: ResolvedGraphConfig
): number {
  return (
    columnIndex * config.columnWidth +
    config.padding / 2 +
    config.nodeDiameter / 2
  );
}

const BranchDots: React.FC<{
  branchLaneMap: Map<string, number>;
  branchColorMap: Map<string, string>;
  config: ResolvedGraphConfig;
  onReorderBranches?: (newOrder: string[]) => void;
}> = ({ branchLaneMap, branchColorMap, config, onReorderBranches }) => {
  const [draggedBranch, setDraggedBranch] = useState<string | null>(null);
  const [hoverBranch, setHoverBranch] = useState<string | null>(null);
  const dragStartX = useRef<number>(0);

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
        (a, b) => a[1] - b[1]
      );
      const currentIndex = branches.findIndex(
        ([name]) => name === draggedBranch
      );
      if (currentIndex === -1) return;

      const deltaX = e.clientX - dragStartX.current;
      const columnOffset = Math.round(deltaX / config.columnWidth);
      const targetIndex = Math.max(
        0,
        Math.min(branches.length - 1, currentIndex + columnOffset)
      );

      setHoverBranch(
        targetIndex !== currentIndex ? branches[targetIndex][0] : null
      );
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!onReorderBranches) return;

      const branches = Array.from(branchLaneMap.entries()).sort(
        (a, b) => a[1] - b[1]
      );
      const currentIndex = branches.findIndex(
        ([name]) => name === draggedBranch
      );
      if (currentIndex === -1) {
        setDraggedBranch(null);
        setHoverBranch(null);
        return;
      }

      const deltaX = e.clientX - dragStartX.current;
      const columnOffset = Math.round(deltaX / config.columnWidth);
      const targetIndex = Math.max(
        0,
        Math.min(branches.length - 1, currentIndex + columnOffset)
      );

      if (targetIndex !== currentIndex) {
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
  }, [draggedBranch, branchLaneMap, config.columnWidth, onReorderBranches]);

  return (
    <div className="absolute inset-0 z-20">
      {Array.from(branchLaneMap.entries()).map(([branchName, colIndex]) => {
        const xPos = getLaneXPosition(colIndex, config);
        const color = branchColorMap.get(branchName) ?? "#ccc";
        const isDragging = draggedBranch === branchName;
        const isHoverTarget = hoverBranch === branchName;

        return (
          <div
            key={`dot-${branchName}`}
            className="absolute top-0 h-3 w-3 rounded-full transition-all duration-200"
            style={{
              left: xPos,
              transform: `translateX(-50%) ${
                isDragging ? "scale(1.3)" : "scale(1)"
              }`,
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

const BranchNames: React.FC<{
  branchLaneMap: Map<string, number>;
  verticalLabels: boolean;
  config: ResolvedGraphConfig;
  className: string;
}> = ({ branchLaneMap, verticalLabels, config, className }) => (
  <div className="pointer-events-none absolute top-4 right-0 left-0 z-20">
    {Array.from(branchLaneMap.entries()).map(([branchName, colIndex]) => {
      const xPos = getLaneXPosition(colIndex, config);

      const baseStyle = {
        left: xPos,
        transform: "translateX(-50%)",
        whiteSpace: "nowrap" as const,
      };

      if (verticalLabels) {
        return (
          <div
            key={`label-v-${branchName}`}
            className={className}
            style={{
              ...baseStyle,
              top: 0,
              transform: "translateX(-50%) rotate(180deg)",
              writingMode: "vertical-lr" as const,
            }}
          >
            {branchName}
          </div>
        );
      }

      return (
        <div
          key={`label-h-${branchName}`}
          className={className}
          style={baseStyle}
        >
          {branchName}
        </div>
      );
    })}
  </div>
);

const LaneLines: React.FC<{
  maxCol: number;
  config: ResolvedGraphConfig;
  className: string;
  headerHeight: string;
}> = ({ maxCol, config, className, headerHeight }) => (
  <div
    className="pointer-events-none absolute z-[1]"
    style={{ top: `-${headerHeight ? headerHeight : 0}`, bottom: 0 }}
  >
    {Array.from({ length: maxCol + 1 }).map((_, colIndex) => {
      const xPos = getLaneXPosition(colIndex, config);
      return (
        <div
          key={`lane-${colIndex}`}
          className={className}
          style={{ left: xPos - 1 }}
        />
      );
    })}
  </div>
);

const NodeBackgrounds: React.FC<{
  nodeRenderIndex: Map<string, number>;
  selected: string | null;
  hovered: string | null;
  rowHeight: number;
  classNames: Required<GraphClassNames>;
}> = ({ nodeRenderIndex, selected, hovered, rowHeight, classNames }) => (
  <div className="relative z-0">
    {Array.from(nodeRenderIndex.entries()).map(([nodeId, index]) => (
      <div
        key={`bg-${nodeId}`}
        className={`${classNames.nodeBackground} ${
          selected === nodeId
            ? classNames.nodeBackgroundSelected
            : hovered === nodeId
            ? classNames.nodeBackgroundHovered
            : ""
        }`}
        style={{
          height: rowHeight,
          position: "absolute",
          top: index * rowHeight,
          left: 0,
          right: 0,
        }}
      />
    ))}
  </div>
);

const Edges: React.FC<{
  edgePaths: EdgePath[];
}> = ({ edgePaths }) => (
  <svg className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full">
    {edgePaths.map((edge) => (
      <path
        key={edge.id}
        d={edge.path}
        stroke={edge.color}
        strokeWidth={2.5}
        fill="none"
        style={{ transition: "d 0.3s ease-in-out" }}
      />
    ))}
  </svg>
);

const NodeCircle: React.FC<{
  nodeId: string;
  color: string;
  columnIndex: number;
  isHovered: boolean;
  config: ResolvedGraphConfig;
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
}> = ({ nodeId, color, columnIndex, isHovered, config, nodeRefs }) => (
  <div
    ref={(el) => {
      if (el) nodeRefs.current.set(nodeId, el);
      else nodeRefs.current.delete(nodeId);
    }}
    className="relative rounded-full transition-all duration-300"
    style={{
      width: config.nodeDiameter,
      height: config.nodeDiameter,
      marginLeft: columnIndex * config.columnWidth + config.padding / 2,
      backgroundColor: color,
      transform: isHovered ? "scale(1.15)" : "scale(1)",
    }}
  >
    <div
      className="absolute inset-[3px] rounded-full"
      style={{ backgroundColor: "white" }}
    />
  </div>
);

// ============================================================================
// COMPONENT: Nodes
// ============================================================================

const Nodes: React.FC<{
  nodes: GraphNode[];
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
  config: ResolvedGraphConfig;
  classNames: Required<GraphClassNames>;
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
  config,
  classNames,
  graphWidth,
  showNodeLabels,
}) => (
  <div className="relative z-20">
    {nodes.map((node) => {
      const col = nodeColumnMap.get(node.id) ?? 0;
      const branch = nodeBranchMap.get(node.id);
      const color = branch ? branchColorMap.get(branch) ?? "#ccc" : "#ccc";
      const isSelected = selected === node.id;
      const isHovered = hovered === node.id;
      const top = (nodeRenderIndex.get(node.id) ?? 0) * config.rowHeight;

      return (
        <div
          key={node.id}
          onClick={() => onNodeClick(node.id)}
          onMouseEnter={() => onMouseEnter(node.id)}
          onMouseLeave={onMouseLeave}
          style={{
            height: config.rowHeight,
            position: "absolute",
            top,
            width: "100%",
          }}
          className="flex cursor-pointer items-center"
        >
          <div className="flex-shrink-0" style={{ width: graphWidth }}>
            <NodeCircle
              nodeId={node.id}
              color={color}
              columnIndex={col}
              isHovered={isHovered}
              config={config}
              nodeRefs={nodeRefs}
            />
          </div>
          {showNodeLabels && (
            <div
              style={{ marginLeft: config.labelLeftMargin }}
              className={`${classNames.nodeLabel} ${
                isSelected ? classNames.nodeLabelSelected : ""
              }`}
            >
              {node.label}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

const GraphHeader: React.FC<{
  branchLaneMap: Map<string, number>;
  branchColorMap: Map<string, string>;
  config: ResolvedGraphConfig;
  classNames: Required<GraphClassNames>;
  headerHeight: string;
  verticalLabels: boolean;
  showBranchDots: boolean;
  showBranchNames: boolean;
  onReorderBranches?: (newOrder: string[]) => void;
}> = ({
  branchLaneMap,
  branchColorMap,
  config,
  classNames,
  headerHeight,
  verticalLabels,
  showBranchDots,
  showBranchNames,
  onReorderBranches,
}) => (
  <div className="relative w-full" style={{ height: headerHeight }}>
    {showBranchDots && (
      <BranchDots
        branchLaneMap={branchLaneMap}
        branchColorMap={branchColorMap}
        config={config}
        onReorderBranches={onReorderBranches}
      />
    )}
    {showBranchNames && (
      <BranchNames
        branchLaneMap={branchLaneMap}
        verticalLabels={verticalLabels}
        config={config}
        className={classNames.branchLabel}
      />
    )}
  </div>
);

const GraphContent: React.FC<{
  nodes: GraphNode[];
  edges: Edge[];
  layoutData: Omit<LayoutData, "error">;
  edgePaths: EdgePath[];
  selected: string | null;
  hovered: string | null;
  onNodeClick: (id: string) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  config: ResolvedGraphConfig;
  classNames: Required<GraphClassNames>;
  visibility: Required<GraphVisibility>;
  headerHeight: string;
  graphWidth: number;
  contentHeight: number;
}> = ({
  nodes,
  layoutData,
  edgePaths,
  selected,
  hovered,
  onNodeClick,
  onMouseEnter,
  onMouseLeave,
  nodeRefs,
  containerRef,
  config,
  classNames,
  visibility,
  headerHeight,
  graphWidth,
  contentHeight,
}) => (
  <div
    className="relative"
    ref={containerRef}
    style={{ height: contentHeight }}
  >
    {visibility.showLaneLines && (
      <LaneLines
        maxCol={layoutData.maxCol}
        config={config}
        className={classNames.laneLine}
        headerHeight={headerHeight}
      />
    )}

    {visibility.showNodeBackgrounds && (
      <NodeBackgrounds
        nodeRenderIndex={layoutData.nodeRenderIndex}
        selected={selected}
        hovered={hovered}
        rowHeight={config.rowHeight}
        classNames={classNames}
      />
    )}

    {visibility.showEdges && <Edges edgePaths={edgePaths} />}

    <Nodes
      nodes={nodes}
      nodeColumnMap={layoutData.nodeColumnMap}
      nodeBranchMap={layoutData.nodeBranchMap}
      branchColorMap={layoutData.branchColorMap}
      nodeRenderIndex={layoutData.nodeRenderIndex}
      selected={selected}
      hovered={hovered}
      nodeRefs={nodeRefs}
      onNodeClick={onNodeClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      config={config}
      classNames={classNames}
      graphWidth={graphWidth}
      showNodeLabels={visibility.showNodeLabels}
    />
  </div>
);

export const WorkflowGraph: React.FC<GraphProps> = ({
  nodes,
  edges,
  onSelect,
  verticalLabels = true,
  config: config_,
  visibility: visibility_,
  classNames: classNames_,
  onReorderBranches: onReorderBranches_,
  branchOrder: branchOrder_,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [edgePaths, setEdgePaths] = useState<EdgePath[]>([]);
  const [edgeUpdateTrigger, setEdgeUpdateTrigger] = useState(0);

  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const config = { ...DEFAULT_CONFIG, ...config_ };
  const visibility = { ...DEFAULT_VISIBILITY, ...visibility_ };
  const classNames = { ...DEFAULT_CLASSNAMES, ...classNames_ };

  const showBranchDots = visibility.showBranchDots;
  const showBranchNames = visibility.showBranchNames;
  const onReorderBranches = onReorderBranches_;

  const layoutData = useMemo((): LayoutData => {
    try {
      const sortedIds = validateAndSort(nodes, edges);
      const layout = calculateLayout(
        nodes,
        edges,
        sortedIds,
        DEFAULT_CONFIG.colors,
        branchOrder_
      );
      return { ...layout, error: null };
    } catch (e: unknown) {
      console.error(e);
      return {
        nodeColumnMap: new Map(),
        nodeBranchMap: new Map(),
        branchLaneMap: new Map(),
        maxCol: 0,
        branchColorMap: new Map(),
        nodeRenderIndex: new Map(),
        error: (e as Error).message,
      };
    }
  }, [nodes, edges, branchOrder_]);

  // Trigger edge recalculation after branch order changes
  useLayoutEffect(() => {
    if (branchOrder_ && branchOrder_.length > 0) {
      const timer = setTimeout(
        () => setEdgeUpdateTrigger((prev) => prev + 1),
        320
      );
      return () => clearTimeout(timer);
    }
  }, [branchOrder_]);

  useLayoutEffect(() => {
    if (layoutData.error) return;

    const { parentMap } = buildGraphMaps(nodes, edges);
    const containerRect = containerRef.current?.getBoundingClientRect();

    const paths = calculateEdgePaths(
      edges,
      nodeRefs.current,
      containerRect,
      layoutData.nodeBranchMap,
      layoutData.branchColorMap,
      parentMap,
      config.cornerRadius
    );

    setEdgePaths(paths);
  }, [edges, nodes, layoutData, config.cornerRadius, edgeUpdateTrigger]);

  if (layoutData.error) {
    return (
      <div className="rounded-md border border-red-400 bg-red-100 p-4 text-red-700">
        <h3 className="font-bold">Graph Layout Error</h3>
        <p>{layoutData.error}</p>
      </div>
    );
  }

  const graphWidth =
    (layoutData.maxCol + 1) * config.columnWidth + config.padding;
  const contentHeight = nodes.length * config.rowHeight;

  const computeHeaderHeight = () => {
    if (!showBranchDots && !showBranchNames) return "0px";
    if (!showBranchNames) return "12px";
    if (!verticalLabels) return "36px";
    const maxNameLength = Math.max(
      ...Array.from(layoutData.branchLaneMap.keys(), (n) => n.length)
    );
    return `${Math.max(maxNameLength * 8 + 16, 48)}px`;
  };

  const headerHeight = config.headerHeight ?? computeHeaderHeight();

  const totalWidth = visibility.showNodeLabels ? graphWidth + 200 : graphWidth;

  const handleNodeClick = (id: string) => {
    setSelected(id);
    onSelect?.(id);
  };

  return (
    <div
      className={classNames.container}
      style={{
        height: `calc(${headerHeight} + ${contentHeight}px)`,
        width: totalWidth,
      }}
    >
      {(showBranchDots || showBranchNames) && (
        <GraphHeader
          branchLaneMap={layoutData.branchLaneMap}
          branchColorMap={layoutData.branchColorMap}
          config={config}
          classNames={classNames}
          headerHeight={headerHeight}
          verticalLabels={verticalLabels}
          showBranchDots={showBranchDots}
          showBranchNames={showBranchNames}
          onReorderBranches={onReorderBranches}
        />
      )}

      <GraphContent
        nodes={nodes}
        edges={edges}
        layoutData={layoutData}
        edgePaths={edgePaths}
        selected={selected}
        hovered={hovered}
        onNodeClick={handleNodeClick}
        onMouseEnter={setHovered}
        onMouseLeave={() => setHovered(null)}
        nodeRefs={nodeRefs}
        containerRef={containerRef}
        config={config}
        classNames={classNames}
        visibility={visibility}
        headerHeight={headerHeight}
        graphWidth={graphWidth}
        contentHeight={contentHeight}
      />
    </div>
  );
};
