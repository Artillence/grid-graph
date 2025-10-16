"use client";
import React, { useState, useRef, ReactNode } from "react";
import { GraphProps, LayoutData } from "./types";
import { DEFAULT_CONFIG } from "./constants";
import { computeHeaderHeight } from "./utils";
import { useGraphLayout, useEdgePaths } from "./hooks";
import { buildGraphMaps } from "./layout";
import {
  BranchDots as PrimitiveBranchDots,
  BranchNames as PrimitiveBranchNames,
  LaneLines as PrimitiveLaneLines,
  RowBackgrounds as PrimitiveRowBackgrounds,
  Edges as PrimitiveEdges,
  Nodes as PrimitiveNodes,
} from "./components/GraphPrimitives";

type GridGraphContextValue = {
  layoutData: LayoutData;
  edgePaths: { id: string; path: string; color: string }[];
  selected: string | null;
  hovered: string | null;
  setSelected: (id: string | null) => void;
  setHovered: (id: string | null) => void;
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  config: typeof DEFAULT_CONFIG;
  verticalLabels: boolean;
  graphWidth: number;
  contentHeight: number;
  headerHeight: string;
  onNodeClick: (id: string) => void;
  onReorderBranches?: (newOrder: string[]) => void;
  nodes: GraphProps["nodes"];
  edges: GraphProps["edges"];
};

const GridGraphContext = React.createContext<GridGraphContextValue | null>(
  null,
);

const useGridGraphContext = () => {
  const context = React.useContext(GridGraphContext);
  if (!context) {
    throw new Error(
      "GridGraph compound components must be used within GridGraph",
    );
  }
  return context;
};

type GridGraphProps = GraphProps & {
  children?: React.ReactNode;
};

const GridGraphRoot: React.FC<GridGraphProps> = ({
  nodes,
  edges,
  onSelect,
  verticalLabels = true,
  config: config_,
  className,
  onReorderBranches: onReorderBranches_,
  branchOrder: branchOrder_,
  children,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const config = {
    ...DEFAULT_CONFIG,
    ...config_,
    colors: config_?.colors ?? DEFAULT_CONFIG.colors,
  };

  const layoutData = useGraphLayout(
    nodes,
    edges,
    branchOrder_,
    config.colors ?? DEFAULT_CONFIG.colors,
  );

  const { parentMap } = buildGraphMaps(nodes, edges);
  const edgePaths = useEdgePaths(edges, nodes, layoutData, parentMap, config);

  if (layoutData.error) {
    throw new Error(`Graph Layout Error: ${layoutData.error}`);
  }

  const graphWidth =
    (layoutData.maxCol + 1) * config.columnWidth + config.padding;
  const contentHeight = nodes.length * config.rowHeight;

  // Default to showing header if children includes Header
  const hasHeader = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) &&
      (child.type === Header ||
        (child.type as any)?.displayName === "GridGraph.Header"),
  );

  const headerHeight =
    config.headerHeight ??
    computeHeaderHeight(
      hasHeader,
      hasHeader,
      verticalLabels,
      layoutData.branchLaneMap,
    );

  // Calculate if we need extra width for labels by checking if Nodes component shows labels
  const totalWidth = graphWidth + 200; // Conservative default

  const handleNodeClick = (id: string) => {
    setSelected(id);
    onSelect?.(id);
  };

  const contextValue: GridGraphContextValue = {
    layoutData,
    edgePaths,
    selected,
    hovered,
    setSelected,
    setHovered,
    nodeRefs,
    containerRef,
    config,
    verticalLabels,
    graphWidth,
    contentHeight,
    headerHeight,
    onNodeClick: handleNodeClick,
    onReorderBranches: onReorderBranches_,
    nodes,
    edges,
  };

  return (
    <GridGraphContext.Provider value={contextValue}>
      <div
        className={className || "gg__container"}
        style={{
          height: `calc(${headerHeight} + ${contentHeight}px)`,
          width: totalWidth,
        }}
      >
        {children}
      </div>
    </GridGraphContext.Provider>
  );
};

// Header Component - renders children
const Header: React.FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const { headerHeight } = useGridGraphContext();

  return (
    <div className={className || "gg__header"} style={{ height: headerHeight }}>
      {children}
    </div>
  );
};

