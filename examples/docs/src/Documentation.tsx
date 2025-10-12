"use client";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ code, language = "tsx" }: { code: string; language?: string }) => (
  <div className="my-4 overflow-hidden rounded-lg shadow-lg">
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        padding: '1.25em',
        margin: 0,
        fontSize: '0.875rem',
        lineHeight: '1.6',
      }}
    >
      {code.trim()}
    </SyntaxHighlighter>
  </div>
);

export default function Documentation() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">DAG Grid Documentation</h1>
        <p className="text-lg text-gray-600">
          A minimalist React component for rendering Directed Acyclic Graphs (DAGs) in a clean, readable grid layout.
        </p>
      </div>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Installation</h2>
        <CodeBlock code={`npm install dag-grid`} language="bash" />
        <CodeBlock code={`yarn add dag-grid`} language="bash" />
        <CodeBlock code={`pnpm add dag-grid`} language="bash" />
      </section>

      {/* Quick Start */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start</h2>
        <CodeBlock code={`import { DagGrid } from 'dag-grid';
import 'dag-grid/styles.css';

const nodes = [
  { id: '1', label: 'Start' },
  { id: '2', label: 'Process' },
  { id: '3', label: 'End' },
];

const edges = [
  { id: 'e1', source: '1', target: '2' },
  { id: 'e2', source: '2', target: '3' },
];

function MyGraph() {
  return <DagGrid nodes={nodes} edges={edges} />;
}`} />
      </section>

      {/* API Reference */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">API Reference</h2>
        
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">DagGrid Props</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Prop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Default</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">nodes</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">GraphNode[]</td>
                  <td className="px-6 py-4 text-sm text-red-600 font-semibold">required</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Array of graph nodes</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">edges</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">Edge[]</td>
                  <td className="px-6 py-4 text-sm text-red-600 font-semibold">required</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Array of edges connecting nodes</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">onSelect</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">(id: string) =&gt; void</td>
                  <td className="px-6 py-4 text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Callback when a node is clicked</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">verticalLabels</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">boolean</td>
                  <td className="px-6 py-4 text-sm text-gray-500">true</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Display branch labels vertically</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">config</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">GraphConfig</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{'{}'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Styling and layout configuration</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">visibility</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">GraphVisibility</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{'{}'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Control visibility of graph elements</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">classNames</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">GraphClassNames</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{'{}'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Custom CSS class names</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">onReorderBranches</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">(order: string[]) =&gt; void</td>
                  <td className="px-6 py-4 text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Callback when branches are reordered</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">branchOrder</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">string[]</td>
                  <td className="px-6 py-4 text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Explicit branch ordering</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Types */}
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">GraphNode</h3>
            <CodeBlock code={`type GraphNode = {
  id: string;
  label: string | React.ReactNode;
  branch?: string; // Optional branch assignment
};`} language="typescript" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Edge</h3>
            <CodeBlock code={`type Edge = {
  id: string;
  source: string; // Source node ID
  target: string; // Target node ID
};`} language="typescript" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">GraphConfig</h3>
            <CodeBlock code={`type GraphConfig = {
  rowHeight?: number;        // Default: 38
  columnWidth?: number;      // Default: 18
  nodeDiameter?: number;     // Default: 13
  padding?: number;          // Default: 20
  labelLeftMargin?: number;  // Default: 20
  colors?: string[];         // Branch colors (default palette provided)
  cornerRadius?: number;     // Default: 8
  headerHeight?: string;     // CSS height value
};`} language="typescript" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">GraphVisibility</h3>
            <CodeBlock code={`type GraphVisibility = {
  showBranchDots?: boolean;        // Default: true
  showBranchNames?: boolean;       // Default: true
  showLaneLines?: boolean;         // Default: false
  showEdges?: boolean;             // Default: true
  showNodeBackgrounds?: boolean;   // Default: true
  showNodeLabels?: boolean;        // Default: true
};`} language="typescript" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">GraphClassNames</h3>
            <CodeBlock code={`type GraphClassNames = {
  container?: string;
  nodeLabel?: string;
  nodeLabelSelected?: string;
  nodeBackground?: string;
  nodeBackgroundSelected?: string;
  nodeBackgroundHovered?: string;
  branchLabel?: string;
  laneLine?: string;
};`} language="typescript" />
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Usage Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Basic Linear Graph</h3>
            <CodeBlock code={`import { DagGrid } from 'dag-grid';
import 'dag-grid/styles.css';

const nodes = [
  { id: '1', label: 'Task 1' },
  { id: '2', label: 'Task 2' },
  { id: '3', label: 'Task 3' },
];

const edges = [
  { id: 'e1', source: '1', target: '2' },
  { id: 'e2', source: '2', target: '3' },
];

<DagGrid nodes={nodes} edges={edges} />`} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Branching Graph</h3>
            <CodeBlock code={`const nodes = [
  { id: '1', label: 'Main', branch: 'main' },
  { id: '2', label: 'Feature A', branch: 'feature-a' },
  { id: '3', label: 'Feature B', branch: 'feature-b' },
  { id: '4', label: 'Merge', branch: 'main' },
];

const edges = [
  { id: 'e1', source: '1', target: '2' },
  { id: 'e2', source: '1', target: '3' },
  { id: 'e3', source: '2', target: '4' },
  { id: 'e4', source: '3', target: '4' },
];

<DagGrid nodes={nodes} edges={edges} />`} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">With Selection Handler</h3>
            <CodeBlock code={`function MyComponent() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <DagGrid
        nodes={nodes}
        edges={edges}
        onSelect={(id) => setSelected(id)}
      />
      {selected && <p>Selected node: {selected}</p>}
    </div>
  );
}`} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Styling</h3>
            <CodeBlock code={`<DagGrid
  nodes={nodes}
  edges={edges}
  config={{
    rowHeight: 50,
    columnWidth: 25,
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    cornerRadius: 12,
  }}
  visibility={{
    showBranchNames: true,
    showLaneLines: true,
  }}
/>`} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Branch Control</h3>
            <CodeBlock code={`function MyGraph() {
  const [branchOrder, setBranchOrder] = useState<string[]>([]);

  return (
    <DagGrid
      nodes={nodes}
      edges={edges}
      branchOrder={branchOrder}
      onReorderBranches={setBranchOrder}
    />
  );
}`} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Node Labels</h3>
            <CodeBlock code={`const nodes = [
  {
    id: '1',
    label: (
      <div className="flex items-center gap-2">
        <span className="font-bold">Task 1</span>
        <span className="text-xs text-gray-500">Completed</span>
      </div>
    ),
  },
  // ... more nodes
];`} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎨 Clean Grid Layout</h3>
            <p className="text-gray-600">Renders DAGs in a structured, easy-to-read grid format</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🌿 Branch Visualization</h3>
            <p className="text-gray-600">Automatic branch detection and color-coded lanes</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Interactive</h3>
            <p className="text-gray-600">Click and hover support for nodes</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">⚡ Lightweight</h3>
            <p className="text-gray-600">Minimal dependencies, optimized performance</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎨 Customizable</h3>
            <p className="text-gray-600">Extensive configuration options for styling and behavior</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔧 TypeScript</h3>
            <p className="text-gray-600">Full TypeScript support with comprehensive type definitions</p>
          </div>
        </div>
      </section>

      {/* Styling */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Styling</h2>
        <p className="text-gray-600 mb-4">
          The component comes with default styles that you need to import:
        </p>
        <CodeBlock code={`import 'dag-grid/styles.css';`} />
        <p className="text-gray-600 mt-4 mb-4">
          You can customize appearance using the <code className="bg-gray-100 px-2 py-1 rounded text-sm">classNames</code> prop:
        </p>
        <CodeBlock code={`<DagGrid
  nodes={nodes}
  edges={edges}
  classNames={{
    container: 'my-custom-container',
    nodeLabel: 'my-custom-node-label',
    nodeLabelSelected: 'my-selected-label',
    nodeBackground: 'my-node-bg',
    branchLabel: 'my-branch-label',
  }}
/>`} />
      </section>

      {/* Browser Support */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Browser Support</h2>
        <p className="text-gray-600 mb-4">DAG Grid supports all modern browsers:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Chrome/Edge (latest 2 versions)</li>
          <li>Firefox (latest 2 versions)</li>
          <li>Safari (latest 2 versions)</li>
        </ul>
      </section>

      {/* License */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">License</h2>
        <p className="text-gray-600">MIT © Gábor Pallos</p>
      </section>
    </div>
  );
}
