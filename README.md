# DAG Grid

A minimalist React component for rendering Directed Acyclic Graphs (DAGs) in a clean, readable grid layout. Inspired by VSCode's git graph visualization.

## Features

- 🎨 **Clean Grid Layout** - Renders DAGs in a structured, easy-to-read grid format
- 🌿 **Branch Visualization** - Automatic branch detection and color-coded lanes
- 🎯 **Interactive** - Click and hover support for nodes
- ⚡ **Lightweight** - Minimal dependencies, optimized performance
- 🎨 **Customizable** - Extensive configuration options for styling and behavior
- 📱 **Responsive** - Works on all screen sizes
- 🔧 **TypeScript** - Full TypeScript support with comprehensive type definitions

## Installation

```bash
npm install dag-grid
```

```bash
yarn add dag-grid
```

```bash
pnpm add dag-grid
```

## Quick Start

```tsx
import { DagGrid } from 'dag-grid';
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
}
```

## API Reference

### DagGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `GraphNode[]` | **required** | Array of graph nodes |
| `edges` | `Edge[]` | **required** | Array of edges connecting nodes |
| `onSelect` | `(id: string) => void` | `undefined` | Callback when a node is clicked |
| `verticalLabels` | `boolean` | `true` | Display branch labels vertically |
| `config` | `GraphConfig` | `{}` | Styling and layout configuration |
| `visibility` | `GraphVisibility` | `{}` | Control visibility of graph elements |
| `classNames` | `GraphClassNames` | `{}` | Custom CSS class names |
| `onReorderBranches` | `(order: string[]) => void` | `undefined` | Callback when branches are reordered |
| `branchOrder` | `string[]` | `undefined` | Explicit branch ordering |

### Types

#### GraphNode

```typescript
type GraphNode = {
  id: string;
  label: string | React.ReactNode;
  branch?: string; // Optional branch assignment
};
```

#### Edge

```typescript
type Edge = {
  id: string;
  source: string; // Source node ID
  target: string; // Target node ID
};
```

#### GraphConfig

```typescript
type GraphConfig = {
  rowHeight?: number;        // Default: 38
  columnWidth?: number;      // Default: 18
  nodeDiameter?: number;     // Default: 13
  padding?: number;          // Default: 20
  labelLeftMargin?: number;  // Default: 20
  colors?: string[];         // Branch colors
  cornerRadius?: number;     // Default: 8
  headerHeight?: string;     // CSS height value
};
```

#### GraphVisibility

```typescript
type GraphVisibility = {
  showBranchDots?: boolean;        // Default: true
  showBranchNames?: boolean;       // Default: true
  showLaneLines?: boolean;         // Default: false
  showEdges?: boolean;             // Default: true
  showNodeBackgrounds?: boolean;   // Default: true
  showNodeLabels?: boolean;        // Default: true
};
```

## Examples

### Basic Linear Graph

```tsx
import { DagGrid } from 'dag-grid';
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

<DagGrid nodes={nodes} edges={edges} />
```

### Branching Graph

```tsx
const nodes = [
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

<DagGrid nodes={nodes} edges={edges} />
```

### With Selection Handler

```tsx
function MyComponent() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <DagGrid
      nodes={nodes}
      edges={edges}
      onSelect={(id) => setSelected(id)}
    />
  );
}
```

### Custom Styling

```tsx
<DagGrid
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
/>
```

## Advanced Usage

### Branch Control

You can control the order of branches and allow users to reorder them:

```tsx
function MyGraph() {
  const [branchOrder, setBranchOrder] = useState<string[]>([]);

  return (
    <DagGrid
      nodes={nodes}
      edges={edges}
      branchOrder={branchOrder}
      onReorderBranches={setBranchOrder}
    />
  );
}
```

### Custom Node Labels

Nodes can have React elements as labels:

```tsx
const nodes = [
  {
    id: '1',
    label: (
      <div className="flex items-center gap-2">
        <span className="font-bold">Task 1</span>
        <span className="text-xs text-gray-500">Completed</span>
      </div>
    ),
  },
];
```

## Styling

The component comes with default styles that you need to import:

```tsx
import 'dag-grid/styles.css';
```

You can customize appearance using the `classNames` prop:

```tsx
<DagGrid
  nodes={nodes}
  edges={edges}
  classNames={{
    container: 'my-custom-container',
    nodeLabel: 'my-custom-node-label',
    nodeLabelSelected: 'my-selected-label',
    nodeBackground: 'my-node-bg',
    branchLabel: 'my-branch-label',
  }}
/>
```

## Browser Support

DAG Grid supports all modern browsers:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## License

MIT © Gábor Pallos

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Links

- [Documentation & Examples](https://artillence.github.io/dag-grid)
- [GitHub Repository](https://github.com/Artillence/dag-grid)
- [npm Package](https://www.npmjs.com/package/dag-grid)
