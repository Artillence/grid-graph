import { useLayoutEffect, useState, useRef } from "react";
import { Edge, Node, LayoutData, ResolvedGraphConfig } from "../types";
import { EdgePath } from "../constants";
import { calculateEdgePaths } from "../edges";

export function useEdgePaths(
  edges: Edge[],
  nodes: Node[],
  nodeRefs: Map<string, HTMLDivElement>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  layoutData: LayoutData,
  parentMap: Map<string, string[]>,
  cornerRadius: number,
  config: ResolvedGraphConfig,
): EdgePath[] {
  const [edgePaths, setEdgePaths] = useState<EdgePath[]>([]);
  const prevDepsRef = useRef<string>("");

  useLayoutEffect(() => {
    if (layoutData.error) return;

    // Force immediate recalculation when branch lanes change
    const recalculate = () => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const paths = calculateEdgePaths(
        edges,
        nodeRefs,
        containerRect,
        layoutData.nodeBranchMap,
        layoutData.branchColorMap,
        parentMap,
        cornerRadius,
        layoutData.nodeColumnMap,
        layoutData.nodeRenderIndex,
        config,
      );
      setEdgePaths(paths);
    };

    // Create a stable dependency key to prevent infinite loops
    // Include branch lane mapping to detect reordering
    const depsKey = JSON.stringify({
      edgeIds: edges.map((e) => `${e.source}-${e.target}`),
      nodeIds: nodes.map((n) => n.id),
      nodeColumns: Array.from(layoutData.nodeColumnMap.entries()),
      branchLanes: Array.from(layoutData.branchLaneMap.entries()).sort(
        (a, b) => a[1] - b[1],
      ),
      cornerRadius,
    });

    // Only update if dependencies actually changed
    if (prevDepsRef.current === depsKey) return;
    prevDepsRef.current = depsKey;

    // Recalculate immediately from layout data (not DOM positions)
    recalculate();
  });

  return edgePaths;
}
