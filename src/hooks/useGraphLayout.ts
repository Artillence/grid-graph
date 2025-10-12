import { useMemo } from "react";
import { GraphNode, Edge, LayoutData } from "../types";
import { validateAndSort } from "../validation";
import { calculateLayout } from "../layout";
import { DEFAULT_CONFIG } from "../constants";

export function useGraphLayout(
  nodes: GraphNode[],
  edges: Edge[],
  branchOrder?: string[],
  colors: string[] = DEFAULT_CONFIG.colors
): LayoutData {
  return useMemo((): LayoutData => {
    try {
      const sortedIds = validateAndSort(nodes, edges);
      const layout = calculateLayout(nodes, edges, sortedIds, colors, branchOrder);
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
  }, [nodes, edges, branchOrder, colors]);
}
