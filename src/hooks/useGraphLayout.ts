import { useMemo } from "react";
import { Node, Edge, LayoutData, ResolvedAutoBranchConfig } from "../types";
import { validateAndSort } from "../validation";
import { calculateLayout } from "../layout";
import { DEFAULT_CONFIG } from "../constants";

export function useGraphLayout(
  nodes: Node[],
  edges: Edge[],
  branchOrder?: string[],
  colors: string[] = DEFAULT_CONFIG.colors,
  autoBranchConfig?: ResolvedAutoBranchConfig,
): LayoutData {
  return useMemo((): LayoutData => {
    try {
      const sortedIds = validateAndSort(nodes, edges, !!autoBranchConfig);
      const layout = calculateLayout(
        nodes,
        edges,
        sortedIds,
        colors,
        branchOrder,
        autoBranchConfig,
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
  }, [nodes, edges, branchOrder, colors, autoBranchConfig]);
}
