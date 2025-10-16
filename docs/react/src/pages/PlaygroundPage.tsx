import { useState, Component } from "react";
import type { ReactNode } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Slider,
  FormControlLabel,
  Switch,
  Alert,
} from "@mui/material";
import { GridGraph } from "grid-graph";

interface ErrorBoundaryProps {
  children: ReactNode;
  onError: (error: string | null) => void;
  resetKey: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error.message);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
      this.props.onError(null);
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

interface GraphWithErrorHandlingProps {
  nodes: any[];
  edges: any[];
  branchOrder: string[];
  onReorderBranches: (order: string[]) => void;
  verticalLabels: boolean;
  rowHeight: number;
  columnWidth: number;
  nodeDiameter: number;
  padding: number;
  cornerRadius: number;
  showBranchDots: boolean;
  showBranchNames: boolean;
  showLaneLines: boolean;
  showEdges: boolean;
  showRowBackgrounds: boolean;
  showNodeLabels: boolean;
  onError: (error: string | null) => void;
}

function GraphWithErrorHandling(props: GraphWithErrorHandlingProps) {
  const {
    nodes,
    edges,
    branchOrder,
    onReorderBranches,
    verticalLabels,
    rowHeight,
    columnWidth,
    nodeDiameter,
    padding,
    cornerRadius,
    showBranchDots,
    showBranchNames,
    showLaneLines,
    showEdges,
    showRowBackgrounds,
    showNodeLabels,
    onError,
  } = props;

  const resetKey = JSON.stringify({ nodes, edges });

  return (
    <ErrorBoundary onError={onError} resetKey={resetKey}>
      <GridGraph
        nodes={nodes}
        edges={edges}
        branchOrder={branchOrder}
        onReorderBranches={onReorderBranches}
        verticalLabels={verticalLabels}
        config={{
          rowHeight,
          columnWidth,
          nodeDiameter,
          padding,
          cornerRadius,
        }}
      >
        <GridGraph.Header>
          {showBranchDots && <GridGraph.BranchDots />}
          {showBranchNames && <GridGraph.BranchNames />}
        </GridGraph.Header>
        <GridGraph.Content>
          {showLaneLines && <GridGraph.LaneLines />}
          {showRowBackgrounds && <GridGraph.RowBackgrounds />}
          {showEdges && <GridGraph.Edges />}
          <GridGraph.Nodes showLabels={showNodeLabels} />
        </GridGraph.Content>
      </GridGraph>
    </ErrorBoundary>
  );
}

const defaultNodes = [
  { id: "1", label: "Start", branch: "main" },
  { id: "2", label: "Process A" },
  { id: "3a", label: "Feature A", branch: "feature-a" },
  { id: "3b", label: "Feature B", branch: "feature-b" },
  { id: "4", label: "Merge", branch: "main" },
  { id: "5", label: "End" },
];

const defaultEdges = [
  { id: "e1", source: "1", target: "2" },
  { id: "e2", source: "2", target: "3a" },
  { id: "e3", source: "2", target: "3b" },
  { id: "e4", source: "3a", target: "4" },
  { id: "e5", source: "3b", target: "4" },
  { id: "e6", source: "4", target: "5" },
];