Header.displayName = "GridGraph.Header";

// Content Component - renders children
const Content: React.FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const { contentHeight, containerRef } = useGridGraphContext();

  return (
    <div
      className={className || "gg__content"}
      ref={containerRef}
      style={{ height: contentHeight }}
    >
      {children}
    </div>
  );
};

Content.displayName = "GridGraph.Content";

// Primitive components wrapped to use context
const BranchDots: React.FC<{ className?: string }> = ({ className }) => {
  const { layoutData, config, onReorderBranches } = useGridGraphContext();

  return (
    <PrimitiveBranchDots
      branchLaneMap={layoutData.branchLaneMap}
      branchColorMap={layoutData.branchColorMap}
      config={config}
      onReorderBranches={onReorderBranches}
      className={className}
    />
  );
};

BranchDots.displayName = "GridGraph.BranchDots";

const BranchNames: React.FC<{ className?: string }> = ({ className }) => {
  const { layoutData, config, verticalLabels } = useGridGraphContext();

  return (
    <PrimitiveBranchNames
      branchLaneMap={layoutData.branchLaneMap}
      verticalLabels={verticalLabels}
      config={config}
      className={className}
    />
  );
};

BranchNames.displayName = "GridGraph.BranchNames";

const LaneLines: React.FC<{ className?: string }> = ({ className }) => {
  const { layoutData, config, headerHeight } = useGridGraphContext();

  return (
    <PrimitiveLaneLines
      maxCol={layoutData.maxCol}
      config={config}
      headerHeight={headerHeight}
      className={className}
    />
  );
};

LaneLines.displayName = "GridGraph.LaneLines";

const RowBackgrounds: React.FC<{
  className?: string;
  selectedClassName?: string;
  hoveredClassName?: string;
}> = ({ className, selectedClassName, hoveredClassName }) => {
  const { layoutData, selected, hovered, config } = useGridGraphContext();

  return (
    <PrimitiveRowBackgrounds
      nodeRenderIndex={layoutData.nodeRenderIndex}
      selected={selected}
      hovered={hovered}
      rowHeight={config.rowHeight}
      className={className}
      selectedClassName={selectedClassName}
      hoveredClassName={hoveredClassName}
    />
  );
};

RowBackgrounds.displayName = "GridGraph.RowBackgrounds";

const Edges: React.FC<{
  className?: string;
  pathClassName?: string;
}> = ({ className, pathClassName }) => {
  const { edgePaths } = useGridGraphContext();

  return (
    <PrimitiveEdges
      edgePaths={edgePaths}
      className={className}
      pathClassName={pathClassName}
    />
  );
};

Edges.displayName = "GridGraph.Edges";

const Nodes: React.FC<{
  showLabels?: boolean;
  labelClassName?: string;
  selectedLabelClassName?: string;
}> = ({ showLabels = true, labelClassName, selectedLabelClassName }) => {
  const {
    nodes,
    layoutData,
    selected,
    hovered,
    nodeRefs,
    onNodeClick,
    setHovered,
    config,
    graphWidth,
  } = useGridGraphContext();

  return (
    <PrimitiveNodes
      nodes={nodes}
      nodeColumnMap={layoutData.nodeColumnMap}
      nodeBranchMap={layoutData.nodeBranchMap}
      branchColorMap={layoutData.branchColorMap}
      nodeRenderIndex={layoutData.nodeRenderIndex}
      selected={selected}
      hovered={hovered}
      nodeRefs={nodeRefs}
      onNodeClick={onNodeClick}
      onMouseEnter={setHovered}
      onMouseLeave={() => setHovered(null)}
      config={config}
      graphWidth={graphWidth}
      showLabels={showLabels}
      labelClassName={labelClassName}
      selectedLabelClassName={selectedLabelClassName}
    />
  );
};

Nodes.displayName = "GridGraph.Nodes";

export const GridGraph = Object.assign(GridGraphRoot, {
  Header,
  Content,
  BranchDots,
  BranchNames,
  LaneLines,
  RowBackgrounds,
  Edges,
  Nodes,
});
