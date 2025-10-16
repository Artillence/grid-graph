import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Box,
  Container,
  Tabs,
  Tab,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import IconButton from "@mui/material/IconButton";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExamplesPage from "./pages/ExamplesPage.js";
import PlaygroundPage from "./pages/PlaygroundPage.js";
import ReferencePage from "./pages/ReferencePage.js";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
  },
});

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathToTab: { [key: string]: number } = {
    "/": 0,
    "/examples": 1,
    "/playground": 2,
    "/reference": 3,
  };

  const tabToPath = ["/", "/examples", "/playground", "/reference"];

  const currentTab = pathToTab[location.pathname] ?? 0;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    navigate(tabToPath[newValue]);
  };

  const handleNavigate = (tabIndex: number) => {
    navigate(tabToPath[tabIndex]);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <img
            src="logo.svg"
            alt="Grid Graph logo"
            style={{ width: 28, height: 28 }}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Grid Graph
          </Typography>
          <IconButton
            color="inherit"
            href="https://github.com/Artillence/grid-graph"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </IconButton>
        </Toolbar>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ backgroundColor: "primary.dark" }}
        >
          <Tab label="Home" />
          <Tab label="Examples" />
          <Tab label="Playground" />
          <Tab label="Reference" />
        </Tabs>
      </AppBar>

      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/examples" element={<ExamplesPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/reference" element={<ReferencePage />} />
        </Routes>
      </Container>

      <Box
        component="footer"
        sx={{ py: 3, px: 2, mt: "auto", backgroundColor: "#f5f5f5" }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            Grid Graph - A React library for visualizing directed acyclic
            graphs
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/grid-graph/">
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