export default function PlaygroundPage() {
  const [branchOrder, setBranchOrder] = useState<string[]>([]);
  const [nodesJson, setNodesJson] = useState(
    JSON.stringify(defaultNodes, null, 2),
  );
  const [edgesJson, setEdgesJson] = useState(
    JSON.stringify(defaultEdges, null, 2),
  );
  const [nodes, setNodes] = useState(defaultNodes);
  const [edges, setEdges] = useState(defaultEdges);
  const [error, setError] = useState<string | null>(null);

  // Config
  const [rowHeight, setRowHeight] = useState(38);
  const [columnWidth, setColumnWidth] = useState(18);
  const [nodeDiameter, setNodeDiameter] = useState(13);
  const [padding, setPadding] = useState(20);
  const [cornerRadius, setCornerRadius] = useState(8);

  // Visibility
  const [showBranchDots, setShowBranchDots] = useState(true);
  const [showBranchNames, setShowBranchNames] = useState(true);
  const [showLaneLines, setShowLaneLines] = useState(true);
  const [showEdges, setShowEdges] = useState(true);
  const [showRowBackgrounds, setshowRowBackgrounds] = useState(true);
  const [showNodeLabels, setShowNodeLabels] = useState(true);
  const [verticalLabels, setVerticalLabels] = useState(true);

  const handleNodesChange = (value: string) => {
    setNodesJson(value);
    try {
      const parsed = JSON.parse(value);
      setNodes(parsed);
      setError(null);
    } catch (e) {
      setError(`Nodes JSON error: ${(e as Error).message}`);
    }
  };

  const handleEdgesChange = (value: string) => {
    setEdgesJson(value);
    try {
      const parsed = JSON.parse(value);
      setEdges(parsed);
      setError(null);
    } catch (e) {
      setError(`Edges JSON error: ${(e as Error).message}`);
    }
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom fontWeight="bold">
        Playground
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Experiment with different configurations and data
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 1,
                p: 2,
                bgcolor: "#fafafa",
              }}
            >
              <GraphWithErrorHandling
                nodes={nodes}
                edges={edges}
                branchOrder={branchOrder}
                onReorderBranches={setBranchOrder}
                verticalLabels={verticalLabels}
                rowHeight={rowHeight}
                columnWidth={columnWidth}
                nodeDiameter={nodeDiameter}
                padding={padding}
                cornerRadius={cornerRadius}
                showBranchDots={showBranchDots}
                showBranchNames={showBranchNames}
                showLaneLines={showLaneLines}
                showEdges={showEdges}
                showRowBackgrounds={showRowBackgrounds}
                showNodeLabels={showNodeLabels}
                onError={setError}
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Data
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  label="Nodes JSON"
                  value={nodesJson}
                  onChange={(e) => handleNodesChange(e.target.value)}
                  sx={{ fontFamily: "monospace" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  label="Edges JSON"
                  value={edgesJson}
                  onChange={(e) => handleEdgesChange(e.target.value)}
                  sx={{ fontFamily: "monospace" }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configuration
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>Row Height: {rowHeight}</Typography>
              <Slider
                value={rowHeight}
                onChange={(_, v) => setRowHeight(v as number)}
                min={20}
                max={80}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>Column Width: {columnWidth}</Typography>
              <Slider
                value={columnWidth}
                onChange={(_, v) => setColumnWidth(v as number)}
                min={10}
                max={40}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>
                Node Diameter: {nodeDiameter}
              </Typography>
              <Slider
                value={nodeDiameter}
                onChange={(_, v) => setNodeDiameter(v as number)}
                min={8}
                max={30}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>Padding: {padding}</Typography>
              <Slider
                value={padding}
                onChange={(_, v) => setPadding(v as number)}
                min={0}
                max={50}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>
                Corner Radius: {cornerRadius}
              </Typography>
              <Slider
                value={cornerRadius}
                onChange={(_, v) => setCornerRadius(v as number)}
                min={0}
                max={20}
              />
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Component Visibility
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Toggle individual components on/off
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={showBranchDots}
                  onChange={(e) => setShowBranchDots(e.target.checked)}
                />
              }
              label="Branch Dots"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showBranchNames}
                  onChange={(e) => setShowBranchNames(e.target.checked)}
                />
              }
              label="Branch Names"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showLaneLines}
                  onChange={(e) => setShowLaneLines(e.target.checked)}
                />
              }
              label="Lane Lines"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showEdges}
                  onChange={(e) => setShowEdges(e.target.checked)}
                />
              }
              label="Edges"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showRowBackgrounds}
                  onChange={(e) => setshowRowBackgrounds(e.target.checked)}
                />
              }
              label="Row Backgrounds"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showNodeLabels}
                  onChange={(e) => setShowNodeLabels(e.target.checked)}
                />
              }
              label="Node Labels"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={verticalLabels}
                  onChange={(e) => setVerticalLabels(e.target.checked)}
                />
              }
              label="Vertical Labels"
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
