import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function ReferencePage() {
  return (
    <Box>
      <Typography variant="h3" gutterBottom fontWeight="bold">
        API Reference
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Complete reference for GridGraph compound components and configuration
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          GridGraph (Root Component)
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Prop</strong>
                </TableCell>
                <TableCell>
                  <strong>Type</strong>
                </TableCell>
                <TableCell>
                  <strong>Required</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>nodes</TableCell>
                <TableCell>Node[]</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Array of node objects</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>edges</TableCell>
                <TableCell>Edge[]</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Array of edge objects connecting nodes</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>config</TableCell>
                <TableCell>GraphConfig</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Configuration for dimensions and styling</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>className</TableCell>
                <TableCell>string</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Custom CSS class for root container</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>branchOrder</TableCell>
                <TableCell>string[]</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Array of branch names in desired order</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>onReorderBranches</TableCell>
                <TableCell>(order: string[]) =&gt; void</TableCell>
                <TableCell>No</TableCell>
                <TableCell>
                  Callback when branches are reordered (enables drag)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>onClick</TableCell>
                <TableCell>(id: string) =&gt; void</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Callback when a node is clicked</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>onNodeDoubleClick</TableCell>
                <TableCell>(id: string) =&gt; void</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Callback when a node is double-clicked</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>onNodeContextMenu</TableCell>
                <TableCell>(id: string, event: MouseEvent) =&gt; void</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Callback when a node is right-clicked</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>onNodeMouseOver</TableCell>
                <TableCell>(id: string) =&gt; void</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Callback when mouse enters a node</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>onNodeMouseOut</TableCell>
                <TableCell>(id: string) =&gt; void</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Callback when mouse leaves a node</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>selectedNodeId</TableCell>
                <TableCell>string | null</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Controlled selected node ID</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>onSelectedNodeChange</TableCell>
                <TableCell>(id: string | null) =&gt; void</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Callback when selected node changes (controlled mode)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>verticalLabels</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>No</TableCell>
                <TableCell>
                  Display branch labels vertically (default: true)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>autoBranches</TableCell>
                <TableCell>boolean | AutoBranchConfig</TableCell>
                <TableCell>No</TableCell>
                <TableCell>
                  Enable auto-naming of branches. When true, uses default behavior (merges create branches, names from first node). 
                  Pass AutoBranchConfig object to customize: mergeCreatesBranch (boolean) and nameBranch function
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>style</TableCell>
                <TableCell>React.CSSProperties</TableCell>
                <TableCell>No</TableCell>
                <TableCell>
                  Custom inline styles for the root container
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          AutoBranchConfig
        </Typography>
        <Typography variant="body2" paragraph color="text.secondary">
          Configuration object for auto-branch behavior
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Property</strong>
                </TableCell>
                <TableCell>
                  <strong>Type</strong>
                </TableCell>
                <TableCell>
                  <strong>Default</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>mergeCreatesBranch</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>true</TableCell>
                <TableCell>
                  Whether merge nodes (nodes with multiple parents) create new branches. 
                  When false, merge continues on the parent branch with shortest remaining depth.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>nameBranch</TableCell>
                <TableCell>(firstNodeId: string, nodeMap: Map&lt;string, Node&gt;) =&gt; string</TableCell>
                <TableCell>(id) =&gt; id.toLowerCase()</TableCell>
                <TableCell>
                  Function to generate branch names.
                  Receives the first node's ID and a map of all nodes. Must return unique branch names.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Compound Components
        </Typography>
        <Typography
          variant="body2"
          paragraph
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          GridGraph uses a compound component pattern. Compose the graph by
          rendering only the components you need. All components accept{" "}
          <code>className</code> and <code>style</code> props.
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Component</strong>
                </TableCell>
                <TableCell>
                  <strong>Props</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>GridGraph.Header</TableCell>
                <TableCell>className?, style?, onClick?, children?</TableCell>
                <TableCell>Header container for branch decorations. Pass onClick to make it clickable.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GridGraph.Content</TableCell>
                <TableCell>className?, style?, children?</TableCell>
                <TableCell>Main content container for graph elements</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GridGraph.BranchDots</TableCell>
                <TableCell>className?, style?</TableCell>
                <TableCell>Branch indicator dots (use in Header)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GridGraph.BranchNames</TableCell>
                <TableCell>className?, style?</TableCell>
                <TableCell>Branch name labels (use in Header)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GridGraph.LaneLines</TableCell>
                <TableCell>className?, style?</TableCell>
                <TableCell>Vertical lane lines (use in Content)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GridGraph.RowBackgrounds</TableCell>
                <TableCell>
                  className?, style?, selectedClassName?, hoveredClassName?
                </TableCell>
                <TableCell>
                  Row background highlights (use in Content)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GridGraph.Edges</TableCell>
                <TableCell>className?, style?, pathClassName?</TableCell>
                <TableCell>
                  Connection lines between nodes (use in Content)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GridGraph.Nodes</TableCell>
                <TableCell>
                  className?, style?, showLabels?, labelClassName?, selectedLabelClassName?
                </TableCell>
                <TableCell>
                  Graph nodes with optional labels (use in Content)
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Node Type
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Property</strong>
                </TableCell>
                <TableCell>
                  <strong>Type</strong>
                </TableCell>
                <TableCell>
                  <strong>Required</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell>string</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Unique identifier for the node</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>label</TableCell>
                <TableCell>string | ReactNode</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Label text or custom React component</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>branch</TableCell>
                <TableCell>string</TableCell>
                <TableCell>No</TableCell>
                <TableCell>
                  Branch name (auto-detected from edges if not provided)
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Edge Type
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Property</strong>
                </TableCell>
                <TableCell>
                  <strong>Type</strong>
                </TableCell>
                <TableCell>
                  <strong>Required</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell>string</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Unique identifier for the edge</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>source</TableCell>
                <TableCell>string</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>ID of the source node</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>target</TableCell>
                <TableCell>string</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>ID of the target node</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          GraphConfig Type
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Property</strong>
                </TableCell>
                <TableCell>
                  <strong>Type</strong>
                </TableCell>
                <TableCell>
                  <strong>Default</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>rowHeight</TableCell>
                <TableCell>number</TableCell>
                <TableCell>38</TableCell>
                <TableCell>Height of each row in pixels</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>columnWidth</TableCell>
                <TableCell>number</TableCell>
                <TableCell>18</TableCell>
                <TableCell>Width of each column/lane in pixels</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>nodeDiameter</TableCell>
                <TableCell>number</TableCell>
                <TableCell>13</TableCell>
                <TableCell>Diameter of node circles in pixels</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>padding</TableCell>
                <TableCell>number</TableCell>
                <TableCell>20</TableCell>
                <TableCell>Padding around the graph in pixels</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>labelLeftMargin</TableCell>
                <TableCell>number</TableCell>
                <TableCell>20</TableCell>
                <TableCell>Left margin for node labels in pixels</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>cornerRadius</TableCell>
                <TableCell>number</TableCell>
                <TableCell>8</TableCell>
                <TableCell>Radius of edge path corners in pixels</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>colors</TableCell>
                <TableCell>string[]</TableCell>
                <TableCell>Built-in palette</TableCell>
                <TableCell>Array of colors for branches</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
