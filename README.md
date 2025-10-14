# Grid Graph

React library for visualizing directed acyclic graphs with automatic branch detection and layout.

## Features

- Automatic branch detection with color-coded lanes
- Interactive branch reordering
- TypeScript support
- Customizable

## Installation

```bash
npm install grid-graph
```

## Quick Start

```tsx
import { GridGraph } from 'grid-graph';
import 'grid-graph/styles.css';

const nodes = [
  { id: '1', label: 'Start', branch: 'main' },
  { id: '2', label: 'Feature', branch: 'feature' },
  { id: '3', label: 'Merge', branch: 'main' },
];

const edges = [
  { id: 'e1', source: '1', target: '2' },
  { id: 'e2', source: '2', target: '3' },
];

function App() {
  return (
    <GridGraph nodes={nodes} edges={edges}>
      <GridGraph.Header />
      <GridGraph.Content />
    </GridGraph>
  );
}
```

## Validation

- Nodes with multiple children: all but one child must have explicit `branch` property
- Nodes with multiple parents: must have explicit `branch` property
- Graph must be acyclic

## Documentation

https://artillence.github.io/grid-graph/
