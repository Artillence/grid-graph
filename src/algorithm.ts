import { GraphNode } from "./types";

export function detectCycles(
  nodes: GraphNode[],
  childMap: Map<string, string[]>,
  inDegree: Map<string, number>
): boolean {
  const tempInDegree = new Map(inDegree);
  const queue = nodes.map((n) => n.id).filter((id) => tempInDegree.get(id) === 0);
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
  nodes: GraphNode[],
  childMap: Map<string, string[]>,
  inDegree: Map<string, number>
): string[] {
  const result: string[] = [];
  const visited = new Set<string>();

  for (const node of nodes) {
    if (!visited.has(node.id) && inDegree.get(node.id) === 0) {
      const queue = [node.id];
      visited.add(node.id);
      let head = 0;

      while (head < queue.length) {
        const nodeId = queue[head++];
        result.push(nodeId);

        for (const childId of childMap.get(nodeId) || []) {
          if (!visited.has(childId)) {
            visited.add(childId);
            queue.push(childId);
          }
        }
      }
    }
  }

  return result;
}