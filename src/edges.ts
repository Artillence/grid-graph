import { Edge, NodePosition } from "./types";
import { EdgePath } from "./constants";

export function calculateEdgePath(
  source: NodePosition,
  target: NodePosition,
  cornerRadius: number,
  isMergeEdge: boolean
): string {
  const { x: x1, y: y1 } = source;
  const { x: x2, y: y2 } = target;
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 || dy === 0) {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  const horizontalDir = Math.sign(dx);
  const verticalDir = Math.sign(dy);

  if (isMergeEdge) {
    const cornerY = y2 - verticalDir * cornerRadius;
    const cornerX = x1 + horizontalDir * cornerRadius;
    return `M ${x1} ${y1} L ${x1} ${cornerY} Q ${x1} ${y2}, ${cornerX} ${y2} L ${x2} ${y2}`;
  } else {
    const cornerX = x2 - horizontalDir * cornerRadius;
    const cornerY = y1 + verticalDir * cornerRadius;
    return `M ${x1} ${y1} L ${cornerX} ${y1} Q ${x2} ${y1}, ${x2} ${cornerY} L ${x2} ${y2}`;
  }
}

export function getNodePosition(
  element: HTMLDivElement,
  containerRect: DOMRect
): NodePosition {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left - containerRect.left + rect.width / 2,
    y: rect.top - containerRect.top + rect.height / 2,
  };
}

export function calculateEdgePaths(
  edges: Edge[],
  nodeRefs: Map<string, HTMLDivElement>,
  containerRect: DOMRect | undefined,
  nodeBranchMap: Map<string, string>,
  branchColorMap: Map<string, string>,
  parentMap: Map<string, string[]>,
  cornerRadius: number
): EdgePath[] {
  if (!containerRect) return [];

  return edges.map((edge) => {
    const sourceEl = nodeRefs.get(edge.source);
    const targetEl = nodeRefs.get(edge.target);

    if (!sourceEl || !targetEl) {
      return { id: edge.id, path: "", color: "#ccc" };
    }

    const source = getNodePosition(sourceEl, containerRect);
    const target = getNodePosition(targetEl, containerRect);
    const isMergeEdge = (parentMap.get(edge.target) || []).length > 1;
    const path = calculateEdgePath(source, target, cornerRadius, isMergeEdge);

    const sourceBranch = nodeBranchMap.get(edge.source)!;
    const targetBranch = nodeBranchMap.get(edge.target)!;
    const edgeBranch = isMergeEdge ? sourceBranch : targetBranch;
    const color = branchColorMap.get(edgeBranch) ?? "#ccc";

    return { id: edge.id, path, color };
  });
}
