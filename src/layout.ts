import { Edge, GraphNode, LayoutData } from "./types";



export function buildGraphMaps(nodes: GraphNode[], edges: Edge[]) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const parentMap = new Map<string, string[]>();
  const childMap = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  nodes.forEach((node) => {
    inDegree.set(node.id, 0);
    parentMap.set(node.id, []);
    childMap.set(node.id, []);
  });

  edges.forEach((edge) => {
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
    parentMap.get(edge.target)?.push(edge.source);
    childMap.get(edge.source)?.push(edge.target);
  });

  return { nodeMap, parentMap, childMap, inDegree };
}

export function assignBranches(
  sortedNodeIds: string[],
  nodeMap: Map<string, GraphNode>,
  parentMap: Map<string, string[]>
): Map<string, string> {
  const nodeBranchMap = new Map<string, string>();

  for (const nodeId of sortedNodeIds) {
    const node = nodeMap.get(nodeId)!;
    const parents = parentMap.get(nodeId) || [];

    let branch: string;
    if (node.branch) {
      branch = node.branch;
    } else if (parents.length === 1) {
      branch = nodeBranchMap.get(parents[0])!;
    } else {
      branch = nodeId;
    }

    nodeBranchMap.set(nodeId, branch);
  }

  return nodeBranchMap;
}

function assignLanes(
  sortedNodeIds: string[],
  nodeBranchMap: Map<string, string>,
  childMap: Map<string, string[]>
): { nodeColumnMap: Map<string, number>; branchLaneMap: Map<string, number> } {
  const branchLaneMap = new Map<string, number>();
  const nodeColumnMap = new Map<string, number>();

    let nextLane = 0;
    for (const nodeId of sortedNodeIds) {
      const branch = nodeBranchMap.get(nodeId)!;
      if (!branchLaneMap.has(branch)) {
        branchLaneMap.set(branch, nextLane++);
      }
      nodeColumnMap.set(nodeId, branchLaneMap.get(branch)!);
    }

  return { nodeColumnMap, branchLaneMap };
}

function applyBranchOrder(
  order_: string[] | undefined,
  branchLaneMap_: Map<string, number>,
  nodeColumnMap: Map<string, number>,
  nodeBranchMap: Map<string, string>
): Map<string, number> {
  if (!order_ || order_.length === 0) {
    return branchLaneMap_;
  }

  const reordered = new Map<string, number>();
  const allBranches = Array.from(branchLaneMap_.keys());

  order_.forEach((branchName, index) => {
    if (branchLaneMap_.has(branchName)) {
      reordered.set(branchName, index);
    }
  });

  let nextIndex = order_.length;
  allBranches.forEach((branchName) => {
    if (!reordered.has(branchName)) {
      reordered.set(branchName, nextIndex++);
    }
  });

  nodeColumnMap.forEach((_, nodeId) => {
    const branch = nodeBranchMap.get(nodeId)!;
    const newCol = reordered.get(branch)!;
    nodeColumnMap.set(nodeId, newCol);
  });

  return reordered;
}

export function calculateLayout(
  nodes: GraphNode[],
  edges: Edge[],
  sortedNodeIds: string[],
  colors : string[], 
  order_?: string[],
): Omit<LayoutData, 'error'> {
  const { nodeMap, parentMap, childMap } = buildGraphMaps(nodes, edges);
  const nodeBranchMap = assignBranches(sortedNodeIds, nodeMap, parentMap);
  const { nodeColumnMap, branchLaneMap } = assignLanes(
    sortedNodeIds,
    nodeBranchMap,
    childMap
  );

  const reorderedBranchLaneMap = applyBranchOrder(
    order_,
    branchLaneMap,
    nodeColumnMap,
    nodeBranchMap
  );

  const maxColumn = nodeColumnMap.size > 0
    ? Math.max(...Array.from(nodeColumnMap.values()))
    : 0;

  const nodeRenderIndex = new Map(sortedNodeIds.map((id, index) => [id, index]));

  return {
    nodeColumnMap,
    nodeBranchMap,
    branchLaneMap: reorderedBranchLaneMap,
    maxCol: maxColumn,
    branchColorMap: createColorMap(nodeBranchMap, colors),
    nodeRenderIndex,
  };
}

export function createColorMap(
  nodeBranchMap: Map<string, string>,
  colors: string[]
): Map<string, string> {
  const uniqueBranches = [...new Set(nodeBranchMap.values())];
  const colorMap = new Map<string, string>();
  
  uniqueBranches.forEach((branch, i) => {
    colorMap.set(branch, colors[i % colors.length]);
  });
  
  return colorMap;
}
