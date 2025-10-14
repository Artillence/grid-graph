import { useLayoutEffect, useState, useRef } from "react";
import { Edge, Node, LayoutData } from "../types";
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
  triggerUpdate: number
): EdgePath[] {
  const [edgePaths, setEdgePaths] = useState<EdgePath[]>([]);
  const prevDepsRef = useRef<string>("");

  useLayoutEffect(() => {
    if (layoutData.error) return;
    
    // Create a stable dependency key based on actual data
    const depsKey = JSON.stringify({
      edgeIds: edges.map(e => `${e.source}-${e.target}`),
      nodeIds: nodes.map(n => n.id),
      cornerRadius,
      triggerUpdate,
    });
    
    // Only update if dependencies actually changed
    if (prevDepsRef.current === depsKey) return;
    prevDepsRef.current = depsKey;
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    const paths = calculateEdgePaths(
      edges,
      nodeRefs,
      containerRect,
      layoutData.nodeBranchMap,
      layoutData.branchColorMap,
      parentMap,
      cornerRadius
    );
    setEdgePaths(paths);
  });

  return edgePaths;
}
