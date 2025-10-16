# Grid Graph

React library for visualizing directed acyclic graphs with automatic branch detection and layout. Built with a composable compound component API.

## Features

- 🎨 **Composable API** - Control what renders through component composition
- 🎯 **Automatic branch detection** - Color-coded lanes with smart layout
- 🔄 **Interactive branch reordering** - Drag and drop branches
- 💅 **Fully customizable** - `className` props on every component
- 📦 **TypeScript support** - Fully typed
- ⚡ **Zero config** - Works out of the box with sensible defaults

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
    <GridGraph nodes={nodes} edges={edges}>
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

## Compound Components

Grid Graph uses a compound component pattern for maximum flexibility:

### Root

- `<GridGraph>` - Main container with context

### Layout

- `<GridGraph.Header>` - Header area for branch decorations
- `<GridGraph.Content>` - Main content area

### Header Components

- `<GridGraph.BranchDots>` - Branch indicator dots
- `<GridGraph.BranchNames>` - Branch labels

### Content Components

- `<GridGraph.LaneLines>` - Vertical lane lines
- `<GridGraph.RowBackgrounds>` - Row highlights
- `<GridGraph.Edges>` - Connection lines
- `<GridGraph.Nodes>` - Graph nodes

### Example: Minimal Graph

```tsx
<GridGraph nodes={nodes} edges={edges}>
  <GridGraph.Content>
    <GridGraph.Edges />
    <GridGraph.Nodes />
  </GridGraph.Content>
</GridGraph>
```

### Example: Custom Styling

```tsx
<GridGraph nodes={nodes} edges={edges} className="my-graph">
  <GridGraph.Header className="custom-header">
    <GridGraph.BranchDots />
    <GridGraph.BranchNames className="font-bold" />
  </GridGraph.Header>
  <GridGraph.Content>
    <GridGraph.LaneLines className="opacity-50" />
    <GridGraph.RowBackgrounds
      selectedClassName="bg-blue-100"
      hoveredClassName="bg-gray-50"
    />
    <GridGraph.Edges />
    <GridGraph.Nodes labelClassName="text-sm" showLabels={true} />
  </GridGraph.Content>
</GridGraph>
```

## Validation

- Nodes with multiple children: all but one child must have explicit `branch` property
- Nodes with multiple parents: must have explicit `branch` property
- Graph must be acyclic (DAG)

## Documentation

Full documentation and interactive examples: https://artillence.github.io/grid-graph/
