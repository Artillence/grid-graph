"use client";
import { useState } from "react";
import { WorkflowGraph } from "dag-grid";

export default function Page() {
  const [branchOrder1, setBranchOrder1] = useState<string[]>([]);
  const [branchOrder2, setBranchOrder2] = useState<string[]>([]);

  // Example 1: A simple linear graph
  const nodes1 = [
    { id: "1", label: "1" },
    { id: "2", label: "2" },
    { id: "3", label: "3" },
    { id: "4", label: "4" },
  ];
  const edges1 = [
    { id: "e1-1", source: "1", target: "2" },
    { id: "e1-2", source: "2", target: "3" },
    { id: "e1-3", source: "3", target: "4" },
  ];

  // Example 2: Graph with explicit, Git-like branch declarations
  const nodes2 = [
    { id: "0", label: "0", branch: "main" },
    { id: "1", label: "1" },
    { id: "2", label: "2" },
    { id: "3a", label: "3a", branch: "feature-A" }, // Branch head
    { id: "3b", label: "3b", branch: "feature-B" }, // Branch head
    { id: "3c", label: "3c" }, // Inherits from 3a
    { id: "4", label: "4", branch: "main" }, // MERGE NODE
    { id: "5", label: "5" }, // Inherits from 4
  ];
  const edges2 = [
    { id: "e0-1", source: "0", target: "3a" },
    { id: "e0-2", source: "0", target: "3b" },
    { id: "e2-1", source: "1", target: "2" },
    { id: "e2-2", source: "2", target: "3a" },
    { id: "e2-3", source: "2", target: "3b" },
    { id: "e3c", source: "3a", target: "3c" },
    { id: "e2-5", source: "3b", target: "4" },
    { id: "e2-4", source: "3c", target: "4" },
    { id: "e2-6", source: "4", target: "5" },
    { id: "e0-4", source: "0", target: "4" },
  ];

  // Example 4: Multiple sources and sinks with a corrected merge node
  const nodes4 = [
    { id: "source1", label: "source1" },
    { id: "source2", label: "source2", branch: "source2-branch" }, // This starts a new conceptual branch
    { id: "process1", label: "process1" },
    { id: "process2", label: "process2" },
    { id: "process3", label: "process3", branch: "main" }, // MERGE NODE
    { id: "sink1", label: "sink1" },
    { id: "sink2", label: "sink2" },
  ];
  const edges4 = [
    { id: "e4-1", source: "source1", target: "process1" },
    { id: "e4-2", source: "source2", target: "process2" },
    { id: "e4-3", source: "process1", target: "process3" },
    { id: "e4-4", source: "process2", target: "process3" },
    { id: "e4-5", source: "process1", target: "sink1" },
    { id: "e4-6", source: "process3", target: "sink2" },
  ];

  // Example 5: 3-lane parallel graph with a corrected merge node
  const nodes5 = [
    { id: "end2", label: "end2", branch: "lane-A" },
    { id: "end3", label: "end3", branch: "lane-B" },
    { id: "start", label: "start", branch: "lane-X" },
    { id: "start2", label: "start2", branch: "lane-Y" },
    { id: "end4", label: "end4", branch: "lane-C" },
    { id: "a1", label: "a1", branch: "lane-A" },
    { id: "a2", label: "a2" },
    { id: "b1", label: "b1", branch: "lane-B" },
    { id: "b2", label: "b2" },
    { id: "c1", label: "c1", branch: "lane-C" },
    { id: "c2", label: "c2" },
    { id: "end", label: "end", branch: "lane-B" }, // MERGE NODE
  ];
  const edges5 = [
    { id: "e5-s-a1", source: "start", target: "a1" },
    { id: "e5-s-b1", source: "start", target: "b1" },
    { id: "e5-s-c1", source: "start", target: "c1" },
    { id: "e5-a1-a2", source: "a1", target: "a2" },
    { id: "e5-c1-c2", source: "c1", target: "c2" },
    { id: "e5-b1-b2", source: "b1", target: "b2" },
    { id: "e5-a2-e", source: "a2", target: "end" },
    { id: "e5-b2-e", source: "b2", target: "end" },
    { id: "c2-e", source: "c2", target: "end" },
  ];

  // Example 6: Disconnected graph
  const nodes6 = [
    { id: "x1", label: "x1" },
    { id: "x2", label: "x2" },
    { id: "y1", label: "y1" },
    { id: "y2", label: "y2" },
    { id: "y3", label: "y3" },
  ];
  const edges6 = [
    { id: "e6-x1-x2", source: "x1", target: "x2" },
    { id: "e6-y1-y2", source: "y1", target: "y2" },
    { id: "e6-y2-y3", source: "y2", target: "y3" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Examples</h2>
        <p className="text-gray-600">Various graph configurations and use cases</p>
      </div>
      
      <div className="space-y-12">
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">Linear Workflow Graph</h2>
        <p className="text-gray-600 mb-4 text-sm">A simple linear sequence of nodes connected in order.</p>
        <div className="overflow-x-auto">
          <WorkflowGraph.Root
            nodes={nodes1}
            edges={edges1}
            branchOrder={branchOrder1}
            onReorderBranches={setBranchOrder1}
          >
            <WorkflowGraph.Header />
            <WorkflowGraph.Content />
          </WorkflowGraph.Root>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">Git-like Branching Graph</h2>
        <p className="text-gray-600 mb-4 text-sm">A graph with explicit branch declarations, merge nodes, and branch inheritance.</p>
        <div className="overflow-x-auto">
          <WorkflowGraph.Root
            nodes={nodes2}
            edges={edges2}
            branchOrder={branchOrder2}
            onReorderBranches={setBranchOrder2}
          >
            <WorkflowGraph.Header />
            <WorkflowGraph.Content />
          </WorkflowGraph.Root>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">Multiple Sources and Sinks Graph</h2>
        <p className="text-gray-600 mb-4 text-sm">A workflow with multiple starting points and ending points.</p>
        <div className="overflow-x-auto">
          <WorkflowGraph.Root nodes={nodes4} edges={edges4}>
            <WorkflowGraph.Header />
            <WorkflowGraph.Content />
          </WorkflowGraph.Root>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">3-Lane Parallel Graph</h2>
        <p className="text-gray-600 mb-4 text-sm">Parallel execution lanes that converge into a single merge point.</p>
        <div className="overflow-x-auto">
          <WorkflowGraph.Root nodes={nodes5} edges={edges5}>
            <WorkflowGraph.Header />
            <WorkflowGraph.Content />
          </WorkflowGraph.Root>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">Disconnected Graph</h2>
        <p className="text-gray-600 mb-4 text-sm">Multiple separate graph components with no connections between them.</p>
        <div className="overflow-x-auto">
          <WorkflowGraph.Root nodes={nodes6} edges={edges6}>
            <WorkflowGraph.Header />
            <WorkflowGraph.Content />
          </WorkflowGraph.Root>
        </div>
      </div>
    </div>
    </div>
  );
}
