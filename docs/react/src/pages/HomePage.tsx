import {
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import GitHubIcon from "@mui/icons-material/GitHub";
import { GridGraph } from "grid-graph";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const quickStartNodes = [
  { id: "1", label: "Initial", branch: "main" },
  { id: "2", label: "Feature A", branch: "feature-a" },
  { id: "3", label: "Feature B", branch: "feature-b" },
  { id: "4", label: "Complete A" },
  { id: "5", label: "Merge", branch: "main" },
  { id: "6", label: "Hotfix", branch: "hotfix" },
  { id: "7", label: "Fix Applied" },
];

const quickStartEdges = [
  { id: "e1", source: "1", target: "2" },
  { id: "e2", source: "2", target: "4" },
  { id: "e3", source: "4", target: "5" },
  { id: "e4", source: "1", target: "3" },
  { id: "e5", source: "3", target: "5" },
  { id: "e6", source: "6", target: "7" },
];

interface HomePageProps {
  onNavigate: (tab: number) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Grid Graph
        </Typography>
        <Typography variant="h5" color="text.secondary">
          A React library for visualizing graphs inspired by VSCode Git Graph
        </Typography>
        <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<CodeIcon />}
            onClick={() => onNavigate(1)}
          >
            View Examples
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<GitHubIcon />}
            href="https://github.com/Artillence/grid-graph"
            target="_blank"
          >
            GitHub
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 4, mb: 6 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Quick Start
        </Typography>

        <Typography variant="body1" paragraph>
          Install the package:
        </Typography>
                
        <SyntaxHighlighter 
          language="bash" 
          style={vscDarkPlus}
          customStyle={{ marginBottom: '24px', borderRadius: '4px' }}
        >
          npm install grid-graph
        </SyntaxHighlighter>
        

        <Typography variant="body1" paragraph>
          Use it in your React app:
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
        </Typography>
        <Box sx={{ p: 3, border: "1px solid #ddd", borderRadius: 1, mb: 4, bgcolor: "#fafafa" }}>
          <GridGraph nodes={quickStartNodes} edges={quickStartEdges}>
            <GridGraph.Header />
            <GridGraph.Content />
          </GridGraph>
        </Box>



        <Typography variant="body1" paragraph>
        </Typography>
        <SyntaxHighlighter 
          language="typescript" 
          style={vscDarkPlus}
          customStyle={{ borderRadius: '4px' }}
        >
{`import { GridGraph } from 'grid-graph';
import 'grid-graph/styles.css';

const nodes = [
  { id: '1', label: 'Initial', branch: 'main' },
  { id: '2', label: 'Feature A', branch: 'feature-a' },
  { id: '3', label: 'Feature B', branch: 'feature-b' },
  { id: '4', label: 'Complete A' },
  { id: '5', label: 'Merge', branch: 'main' },
  { id: '6', label: 'Hotfix', branch: 'hotfix' },
  { id: '7', label: 'Fix Applied' },
];

const edges = [
  { id: 'e1', source: '1', target: '2' },
  { id: 'e2', source: '2', target: '4' },
  { id: 'e3', source: '4', target: '5' },
  { id: 'e4', source: '1', target: '3' },
  { id: 'e5', source: '3', target: '5' },
  { id: 'e6', source: '6', target: '7' },
];

function App() {
  return (
    <GridGraph nodes={nodes} edges={edges}>
      <GridGraph.Header />
      <GridGraph.Content />
    </GridGraph>
  );
}`}
        </SyntaxHighlighter>
      </Paper>
    </Box>
  );
}