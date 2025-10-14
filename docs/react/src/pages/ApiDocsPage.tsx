import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function ReferencePage() {
  return (
    <Box>
      <Typography variant="h3" gutterBottom fontWeight="bold">
        API Reference
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Complete reference for GridGraph component props and configuration
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          GridGraph Props
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Prop</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Required</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
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
                <TableCell>visibility</TableCell>
                <TableCell>GraphVisibility</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Control visibility of graph elements</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>classNames</TableCell>
                <TableCell>GraphClassNames</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Custom CSS class names for styling</TableCell>
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
                <TableCell>Callback when branches are reordered</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>onSelect</TableCell>
                <TableCell>(id: string) =&gt; void</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Callback when a node is selected</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>verticalLabels</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Display branch labels vertically</TableCell>
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
                <TableCell><strong>Property</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Required</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
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
                <TableCell>Branch name (auto-detected from edges if not provided)</TableCell>
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
                <TableCell><strong>Property</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Required</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
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
                <TableCell><strong>Property</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Default</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
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

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          GraphVisibility Type
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Property</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Default</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>showBranchDots</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>true</TableCell>
                <TableCell>Show branch indicator dots in header</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>showBranchNames</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>true</TableCell>
                <TableCell>Show branch names in header</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>showLaneLines</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>true</TableCell>
                <TableCell>Show vertical lane lines</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>showEdges</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>true</TableCell>
                <TableCell>Show edges connecting nodes</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>showRowBackgrounds</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>true</TableCell>
                <TableCell>Show node background circles</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>showNodeLabels</TableCell>
                <TableCell>boolean</TableCell>
                <TableCell>true</TableCell>
                <TableCell>Show node labels</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
