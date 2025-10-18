# Grid Graph

React library for visualizing directed acyclic graphs with automatic branch detection and layout.

## Features

- 🎨 Composable component API
- 🎯 Automatic branch detection and color-coded lanes
- 🖱️ Rich event handling (click, double-click, context menu, hover)
- 🎛️ Controlled & uncontrolled selection modes
- 🔄 Drag-and-drop branch reordering
- 💅 Fully customizable with className/style props
- 📦 TypeScript support

## Installation

```bash
npm install @artillence/grid-graph
```

## Quick Start

```tsx
import { GridGraph } from "@artillence/grid-graph";

const nodes = [
  { id: "1", label: "Start", branch: "main" },
  { id: "2", label: "Feature", branch: "feature" },
  { id: "3", label: "Merge", branch: "main" },
];

const edges = [
  { id: "e1", source: "1", target: "2" },
  { id: "e2", source: "2", target: "3" },
];

function App() {
  return (
    <GridGraph 
      nodes={nodes} 
      edges={edges}
      onClick={(id) => console.log('Clicked:', id)}
    >
      <GridGraph.Header>
        <GridGraph.BranchDots />
        <GridGraph.BranchNames />
      </GridGraph.Header>
      <GridGraph.Content>
        <GridGraph.LaneLines />
        <GridGraph.RowBackgrounds />
        <GridGraph.Edges />
        <GridGraph.Nodes />
      </GridGraph.Content>
    </GridGraph>
  );
}
```

## Components

**Layout:**
- `<GridGraph>` - Root container
- `<GridGraph.Header>` - Header for branch decorations (add `onClick` to make clickable)
- `<GridGraph.Content>` - Main content area

**Header:**
- `<GridGraph.BranchDots>` - Branch indicator dots
- `<GridGraph.BranchNames>` - Branch labels

**Content:**
- `<GridGraph.LaneLines>` - Vertical lane lines
- `<GridGraph.RowBackgrounds>` - Row highlights
- `<GridGraph.Edges>` - Connection lines
- `<GridGraph.Nodes>` - Graph nodes with labels

All components accept `className` and `style` props.

## Key Props

### GridGraph
- `nodes`, `edges` - Graph data (required)
- `onClick` - Node click handler
- `onNodeDoubleClick`, `onNodeContextMenu`, `onNodeMouseOver`, `onNodeMouseOut` - Event handlers
- `selectedNodeId`, `onSelectedNodeChange` - Controlled selection
- `onReorderBranches` - Enable drag-and-drop branch ordering
- `autoBranches` - Auto-name branches (no need for `branch` property on nodes)
- `config` - Customize dimensions, colors, etc.

### Example: Controlled Selection

```tsx
const [selected, setSelected] = useState<string | null>(null);

<GridGraph
  nodes={nodes}
  edges={edges}
  selectedNodeId={selected}
  onSelectedNodeChange={setSelected}
>
  {/* ... */}
</GridGraph>
```

### Example: Auto Branches

```tsx
// No need to specify branch property!
<GridGraph 
  nodes={[
    { id: "1", label: "Start" },
    { id: "2", label: "Feature" },
  ]} 
  edges={edges}
  autoBranches={true}
>
  {/* ... */}
</GridGraph>
```

## Documentation

Full documentation and interactive examples: [https://artillence.github.io/grid-graph/](https://artillence.github.io/grid-graph/)

## License

MIT
