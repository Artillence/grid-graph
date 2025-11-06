import { Box, Typography, Paper, Grid } from "@mui/material";
import { GridGraph } from "grid-graph";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// Add custom CSS for non-wrapping labels
const styleElement = document.createElement('style');
styleElement.textContent = `
  .no-wrap-label {
    white-space: nowrap !important;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
if (!document.head.querySelector('style[data-grid-graph-examples]')) {
  styleElement.setAttribute('data-grid-graph-examples', 'true');
  document.head.appendChild(styleElement);
}

interface GraphCardProps {
  title: string;
  description: string;
  nodes: any[];
  edges: any[];
  composition?: "full" | "minimal" | "no-header" | "custom" | "auto-name";
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

  // The switch statement correctly sets up the visual element and its corresponding code string.
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
        <GridGraph nodes={nodes} edges={edges} style={{ width: "100%" }}>
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

    case "auto-name":
      graphElement = (
        <GridGraph
          nodes={nodes}
          edges={edges}
          autoBranches={{
            mergeCreatesBranch: false,
            nameBranch: (name) => {
              return name.toUpperCase();
            },
          }}
          style={{ width: "100%" }}
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
      codeString =
        customCode ||
        `<GridGraph nodes={nodes} edges={edges} autoBranches style={{ width: "100%" }}>
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
      break;

    default: // 'full'
      graphElement = (
        <GridGraph nodes={nodes} edges={edges}>
          <GridGraph.Header>
            <GridGraph.BranchDots />
            <GridGraph.BranchNames />
            <h2 style={{ 
              fontWeight: 'bold', 
              fontSize: '1rem',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0,
              flex: 1
            }}>
              {title}
            </h2>
          </GridGraph.Header>
          <GridGraph.Content>
            <GridGraph.LaneLines />
            <GridGraph.RowBackgrounds />
            <GridGraph.Edges />
            <GridGraph.Nodes labelClassName="no-wrap-label" />
          </GridGraph.Content>
        </GridGraph>
      );
      codeString = `<GridGraph nodes={nodes} edges={edges} style={{ width: "100%" }}>
  <GridGraph.Header>
    <GridGraph.BranchDots />
    <GridGraph.BranchNames />
    {/* The Header automatically aligns the first non-graph element. */}
    <h2 style={{ 
      fontWeight: 'bold', 
      fontSize: '1rem',
      margin: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '400px'
    }}>
      {title}
    </h2>
  </GridGraph.Header>
  <GridGraph.Content>
    <GridGraph.LaneLines />
    <GridGraph.RowBackgrounds />
    <GridGraph.Edges />
    <GridGraph.Nodes />
  </GridGraph.Content>
</GridGraph>`;
      break;
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
                resize: "both",
                overflow: "auto",
                minWidth: "200px",
                minHeight: "200px",
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
      title: "Full Graph",
      description:
        "Complete graph with all features, including a title in the header that is automatically aligned with the node labels.",
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
        { id: "d", label: "Node D", branch: "zone-1" },
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
      title: "Auto-Branches",
      description:
        "Using autoBranches mode, branches are automatically named after their first node. No need to specify branch properties on nodes!",
      composition: "auto-name" as const,
      nodes: [
        { id: "start", label: "Start" },
        { id: "task-1", label: "Task 1" },
        { id: "feature-x", label: "Feature X" },
        { id: "feature-y", label: "Feature Y" },
        { id: "test-x", label: "Test X" },
        { id: "test-y", label: "Test Y" },
        { id: "merge", label: "Merge" },
        { id: "deploy", label: "Deploy" },
      ],
      edges: [
        { id: "e1", source: "start", target: "task-1" },
        { id: "e2", source: "task-1", target: "feature-x" },
        { id: "e3", source: "task-1", target: "feature-y" },
        { id: "e4", source: "feature-x", target: "test-x" },
        { id: "e5", source: "feature-y", target: "test-y" },
        { id: "e6", source: "test-x", target: "merge" },
        { id: "e7", source: "test-y", target: "merge" },
        { id: "e8", source: "merge", target: "deploy" },
      ],
    },
    {
      title: "Review Cycle Workflow (Auto-Named with name transform)",
      description:
        "Multiple branches from a single node. Uses autoBranches to avoid manual branch naming - branches are automatically named after their first node.",
      composition: "auto-name" as const,
      nodes: [
        { id: "review_cycle", label: "Review Cycle Starts" },
        { id: "reviewer_pairings", label: "Reviewer Pairings" },
        { id: "questionnaires_sent", label: "Questionnaires Sent" },
        { id: "give_feedback", label: "Give Feedback" },
        { id: "review_conversation", label: "Review Conversation" },
      ],
      edges: [
        { id: "e1", source: "review_cycle", target: "reviewer_pairings" },
        { id: "e2", source: "review_cycle", target: "give_feedback" },
        {
          id: "e3",
          source: "reviewer_pairings",
          target: "review_conversation",
        },
        { id: "e4", source: "questionnaires_sent", target: "give_feedback" },
      ],
    },
    {
      title: "Long Title with Ellipsis",
      description:
        "Demonstrates how long titles and node labels are handled. The title is truncated with ellipsis after 70 characters, and one node label is even longer to show vertical space handling. ",
      composition: "full" as const,
      nodes: [
        { id: "1", label: "Initialize System Components and Configuration", branch: "main" },
        { id: "2", label: "This is an extremely long node label that demonstrates how the layout handles very long text content without breaking the visual structure of the graph, and nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nodand nod", branch: "feature-long" },
        { id: "3", label: "Process Step", branch: "feature-b" },
        { id: "4", label: "Final Step", branch: "main"},
      ],
      edges: [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "1", target: "3" },
        { id: "e3", source: "2", target: "4" },
        { id: "e4", source: "3", target: "4" },
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