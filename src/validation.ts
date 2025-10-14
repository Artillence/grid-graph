import { Node, Edge } from "./types";
import { buildGraphMaps } from "./layout";
import { detectCycles, topologicalSort } from "./algorithm";

export function validateGraph(
  nodeMap: Map<string, Node>,
  parentMap: Map<string, string[]>,
  childMap: Map<string, string[]>
): void {
  for (const [nodeId, parents] of parentMap.entries()) {
    if (parents.length > 1 && !nodeMap.get(nodeId)?.branch) {
      throw new Error(`Node "${nodeId}" is a merge node but lacks a 'branch' property.`);
    }
  }

  for (const [nodeId, children] of childMap.entries()) {
    if (children.length > 1) {
      const node = nodeMap.get(nodeId)!;
      const isRoot = (parentMap.get(nodeId) || []).length === 0;

      if (isRoot && !node.branch) {
        throw new Error(`Node "${nodeId}" is a root branch point and must have a 'branch' property.`);
      }

      const childrenWithoutBranch = children.filter((childId) => !nodeMap.get(childId)?.branch);

      if (childrenWithoutBranch.length > 1) {
        throw new Error(
          `Node "${nodeId}" creates a branch. All but one child must have an explicit 'branch' property.`
        );
      }
    }
  }
}

export function validateAndSort(nodes: Node[], edges: Edge[]): string[] {
  if (nodes.length === 0) return [];

  const { nodeMap, parentMap, childMap, inDegree } = buildGraphMaps(nodes, edges);

  validateGraph(nodeMap, parentMap, childMap);

  if (detectCycles(nodes, childMap, inDegree)) {
    throw new Error("Graph contains a cycle and is not a valid DAG.");
  }

  return topologicalSort(nodes, childMap, inDegree);
}
