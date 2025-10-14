import { Box, Typography, Paper, Grid } from '@mui/material';
import { GridGraph } from 'grid-graph';

interface GraphCardProps {
  title: string;
  description: string;
  nodes: any[];
  edges: any[];
}

function GraphCard({ title, description, nodes, edges }: GraphCardProps) {
  return (
    <Grid item xs={12} lg={6}>
      <Paper
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" paragraph color="text.secondary">
          {description}
        </Typography>
        <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2, flexGrow: 1 }}>
          <GridGraph nodes={nodes} edges={edges}>
            <GridGraph.Header />
            <GridGraph.Content />
          </GridGraph>
        </Box>
      </Paper>
    </Grid>
  );
}

export default function ExamplesPage() {
  const graphExamples = [
    {
      title: 'Linear Flow',
      description: 'A simple, sequential process where each step follows the last. Ideal for showing linear workflows.',
      nodes: [
        { id: '1', label: 'Start', branch: 'alpha' },
        { id: '2', label: 'Process A' },
        { id: '3', label: 'Process B', branch: 'beta' },
        { id: '4', label: 'Checkpoint' },
        { id: '5', label: 'Process C', branch: 'gamma' },
        { id: '6', label: 'End' },
      ],
      edges: [
        { id: 'e1', source: '1', target: '2' },
        { id: 'e2', source: '2', target: '3' },
        { id: 'e3', source: '3', target: '4' },
        { id: 'e4', source: '4', target: '5' },
        { id: 'e5', source: '5', target: '6' },
      ],
    },
    {
      title: 'Parallel Workflows',
      description: 'Demonstrates a process that splits into multiple parallel tracks and later converges.',
      nodes: [
        { id: '1', label: 'Initialize', branch: 'main' },
        { id: '2', label: 'Task A-1', branch: 'thread-a' },
        { id: '3', label: 'Task B-1', branch: 'thread-b' },
        { id: '4', label: 'Task A-2' },
        { id: '5', label: 'Task C-1', branch: 'thread-c' },
        { id: '6', label: 'Synchronize', branch: 'main' },
        { id: '7', label: 'Finalize' },
      ],
      edges: [
        { id: 'e1', source: '1', target: '2' },
        { id: 'e2', source: '1', target: '3' },
        { id: 'e3', source: '1', target: '5' },
        { id: 'e4', source: '2', target: '4' },
        { id: 'e5', source: '4', target: '6' },
        { id: 'e6', source: '3', target: '6' },
        { id: 'e7', source: '5', target: '6' },
        { id: 'e8', source: '6', target: '7' },
      ],
    },
    {
      title: 'Hub & Spoke Model',
      description: 'Visualizes a central hub connected to several satellite nodes, a common pattern in system design.',
      nodes: [
        { id: 'core', label: 'Core System', branch: 'core' },
        { id: 'mod-a', label: 'Module A', branch: 'modules' },
        { id: 'mod-b', label: 'Module B', branch: 'module-b' },
        { id: 'mod-c', label: 'Module C', branch: 'module-c' },
        { id: 'api', label: 'API Layer', branch: 'external' },
        { id: 'db', label: 'Database', branch: 'data' },
        { id: 'logger', label: 'Logging Service', branch: 'utilities' },
      ],
      edges: [
        { id: 'e1', source: 'api', target: 'core' },
        { id: 'e2', source: 'core', target: 'mod-a' },
        { id: 'e3', source: 'core', target: 'mod-b' },
        { id: 'e4', source: 'core', target: 'mod-c' },
        { id: 'e5', source: 'mod-b', target: 'db' },
        { id: 'e6', source: 'mod-a', target: 'db' },
        { id: 'e7', source: 'core', target: 'logger' },
      ],
    },
    {
      title: 'Complex Mesh Network',
      description: 'A highly interconnected graph with multiple paths, showcasing the layout of complex relationships.',
      nodes: [
        { id: 'a', label: 'Node A', branch: 'zone-1' },
        { id: 'b', label: 'Node B' },
        { id: 'c', label: 'Node C', branch: 'zone-2' },
        { id: 'd', label: 'Node D' },
        { id: 'e', label: 'Node E', branch: 'zone-2' },
        { id: 'f', label: 'Node F', branch: 'zone-3' },
        { id: 'g', label: 'Node G' },
        { id: 'h', label: 'Node H', branch: 'zone-1' },
      ],
      edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'a', target: 'c' },
        { id: 'e3', source: 'b', target: 'd' },
        { id: 'e4', source: 'c', target: 'e' },
        { id: 'e5', source: 'd', target: 'f' },
        { id: 'e6', source: 'e', target: 'f' },
        { id: 'e7', source: 'b', target: 'e' },
        { id: 'e8', source: 'f', target: 'g' },
        { id: 'e9', source: 'g', target: 'h' },
        { id: 'e10', source: 'a', target: 'h' },
      ],
    },
  ];

  return (
    <Box>
      <Typography variant="h3" gutterBottom fontWeight="bold">
        Graph Structures
      </Typography>

      <Grid container spacing={4}>
        {graphExamples.map((example) => (
          <GraphCard
            key={example.title}
            title={example.title}
            description={example.description}
            nodes={example.nodes}
            edges={example.edges}
          />
        ))}
      </Grid>
    </Box>
  );
}