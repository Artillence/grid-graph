"use client";
import React, { useState, useRef, ReactNode } from "react";
import { GraphProps, LayoutData, resolveAutoBranchConfig } from "./types";
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
  onNodeDoubleClick?: (id: string) => void;
  onNodeContextMenu?: (id: string, event: React.MouseEvent) => void;
  onNodeMouseOver?: (id: string) => void;
  onNodeMouseOut?: (id: string) => void;
  onHeaderClick?: () => void;
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
  style?: React.CSSProperties;
};

const GridGraphRoot: React.FC<GridGraphProps> = ({
  nodes,
  edges,
  onClick,
  onNodeDoubleClick,
  onNodeContextMenu,
  onNodeMouseOver,
  onNodeMouseOut,
  selectedNodeId,
  onSelectedNodeChange,
  verticalLabels = true,
  config: config_,
  className,
  style: userStyle,
  onReorderBranches: onReorderBranches_,
  branchOrder: branchOrder_,
  autoBranches,
  children,
}) => {
  // Use controlled component pattern if selectedNodeId is provided
  const isControlled = selectedNodeId !== undefined;
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const selected = isControlled ? selectedNodeId : internalSelected;
  
  const [hovered, setHovered] = useState<string | null>(null);

  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const config = {
    ...DEFAULT_CONFIG,
    ...config_,
    colors: config_?.colors ?? DEFAULT_CONFIG.colors,
  };

  // Resolve autoBranches config with defaults
  const autoBranchConfig = autoBranches
    ? resolveAutoBranchConfig(
        typeof autoBranches === 'boolean' ? {} : autoBranches
      )
    : undefined;

  const layoutData = useGraphLayout(
    nodes,
    edges,
    branchOrder_,
    config.colors ?? DEFAULT_CONFIG.colors,
    autoBranchConfig,
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

  const handleSetSelected = (id: string | null) => {
    if (isControlled) {
      onSelectedNodeChange?.(id);
    } else {
      setInternalSelected(id);
    }
  };

  const handleNodeClick = (id: string) => {
    handleSetSelected(id);
    onClick?.(id);
  };

  const handleNodeDoubleClick = (id: string) => {
    onNodeDoubleClick?.(id);
  };

  const handleNodeContextMenu = (id: string, event: React.MouseEvent) => {
    onNodeContextMenu?.(id, event);
  };

  const handleNodeMouseOver = (id: string) => {
    setHovered(id);
    onNodeMouseOver?.(id);
  };

  const handleNodeMouseOut = (id: string) => {
    setHovered(null);
    onNodeMouseOut?.(id);
  };

  const handleHeaderClick = () => {
    handleSetSelected(null);
  };

  const contextValue: GridGraphContextValue = {
    layoutData,
    edgePaths,
    selected,
    hovered,
    setSelected: handleSetSelected,
    setHovered,
    nodeRefs,
    containerRef,
    config,
    verticalLabels,
    graphWidth,
    onNodeClick: handleNodeClick,
    onNodeDoubleClick: handleNodeDoubleClick,
    onNodeContextMenu: handleNodeContextMenu,
    onNodeMouseOver: handleNodeMouseOver,
    onNodeMouseOut: handleNodeMouseOut,
    onHeaderClick: handleHeaderClick,
    onReorderBranches: onReorderBranches_,
    nodes,
    edges,
  };

  return (
    <GridGraphContext.Provider value={contextValue}>
      <div
        className={`gg__container ${className || ''}`}
        style={
          {
            // Only set computed layout values as CSS variables
            // Config values are kept in JS only to avoid sync issues
            "--gg-header-height": headerHeight,
            "--gg-content-height": `${contentHeight}px`,
            "--gg-graph-width": `${graphWidth}px`,
            ...userStyle,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </GridGraphContext.Provider>
  );
};

// Header Component - renders children
const Header: React.FC<{ 
  children?: ReactNode; 
  className?: string; 
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({
  children,
  className,
  style,
  onClick,
}) => {
  const { onHeaderClick } = useGridGraphContext();
  const [isHovered, setIsHovered] = useState(false);

  const isClickable = onClick !== undefined;

  const handleClick = () => {
    if (onClick) {
      onClick();
      onHeaderClick?.();
    }
  };

  return (
    <div 
      className={`gg__header ${className || ''} ${isClickable ? 'gg__header-clickable' : ''} ${isHovered && isClickable ? 'gg__header-hovered' : ''}`}
      style={style}
      onClick={handleClick}
      onMouseEnter={() => isClickable && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

Header.displayName = "GridGraph.Header";

// Content Component - renders children
const Content: React.FC<{ children?: ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className,
  style,
}) => {
  const { containerRef } = useGridGraphContext();

  return (
    <div
      className={`gg__content ${className || ''}`}
      style={style}
      ref={containerRef}
    >
      {children}
    </div>
  );
};

Content.displayName = "GridGraph.Content";

// Primitive components wrapped to use context
const BranchDots: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  const { layoutData, config, onReorderBranches } = useGridGraphContext();

  return (
    <PrimitiveBranchDots
      branchLaneMap={layoutData.branchLaneMap}
      branchColorMap={layoutData.branchColorMap}
      config={config}
      onReorderBranches={onReorderBranches}
      className={className}
      style={style}
    />
  );
};

BranchDots.displayName = "GridGraph.BranchDots";

const BranchNames: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  const { layoutData, config, verticalLabels } = useGridGraphContext();

  return (
    <PrimitiveBranchNames
      branchLaneMap={layoutData.branchLaneMap}
      verticalLabels={verticalLabels}
      config={config}
      className={className}
      style={style}
    />
  );
};

BranchNames.displayName = "GridGraph.BranchNames";

const LaneLines: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  const { layoutData, config } = useGridGraphContext();

  return (
    <PrimitiveLaneLines
      maxCol={layoutData.maxCol}
      config={config}
      className={className}
      style={style}
    />
  );
};

LaneLines.displayName = "GridGraph.LaneLines";

const RowBackgrounds: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  selectedClassName?: string;
  hoveredClassName?: string;
}> = ({ className, style, selectedClassName, hoveredClassName }) => {
  const { layoutData, selected, hovered, config } = useGridGraphContext();

  return (
    <PrimitiveRowBackgrounds
      nodeRenderIndex={layoutData.nodeRenderIndex}
      selected={selected}
      hovered={hovered}
      rowHeight={config.rowHeight}
      className={className}
      style={style}
      selectedClassName={selectedClassName}
      hoveredClassName={hoveredClassName}
    />
  );
};

RowBackgrounds.displayName = "GridGraph.RowBackgrounds";

const Edges: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  pathClassName?: string;
}> = ({ className, style, pathClassName }) => {
  const { edgePaths } = useGridGraphContext();

  return (
    <PrimitiveEdges
      edgePaths={edgePaths}
      className={className}
      style={style}
      pathClassName={pathClassName}
    />
  );
};

Edges.displayName = "GridGraph.Edges";

const Nodes: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  showLabels?: boolean;
  labelClassName?: string;
  selectedLabelClassName?: string;
}> = ({ className, style, showLabels = true, labelClassName, selectedLabelClassName }) => {
  const {
    nodes,
    layoutData,
    selected,
    hovered,
    nodeRefs,
    onNodeClick,
    onNodeDoubleClick,
    onNodeContextMenu,
    onNodeMouseOver,
    onNodeMouseOut,
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
      onNodeDoubleClick={onNodeDoubleClick}
      onNodeContextMenu={onNodeContextMenu}
      onMouseEnter={(id) => onNodeMouseOver?.(id)}
      onMouseLeave={(id) => onNodeMouseOut?.(id)}
      config={config}
      graphWidth={graphWidth}
      showLabels={showLabels}
      className={className}
      style={style}
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
