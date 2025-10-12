"use client";
import React, { useState, useLayoutEffect, useRef } from "react";
import { GraphProps, LayoutData } from "./types";
import { DEFAULT_CONFIG, DEFAULT_VISIBILITY, DEFAULT_CLASSNAMES } from "./constants";
import { computeHeaderHeight } from "./utils";
import { useGraphLayout, useEdgePaths } from "./hooks";
import { buildGraphMaps } from "./layout";
import { GraphHeader, GraphContent } from "./components";


type DagGridContextValue = {
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

const DagGridContext = React.createContext<DagGridContextValue | null>(null);

const useDagGridContext = () => {
  const context = React.useContext(DagGridContext);
  if (!context) {
    throw new Error("DagGrid compound components must be used within DagGrid");
  }
  return context;
};


type DagGridProps = GraphProps & {
  children?: React.ReactNode;
};

const DagGridRoot: React.FC<DagGridProps> = ({
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
  const [edgeUpdateTrigger, setEdgeUpdateTrigger] = useState(0);

  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const config = { ...DEFAULT_CONFIG, ...config_ };
  const visibility = { ...DEFAULT_VISIBILITY, ...visibility_ };
  const classNames = { ...DEFAULT_CLASSNAMES, ...classNames_ };

  const layoutData = useGraphLayout(nodes, edges, branchOrder_);

  // Trigger edge recalculation after branch order changes
  useLayoutEffect(() => {
    if (branchOrder_ && branchOrder_.length > 0) {
      const timer = setTimeout(() => setEdgeUpdateTrigger((prev) => prev + 1), 320);
      return () => clearTimeout(timer);
    }
  }, [branchOrder_]);

  const { parentMap } = buildGraphMaps(nodes, edges);
  const edgePaths = useEdgePaths(
    edges,
    nodes,
    nodeRefs.current,
    containerRef,
    layoutData,
    parentMap,
    config.cornerRadius,
    edgeUpdateTrigger
  );

  if (layoutData.error) {
    return (
      <div className="rounded-md border border-red-400 bg-red-100 p-4 text-red-700">
        <h3 className="font-bold">Graph Layout Error</h3>
        <p>{layoutData.error}</p>
      </div>
    );
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

  const contextValue: DagGridContextValue = {
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
    <DagGridContext.Provider value={contextValue}>
      <div
        className={classNames.container}
        style={{
          height: `calc(${headerHeight} + ${contentHeight}px)`,
          width: totalWidth,
        }}
      >
        {children}
      </div>
    </DagGridContext.Provider>
  );
};


const Header: React.FC = () => {
  const { layoutData, config, classNames, headerHeight, verticalLabels, visibility, onReorderBranches } =
    useDagGridContext();

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
  } = useDagGridContext();

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


export const DagGrid = Object.assign(DagGridRoot, {
  Header: Header,
  Content: Body,
});
