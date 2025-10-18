import { Node, Edge } from "./types";
import { buildGraphMaps } from "./layout";
import { detectCycles, topologicalSort } from "./algorithm";

export function validateGraph(
  nodeMap: Map<string, Node>,
  parentMap: Map<string, string[]>,
  childMap: Map<string, string[]>,
  autoNameBranches: boolean = false,
): void {
  // Skip validation if auto-naming branches
  if (autoNameBranches) {
    return;
  }

  for (const [nodeId, parents] of parentMap.entries()) {
    if (parents.length > 1 && !nodeMap.get(nodeId)?.branch) {
      throw new Error(
        `Node "${nodeId}" is a merge node but lacks a 'branch' property.`,
      );
    }
  }

  for (const [nodeId, children] of childMap.entries()) {
    if (children.length > 1) {
      const node = nodeMap.get(nodeId)!;
      const isRoot = (parentMap.get(nodeId) || []).length === 0;

      if (isRoot && !node.branch) {
        throw new Error(
          `Node "${nodeId}" is a root branch point and must have a 'branch' property.`,
        );
      }

      const childrenWithoutBranch = children.filter(
        (childId) => !nodeMap.get(childId)?.branch,
      );

      if (childrenWithoutBranch.length > 1) {
        throw new Error(
          `Node "${nodeId}" creates a branch. All but one child must have an explicit 'branch' property.`,
        );
      }
    }
  }
}

export function validateAndSort(nodes: Node[], edges: Edge[], autoNameBranches: boolean = false): string[] {
  if (nodes.length === 0) return [];

  // Validate that all edges reference existing nodes
  const nodeIds = new Set(nodes.map(n => n.id));
  const missingNodes = new Set<string>();
  
  for (const edge of edges) {
    if (!nodeIds.has(edge.source)) {
      missingNodes.add(edge.source);
    }
    if (!nodeIds.has(edge.target)) {
      missingNodes.add(edge.target);
    }
  }
  
  if (missingNodes.size > 0) {
    throw new Error(
      `Edges reference non-existent nodes: ${Array.from(missingNodes).join(", ")}. ` +
      `All nodes referenced in edges must be defined in the nodes array.`
    );
  }

  const { nodeMap, parentMap, childMap, inDegree } = buildGraphMaps(
    nodes,
    edges,
  );

  validateGraph(nodeMap, parentMap, childMap, autoNameBranches);

  const cycleResult = detectCycles(nodes, childMap, inDegree);
  if (cycleResult.hasCycle) {
    const nodeList = cycleResult.nodesInCycle.length > 0 
      ? ` Nodes involved: ${cycleResult.nodesInCycle.join(", ")}`
      : "";
    throw new Error(`Graph contains a cycle and is not a valid DAG.${nodeList}`);
  }

  return topologicalSort(nodes, childMap, inDegree);
}
