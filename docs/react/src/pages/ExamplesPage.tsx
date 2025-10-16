import { Box, Typography, Paper, Grid } from "@mui/material";
import { GridGraph } from "grid-graph";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface GraphCardProps {
  title: string;
  description: string;
  nodes: any[];
  edges: any[];
  composition?: "full" | "minimal" | "no-header" | "custom";
  customCode?: string;
}

function GraphCard({
  title,
  description,
  nodes,
  edges,
  composition = "full",
  customCode,
}: GraphCardProps) {
  let graphElement;
  let codeString;

  switch (composition) {
    case "minimal":
      graphElement = (
        <GridGraph nodes={nodes} edges={edges} style={{ width: "100%" }}>
          <GridGraph.Content>
            <GridGraph.Edges />
            <GridGraph.Nodes />
          </GridGraph.Content>
        </GridGraph>
      );
      codeString = `<GridGraph nodes={nodes} edges={edges} style={{ width: "100%" }}>
  <GridGraph.Content>
    <GridGraph.Edges />
    <GridGraph.Nodes />
  </GridGraph.Content>
</GridGraph>`;
      break;

    case "no-header":
      graphElement = (
        <GridGraph nodes={nodes} edges={edges} style={{ width: "100%" }} >
          <GridGraph.Content>
            <GridGraph.LaneLines />
            <GridGraph.RowBackgrounds />
            <GridGraph.Edges />
            <GridGraph.Nodes />
          </GridGraph.Content>
        </GridGraph>
      );
      codeString = `<GridGraph nodes={nodes} edges={edges} style={{ width: "100%" }}>
  <GridGraph.Content>
    <GridGraph.LaneLines />
    <GridGraph.RowBackgrounds />
    <GridGraph.Edges />
    <GridGraph.Nodes />
  </GridGraph.Content>
</GridGraph>`;
      break;

    case "custom":
      graphElement = (
        <GridGraph nodes={nodes} edges={edges} style={{ width: "100%" }}>
          <GridGraph.Header>
            <GridGraph.BranchNames />
          </GridGraph.Header>
          <GridGraph.Content>
            <GridGraph.RowBackgrounds />
            <GridGraph.Edges />
            <GridGraph.Nodes showLabels={false} />
          </GridGraph.Content>
        </GridGraph>
      );
      codeString =
        customCode ||
        `<GridGraph nodes={nodes} edges={edges} style={{ width: "100%" }}>
  <GridGraph.Header>
    <GridGraph.BranchNames />
  </GridGraph.Header>
  <GridGraph.Content>
    <GridGraph.RowBackgrounds />
    <GridGraph.Edges />
    <GridGraph.Nodes showLabels={false} />
  </GridGraph.Content>
</GridGraph>`;
      break;

    default: // 'full'
      graphElement = (
        <GridGraph nodes={nodes} edges={edges} style={{ width: "100%" }}>
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
      codeString = `<GridGraph nodes={nodes} edges={edges} style={{ width: "100%" }}>
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
</GridGraph>`;
  }

  const fullCode = `const nodes = ${JSON.stringify(nodes, null, 2)};

const edges = ${JSON.stringify(edges, null, 2)};

${codeString}`;

  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" paragraph color="text.secondary">
          {description}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
              Visual Output
            </Typography>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 1,
                p: 2,
                height: 500,
              }}
            >
              {graphElement}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
              Code
            </Typography>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 1,
                overflow: "auto",
                height: 500,
                "& pre": { margin: 0 },
              }}
            >
              <SyntaxHighlighter
                language="tsx"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              >
                {fullCode}
              </SyntaxHighlighter>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default function ExamplesPage() {
  const graphExamples = [
    {
      title: "Full Graph (All Components)",
      description:
        "Complete graph with all features: branch dots, branch names, lane lines, row backgrounds, edges, and node labels.",
      composition: "full" as const,
      nodes: [
        { id: "1", label: "Start", branch: "alpha" },
        { id: "2", label: "Process A" },
        { id: "3", label: "Process B", branch: "beta" },
        { id: "4", label: "Checkpoint" },
        { id: "5", label: "Process C", branch: "gamma" },
        { id: "6", label: "End" },
      ],
      edges: [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
        { id: "e3", source: "3", target: "4" },
        { id: "e4", source: "4", target: "5" },
        { id: "e5", source: "5", target: "6" },
      ],
    },
    {
      title: "Minimal Graph (Edges & Nodes Only)",
      description:
        "Stripped down to essentials - just edges and nodes, no header or background elements. Perfect for clean, simple visualizations.",
      composition: "minimal" as const,
      nodes: [
        { id: "1", label: "Initialize", branch: "main" },
        { id: "2", label: "Task A-1", branch: "thread-a" },
        { id: "3", label: "Task B-1", branch: "thread-b" },
        { id: "4", label: "Task A-2" },
        { id: "5", label: "Task C-1", branch: "thread-c" },
        { id: "6", label: "Synchronize", branch: "main" },
        { id: "7", label: "Finalize" },
      ],
      edges: [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "1", target: "3" },
        { id: "e3", source: "1", target: "5" },
        { id: "e4", source: "2", target: "4" },
        { id: "e5", source: "4", target: "6" },
        { id: "e6", source: "3", target: "6" },
        { id: "e7", source: "5", target: "6" },
        { id: "e8", source: "6", target: "7" },
      ],
    },
    {
      title: "No Header (Content Only)",
      description:
        "Graph with full content features (lanes, backgrounds, edges, nodes) but no header. Great when you don't need branch indicators.",
      composition: "no-header" as const,
      nodes: [
        { id: "core", label: "Core System", branch: "core" },
        { id: "mod-a", label: "Module A", branch: "modules" },
        { id: "mod-b", label: "Module B", branch: "module-b" },
        { id: "mod-c", label: "Module C", branch: "module-c" },
        { id: "api", label: "API Layer", branch: "external" },
        { id: "db", label: "Database", branch: "data" },
        { id: "logger", label: "Logging Service", branch: "utilities" },
      ],
      edges: [
        { id: "e1", source: "api", target: "core" },
        { id: "e2", source: "core", target: "mod-a" },
        { id: "e3", source: "core", target: "mod-b" },
        { id: "e4", source: "core", target: "mod-c" },
        { id: "e5", source: "mod-b", target: "db" },
        { id: "e6", source: "mod-a", target: "db" },
        { id: "e7", source: "core", target: "logger" },
      ],
    },
    {
      title: "Custom Composition (Names Only, No Labels)",
      description:
        "Shows branch names in header but hides node labels. Demonstrates selective component composition for custom layouts.",
      composition: "custom" as const,
      nodes: [
        { id: "a", label: "Node A", branch: "zone-1" },
        { id: "b", label: "Node B" },
        { id: "c", label: "Node C", branch: "zone-2" },
        { id: "d", label: "Node D" },
        { id: "e", label: "Node E", branch: "zone-2" },
        { id: "f", label: "Node F", branch: "zone-3" },
        { id: "g", label: "Node G" },
        { id: "h", label: "Node H", branch: "zone-1" },
      ],
      edges: [
        { id: "e1", source: "a", target: "b" },
        { id: "e2", source: "a", target: "c" },
        { id: "e3", source: "b", target: "d" },
        { id: "e4", source: "c", target: "e" },
        { id: "e5", source: "d", target: "f" },
        { id: "e6", source: "e", target: "f" },
        { id: "e7", source: "b", target: "e" },
        { id: "e8", source: "f", target: "g" },
        { id: "e9", source: "g", target: "h" },
        { id: "e10", source: "a", target: "h" },
      ],
    },
    {
      title: "AI Training Pipeline",
      description:
        "An AI model training workflow with parallel data processing and model comparison.",
      nodes: [
        { id: "collect", label: "Collect Data" },
        { id: "preprocess", label: "Preprocess" },
        { id: "feature-a", label: "Feature Set A" },
        { id: "feature-b", label: "Feature Set B", branch: "alt-features" },
        { id: "train-rf", label: "Train Random Forest" },
        { id: "train-nn", label: "Train Neural Net" },
        { id: "evaluate", label: "Evaluate Models", branch: "main" },
        { id: "select", label: "Select Best" },
        { id: "deploy", label: "Deploy" },
      ],
      edges: [
        { id: "e1", source: "collect", target: "preprocess" },
        { id: "e2", source: "preprocess", target: "feature-a" },
        { id: "e3", source: "preprocess", target: "feature-b" },
        { id: "e4", source: "feature-a", target: "train-rf" },
        { id: "e5", source: "feature-b", target: "train-nn" },
        { id: "e6", source: "train-rf", target: "evaluate" },
        { id: "e7", source: "train-nn", target: "evaluate" },
        { id: "e8", source: "evaluate", target: "select" },
        { id: "e9", source: "select", target: "deploy" },
      ],
    },
  ];

  return (
    <Box>
      <Typography variant="h3" gutterBottom fontWeight="bold">
        Component Composition Examples
      </Typography>
      <Typography
        variant="body1"
        paragraph
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        GridGraph uses compound components - you control what renders by
        choosing which components to include. These examples demonstrate
        different composition patterns.
      </Typography>

      <Grid container spacing={4}>
        {graphExamples.map((example) => (
          <GraphCard
            key={example.title}
            title={example.title}
            description={example.description}
            nodes={example.nodes}
            edges={example.edges}
            composition={example.composition}
          />
        ))}
      </Grid>
    </Box>
  );
}
