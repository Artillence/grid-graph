"use client";
import React, { useState, useLayoutEffect, useRef } from "react";
import { GraphProps, LayoutData } from "./types";
import { DEFAULT_CONFIG, DEFAULT_VISIBILITY, DEFAULT_CLASSNAMES } from "./constants";
import { computeHeaderHeight } from "./utils";
import { useGraphLayout, useEdgePaths } from "./hooks";
import { buildGraphMaps } from "./layout";
import { GraphHeader, GraphContent } from "./components";


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
  classNames: typeof DEFAULT_CLASSNAMES;
  visibility: typeof DEFAULT_VISIBILITY;
  verticalLabels: boolean;
  graphWidth: number;
  contentHeight: number;
  headerHeight: string;
  onNodeClick: (id: string) => void;
  onReorderBranches?: (newOrder: string[]) => void;
  nodes: GraphProps["nodes"];
  edges: GraphProps["edges"];
};

const GridGraphContext = React.createContext<GridGraphContextValue | null>(null);

const useGridGraphContext = () => {
  const context = React.useContext(GridGraphContext);
  if (!context) {
    throw new Error("GridGraph compound components must be used within GridGraph");
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
  visibility: visibility_,
  classNames: classNames_,
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
  const visibility = { ...DEFAULT_VISIBILITY, ...visibility_ };
  const classNames = { ...DEFAULT_CLASSNAMES, ...classNames_ };

  const layoutData = useGraphLayout(
    nodes,
    edges,
    branchOrder_,
    config.colors ?? DEFAULT_CONFIG.colors
  );

  const { parentMap } = buildGraphMaps(nodes, edges);
  const edgePaths = useEdgePaths(
    edges,
    nodes,
    nodeRefs.current,
    containerRef,
    layoutData,
    parentMap,
    config.cornerRadius,
    config,
    0
  );

  if (layoutData.error) {
    throw new Error(`Graph Layout Error: ${layoutData.error}`);
  }

  const graphWidth = (layoutData.maxCol + 1) * config.columnWidth + config.padding;
  const contentHeight = nodes.length * config.rowHeight;
  const headerHeight =
    config.headerHeight ??
    computeHeaderHeight(
      visibility.showBranchDots,
      visibility.showBranchNames,
      verticalLabels,
      layoutData.branchLaneMap
    );
  const totalWidth = visibility.showNodeLabels ? graphWidth + 200 : graphWidth;

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
    classNames,
    visibility,
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
        className={classNames.container}
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


const Header: React.FC = () => {
  const { layoutData, config, classNames, headerHeight, verticalLabels, visibility, onReorderBranches } =
    useGridGraphContext();

  const showBranchDots = visibility.showBranchDots;
  const showBranchNames = visibility.showBranchNames;

  if (!showBranchDots && !showBranchNames) return null;

  return (
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
  );
};


const Body: React.FC = () => {
  const {
    nodes,
    edges,
    layoutData,
    edgePaths,
    selected,
    hovered,
    onNodeClick,
    setHovered,
    nodeRefs,
    containerRef,
    config,
    classNames,
    visibility,
    headerHeight,
    graphWidth,
    contentHeight,
  } = useGridGraphContext();

  return (
    <GraphContent
      nodes={nodes}
      edges={edges}
      layoutData={layoutData}
      edgePaths={edgePaths}
      selected={selected}
      hovered={hovered}
      onNodeClick={onNodeClick}
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
  );
};


export const GridGraph = Object.assign(GridGraphRoot, {
  Header: Header,
  Content: Body,
});
