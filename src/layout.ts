import { Edge, Node, LayoutData, ResolvedAutoBranchConfig } from "./types";

export function buildGraphMaps(nodes: Node[], edges: Edge[]) {
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

function calculateBranchDepth(
  branchName: string,
  nodeId: string,
  childMap: Map<string, string[]>,
  nodeBranchMap: Map<string, string>,
): number {
  // Calculate the remaining depth of this branch from this node
  let maxDepth = 0;
  const queue: Array<{ id: string; depth: number }> = [{ id: nodeId, depth: 0 }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    maxDepth = Math.max(maxDepth, depth);

    const children = childMap.get(id) || [];
    for (const childId of children) {
      // Only follow children that are on the same branch
      if (nodeBranchMap.get(childId) === branchName) {
        queue.push({ id: childId, depth: depth + 1 });
      }
    }
  }

  return maxDepth;
}

export function assignBranchesAuto(
  sortedNodeIds: string[],
  nodeMap: Map<string, Node>,
  parentMap: Map<string, string[]>,
  childMap: Map<string, string[]>,
  config: ResolvedAutoBranchConfig,
): Map<string, string> {
  const nodeBranchMap = new Map<string, string>();
  const branchNodesMap = new Map<string, string[]>(); // Track nodes in each branch

  for (const nodeId of sortedNodeIds) {
    const parents = parentMap.get(nodeId) || [];

    let branch: string;

    if (parents.length === 0) {
      // Root node - create a new branch
      const branchNodes = [nodeId];
      const branchName = config.nameBranch(nodeId, nodeMap);
      branch = branchName;
      branchNodesMap.set(branchName, branchNodes);
    } else if (parents.length === 1) {
      const parentBranch = nodeBranchMap.get(parents[0])!;
      const parentChildren = childMap.get(parents[0]) || [];
      
      // If parent has multiple children, only the first one continues the parent's branch
      // Others start new branches
      if (parentChildren.length > 1) {
        const isFirstChild = parentChildren[0] === nodeId;
        if (isFirstChild) {
          branch = parentBranch;
          branchNodesMap.get(parentBranch)?.push(nodeId);
        } else {
          // Create new branch
          const branchNodes = [nodeId];
          const branchName = config.nameBranch(nodeId, nodeMap);
          branch = branchName;
          branchNodesMap.set(branchName, branchNodes);
        }
      } else {
        // Single child continues parent's branch
        branch = parentBranch;
        branchNodesMap.get(parentBranch)?.push(nodeId);
      }
    } else {
      // Multiple parents (merge)
      if (config.mergeCreatesBranch) {
        // Create a new branch
        const branchNodes = [nodeId];
        const branchName = config.nameBranch(nodeId, nodeMap);
        branch = branchName;
        branchNodesMap.set(branchName, branchNodes);
      } else {
        // Continue on the parent's branch that has the shortest remaining depth
        // This avoids conflicts with other nodes deeper in that branch
        const parentBranches = parents.map((parentId) => ({
          parentId,
          branch: nodeBranchMap.get(parentId)!,
        }));

        // Calculate remaining depth for each parent's branch
        const branchDepths = parentBranches.map(({ parentId, branch: branchName }) => ({
          parentId,
          branch: branchName,
          depth: calculateBranchDepth(branchName, parentId, childMap, nodeBranchMap),
        }));

        // Choose the branch with the shortest remaining depth
        branchDepths.sort((a, b) => a.depth - b.depth);
        branch = branchDepths[0].branch;
        branchNodesMap.get(branch)?.push(nodeId);
      }
    }

    nodeBranchMap.set(nodeId, branch);
  }

  // Validate that all generated branch names are unique
  const branchNames = Array.from(branchNodesMap.keys());
  const uniqueBranchNames = new Set(branchNames);
  if (branchNames.length !== uniqueBranchNames.size) {
    const duplicates = branchNames.filter(
      (name, index) => branchNames.indexOf(name) !== index
    );
    throw new Error(
      `Auto-generated branch names must be unique. Duplicate branch names found: ${duplicates.join(', ')}. ` +
      `Please provide a custom nameBranch function that generates unique names.`
    );
  }

  return nodeBranchMap;
}

function assignBranches(
  sortedNodeIds: string[],
  nodeMap: Map<string, Node>,
  parentMap: Map<string, string[]>,
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
  childMap: Map<string, string[]>,
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
  nodeBranchMap: Map<string, string>,
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
  nodes: Node[],
  edges: Edge[],
  sortedNodeIds: string[],
  colors: string[],
  order_?: string[],
  autoBranchConfig?: ResolvedAutoBranchConfig,
): Omit<LayoutData, "error"> {
  const { nodeMap, parentMap, childMap } = buildGraphMaps(nodes, edges);
  
  const nodeBranchMap = autoBranchConfig
    ? assignBranchesAuto(sortedNodeIds, nodeMap, parentMap, childMap, autoBranchConfig)
    : assignBranches(sortedNodeIds, nodeMap, parentMap);
  
  const { nodeColumnMap, branchLaneMap } = assignLanes(
    sortedNodeIds,
    nodeBranchMap,
    childMap,
  );

  const reorderedBranchLaneMap = applyBranchOrder(
    order_,
    branchLaneMap,
    nodeColumnMap,
    nodeBranchMap,
  );

  const maxColumn =
    nodeColumnMap.size > 0
      ? Math.max(...Array.from(nodeColumnMap.values()))
      : 0;

  const nodeRenderIndex = new Map(
    sortedNodeIds.map((id, index) => [id, index]),
  );

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
  colors: string[],
): Map<string, string> {
  const uniqueBranches = [...new Set(nodeBranchMap.values())];
  const colorMap = new Map<string, string>();

  uniqueBranches.forEach((branch, i) => {
    colorMap.set(branch, colors[i % colors.length]);
  });

  return colorMap;
}
