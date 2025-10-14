"use client";
import { useState } from "react";
import { GridGraph } from "grid-graph";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// ---------------------------------------------------------------------
// 1. Helper Component: CodeBlock with Syntax Highlighting
// ---------------------------------------------------------------------

const CodeBlock = ({ code }: { code: string }) => (
  <details className="mt-4 mb-6">
    <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 -mx-1">
      Show Code
    </summary>
    <div className="mt-2 overflow-hidden rounded-lg shadow-xl">
      <SyntaxHighlighter
        language="tsx"
        style={vscDarkPlus}
        customStyle={{
          padding: "1.25em",
          margin: 0,
          fontSize: "0.875rem",
          lineHeight: "1.4",
        }}
        wrapLines={true}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  </details>
);

// ---------------------------------------------------------------------
// 2. Helper Component: Example Card
// ---------------------------------------------------------------------

interface ExampleCardProps {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
}

const ExampleCard = ({
  title,
  description,
  code,
  children,
}: ExampleCardProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-2xl">
    <h3 className="mb-2 text-3xl font-extrabold text-gray-900">{title}</h3>
    <p className="text-gray-600 mb-4 text-md">{description}</p>

    <CodeBlock code={code} />

    <div className="mt-8 pt-6 border-t border-gray-100">
      <h4 className="text-xl font-semibold mb-4 text-gray-800">
        Rendered Workflow Graph:
      </h4>
      <div className="overflow-x-auto p-4 border border-gray-100 rounded-lg bg-gray-50/50">
        {children}
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------
// 3. Main Page Component
// ---------------------------------------------------------------------

export default function Page() {
  const [branchOrder1, setBranchOrder1] = useState<string[]>([]);
  const [branchOrder2, setBranchOrder2] = useState<string[]>([]);

  // Example 1: A simple linear graph
  const nodes1 = [
    { id: "1", label: "Start Task", status: "completed" },
    { id: "2", label: "Processing Step", status: "completed" },
    { id: "3", label: "Validation Check", status: "running" },
    { id: "4", label: "Finish", status: "pending" },
  ];
  const edges1 = [
    { id: "e1-1", source: "1", target: "2" },
    { id: "e1-2", source: "2", target: "3" },
    { id: "e1-3", source: "3", target: "4" },
  ];

  const code1 = `
const nodes = [
  { id: "1", label: "Start Task", status: "completed" },
  // ...
  { id: "4", label: "Finish", status: "pending" },
];

const edges = [
  { id: "e1-1", source: "1", target: "2" },
  { id: "e1-2", source: "2", target: "3" },
  { id: "e1-3", source: "3", target: "4" },
];

<GridGraph nodes={nodes} edges={edges}>
  <GridGraph.Header />
  <GridGraph.Content />
</GridGraph>
  `;

  // Example 2: Graph with explicit, Git-like branch declarations
  const nodes2 = [
    { id: "0", label: "Commit A", branch: "main", status: "completed" },
    { id: "1", label: "Initial Setup", status: "completed" },
    { id: "2", label: "Prep", status: "completed" },
    {
      id: "3a",
      label: "Feature A Development",
      branch: "feature-A",
      status: "running",
    },
    {
      id: "3b",
      label: "Hotfix B Implementation",
      branch: "feature-B",
      status: "failed",
    },
    { id: "3c", label: "Feature A Continuation", status: "pending" },
    { id: "4", label: "Merge to Main", branch: "main", status: "pending" },
    { id: "5", label: "Final Deployment", status: "pending" },
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

  const code2 = `
const nodes = [
  { id: "0", label: "Commit A", branch: "main" },
  { id: "3a", label: "Feature A", branch: "feature-A", status: "running" }, 
  { id: "3b", label: "Hotfix B", branch: "feature-B", status: "failed" }, 
  { id: "3c", label: "Continuation" }, // Inherits 'feature-A'
  { id: "4", label: "Merge to Main", branch: "main" }, 
];

const edges = [
  // ... complex branching structure ...
  { source: "3b", target: "4" },
  { source: "3c", target: "4" },
];

// Note: grid-graph supports drag-and-drop reordering using branchOrder/onReorderBranches
<GridGraph branchOrder={branchOrder} onReorderBranches={setBranchOrder}>
  {/* ... */}
</GridGraph>
  `;

  // Example 4: Multiple sources and sinks
  const nodes4 = [
    { id: "source1", label: "Data Ingestion (A)", status: "completed" },
    {
      id: "source2",
      label: "API Trigger (B)",
      branch: "API-Stream",
      status: "completed",
    },
    { id: "process1", label: "Normalize A", status: "completed" },
    { id: "process2", label: "Validate B", status: "running" },
    {
      id: "process3",
      label: "Final Transform",
      branch: "main",
      status: "pending",
    }, // MERGE NODE
    { id: "sink1", label: "Cache Result", status: "completed" },
    { id: "sink2", label: "Report Generation", status: "pending" },
  ];
  const edges4 = [
    { id: "e4-1", source: "source1", target: "process1" },
    { id: "e4-2", source: "source2", target: "process2" },
    { id: "e4-3", source: "process1", target: "process3" },
    { id: "e4-4", source: "process2", target: "process3" },
    { id: "e4-5", source: "process1", target: "sink1" }, // Split to sink
    { id: "e4-6", source: "process3", target: "sink2" },
  ];

  const code4 = `
const nodes = [
  { id: "source1", label: "Data Ingestion (A)" },
  { id: "source2", label: "API Trigger (B)", branch: "API-Stream" },
  { id: "process3", label: "Final Transform", branch: "main" },
  { id: "sink1", label: "Cache Result" },
  // ...
];

const edges = [
  { source: "process1", target: "process3" },
  { source: "process2", target: "process3" },
  { source: "process1", target: "sink1" }, // Split
];
  `;

  // Example 5: 3-lane parallel graph
  const nodes5 = [
    {
      id: "start",
      label: "Initialize Systems",
      branch: "Base",
      status: "completed",
    },
    {
      id: "a1",
      label: "Load User Data",
      branch: "User-Lane",
      status: "completed",
    },
    { id: "a2", label: "Encrypt User Data", status: "running" },
    {
      id: "b1",
      label: "Fetch Assets",
      branch: "Asset-Lane",
      status: "completed",
    },
    { id: "b2", label: "Optimize Images", status: "completed" },
    {
      id: "c1",
      label: "Start Background Job",
      branch: "Job-Lane",
      status: "completed",
    },
    { id: "c2", label: "Job Cleanup", status: "pending" },
    {
      id: "end",
      label: "Final Synchronization",
      branch: "Base",
      status: "pending",
    }, // MERGE NODE
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

  const code5 = `
const nodes = [
  { id: "start", label: "Initialize Systems", branch: "Base" },
  { id: "a1", label: "Load User Data", branch: "User-Lane" },
  { id: "b1", label: "Fetch Assets", branch: "Asset-Lane" },
  { id: "c1", label: "Start Background Job", branch: "Job-Lane" },
  { id: "end", label: "Final Synchronization", branch: "Base" },
];

const edges = [
  { source: "start", target: "a1" },
  { source: "start", target: "b1" },
  { source: "start", target: "c1" },
  { source: "a2", target: "end" },
  { source: "b2", target: "end" },
  { source: "c2", target: "end" },
];
  `;

  // Example 6: Disconnected graph
  const nodes6 = [
    { id: "x1", label: "Component X Start" },
    { id: "x2", label: "Component X End" },
    { id: "y1", label: "Component Y Start" },
    { id: "y2", label: "Component Y Mid" },
    { id: "y3", label: "Component Y End" },
  ];
  const edges6 = [
    { id: "e6-x1-x2", source: "x1", target: "x2" },
    { id: "e6-y1-y2", source: "y1", target: "y2" },
    { id: "e6-y2-y3", source: "y2", target: "y3" },
  ];

  const code6 = `
const nodes = [
  { id: "x1", label: "Component X Start" },
  { id: "x2", label: "Component X End" },
  { id: "y1", label: "Component Y Start" },
  // ...
];

const edges = [
  { id: "e6-x1-x2", source: "x1", target: "x2" }, // Disconnected graph 1
  { id: "e6-y1-y2", source: "y1", target: "y2" }, // Disconnected graph 2
  { id: "e6-y2-y3", source: "y2", target: "y3" },
];
  `;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Workflow Graph Examples
        </h1>
        <p className="mt-2 text-xl text-gray-500">
          Visualizing various Directed Acyclic Graph (DAG) structures using{" "}
          <code>dag-grid</code>.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Example 1: Linear */}
        <ExampleCard
          title="1. Linear Workflow Graph"
          description="A basic sequential pipeline where nodes are connected one after the other. Demonstrates simple dependency tracking."
          code={code1}
        >
          <GridGraph
            nodes={nodes1}
            edges={edges1}
            branchOrder={branchOrder1}
            onReorderBranches={setBranchOrder1}
          >
            <GridGraph.Header />
            <GridGraph.Content />
          </GridGraph>
        </ExampleCard>

        {/* Example 2: Git-like Branching */}
        <ExampleCard
          title="2. Git-style Branching and Merging"
          description="Illustrates complex divergence and convergence. Nodes declare their associated branch, allowing drag-and-drop reordering of parallel branches."
          code={code2}
        >
          <GridGraph
            nodes={nodes2}
            edges={edges2}
            branchOrder={branchOrder2}
            onReorderBranches={setBranchOrder2}
          >
            <GridGraph.Header />
            <GridGraph.Content />
          </GridGraph>
        </ExampleCard>

        {/* Example 4: Multiple Sources/Sinks */}
        <ExampleCard
          title="3. Multiple Sources, Forks, and Sinks"
          description="A graph starting from two independent sources, merging into a central process, and then splitting again into two distinct sinks."
          code={code4}
        >
          <GridGraph nodes={nodes4} edges={edges4}>
            <GridGraph.Header />
            <GridGraph.Content />
          </GridGraph>
        </ExampleCard>

        {/* Example 5: 3-Lane Parallel Graph */}
        <ExampleCard
          title="4. Parallel Execution Lanes (3-Way Split/Merge)"
          description="Demonstrates parallel workstreams originating from a single node and converging into a final synchronization step."
          code={code5}
        >
          <GridGraph nodes={nodes5} edges={edges5}>
            <GridGraph.Header />
            <GridGraph.Content />
          </GridGraph>
        </ExampleCard>

        {/* Example 6: Disconnected graph */}
        <ExampleCard
          title="5. Disconnected Graph Components"
          description="Shows how the layout engine handles graphs composed of two or more completely independent sub-graphs."
          code={code6}
        >
          <GridGraph nodes={nodes6} edges={edges6}>
            <GridGraph.Header />
            <GridGraph.Content />
          </GridGraph>
        </ExampleCard>
      </div>
    </div>
  );
}
