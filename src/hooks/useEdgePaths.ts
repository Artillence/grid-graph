import { useMemo } from "react";
import { Edge, Node, LayoutData, ResolvedGraphConfig } from "../types";
import { EdgePath } from "../constants";
import { calculateEdgePaths } from "../edges";

export function useEdgePaths(
  edges: Edge[],
  nodes: Node[],
  layoutData: LayoutData,
  parentMap: Map<string, string[]>,
  config: ResolvedGraphConfig,
): EdgePath[] {
  return useMemo(() => {
    if (layoutData.error) return [];

    return calculateEdgePaths(
      edges,
      layoutData.nodeBranchMap,
      layoutData.branchColorMap,
      parentMap,
      config.cornerRadius,
      layoutData.nodeColumnMap,
      layoutData.nodeRenderIndex,
      config,
    );
  }, [
    edges,
    nodes.length,
    layoutData.nodeColumnMap,
    layoutData.branchLaneMap,
    config.cornerRadius,
    config.rowHeight,
    config.columnWidth,
    config.nodeDiameter,
    config.padding,
  ]);
}
