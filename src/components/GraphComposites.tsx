import React from "react";
import { GraphNode, Edge, LayoutData, ResolvedGraphConfig, GraphClassNames, GraphVisibility } from "../types";
import { BranchDots, BranchNames, LaneLines, NodeBackgrounds, Edges, Nodes } from "./GraphPrimitives";

export const GraphHeader: React.FC<{
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

export const GraphContent: React.FC<{
  nodes: GraphNode[];
  edges: Edge[];
  layoutData: Omit<LayoutData, "error">;
  edgePaths: { id: string; path: string; color: string }[];
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
  <div className="relative" ref={containerRef} style={{ height: contentHeight }}>
    {visibility.showLaneLines && (
      <LaneLines maxCol={layoutData.maxCol} config={config} className={classNames.laneLine} headerHeight={headerHeight} />
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
