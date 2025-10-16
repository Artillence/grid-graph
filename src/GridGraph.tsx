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

  // Check what's actually in the Header
  let showBranchDots = false;
  let showBranchNames = false;
  
  const headerChild = React.Children.toArray(children).find(
    (child) =>
      React.isValidElement(child) &&
      ((child.type as any)?.displayName === "GridGraph.Header"),
  );

  if (headerChild && React.isValidElement(headerChild) && headerChild.props) {
    const headerChildren = React.Children.toArray((headerChild.props as any).children);
    showBranchDots = headerChildren.some(
      (child) =>
        React.isValidElement(child) &&
        (child.type as any)?.displayName === "GridGraph.BranchDots",
    );
    showBranchNames = headerChildren.some(
      (child) =>
        React.isValidElement(child) &&
        (child.type as any)?.displayName === "GridGraph.BranchNames",
    );
  }

  const headerHeight =
    config.headerHeight ??
    computeHeaderHeight(
      showBranchDots,
      showBranchNames,
      verticalLabels,
      layoutData.branchLaneMap,
    );

  // Validate component placement
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const displayName = (child.type as any)?.displayName;
      // Content-only components should not be in root or header
      if (
        displayName === "GridGraph.LaneLines" ||
        displayName === "GridGraph.RowBackgrounds" ||
        displayName === "GridGraph.Edges" ||
        displayName === "GridGraph.Nodes"
      ) {
        throw new Error(
          `${displayName} must be placed inside <GridGraph.Content>, not directly in <GridGraph>`,
        );
      }
      // Check Header children
      if (displayName === "GridGraph.Header" && (child.props as any)?.children) {
        React.Children.forEach((child.props as any).children, (headerChild: React.ReactNode) => {
          if (React.isValidElement(headerChild)) {
            const headerChildName = (headerChild.type as any)?.displayName;
            if (
              headerChildName === "GridGraph.LaneLines" ||
              headerChildName === "GridGraph.RowBackgrounds" ||
              headerChildName === "GridGraph.Edges" ||
              headerChildName === "GridGraph.Nodes"
            ) {
              throw new Error(
                `${headerChildName} must be placed inside <GridGraph.Content>, not in <GridGraph.Header>`,
              );
            }
          }
        });
      }
    }
  });

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
    onNodeClick: handleNodeClick,
    onReorderBranches: onReorderBranches_,
    nodes,
    edges,
  };

  return (
    <GridGraphContext.Provider value={contextValue}>
      <div
        className={className || "gg__container"}
        style={
          {
            // Only set computed layout values as CSS variables
            // Config values are kept in JS only to avoid sync issues
            "--gg-header-height": headerHeight,
            "--gg-content-height": `${contentHeight}px`,
            "--gg-graph-width": `${graphWidth}px`,
          } as React.CSSProperties
        }
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
  return (
    <div className={className || "gg__header"}>
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
  const { containerRef } = useGridGraphContext();

  return (
    <div
      className={className || "gg__content"}
      ref={containerRef}
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
  const { layoutData, config } = useGridGraphContext();

  return (
    <PrimitiveLaneLines
      maxCol={layoutData.maxCol}
      config={config}
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
