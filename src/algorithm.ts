import { Node } from "./types";

export function detectCycles(
  nodes: Node[],
  childMap: Map<string, string[]>,
  inDegree: Map<string, number>,
): boolean {
  const tempInDegree = new Map(inDegree);
  const queue = nodes
    .map((n) => n.id)
    .filter((id) => tempInDegree.get(id) === 0);
  const visited = [];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    visited.push(nodeId);

    for (const childId of childMap.get(nodeId) || []) {
      tempInDegree.set(childId, tempInDegree.get(childId)! - 1);
      if (tempInDegree.get(childId) === 0) {
        queue.push(childId);
      }
    }
  }

  return visited.length !== nodes.length;
}

export function topologicalSort(
  nodes: Node[],
  childMap: Map<string, string[]>,
  inDegree: Map<string, number>,
): string[] {
  const result: string[] = [];
  const tempInDegree = new Map(inDegree);
  
  // Start with all nodes that have no incoming edges
  const queue: string[] = nodes
    .filter((node) => tempInDegree.get(node.id) === 0)
    .map((node) => node.id);

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    result.push(nodeId);

    // Process all children of current node
    for (const childId of childMap.get(nodeId) || []) {
      const newDegree = tempInDegree.get(childId)! - 1;
      tempInDegree.set(childId, newDegree);
      
      // If child now has no incoming edges, add it to queue
      if (newDegree === 0) {
        queue.push(childId);
      }
    }
  }

  return result;
}
