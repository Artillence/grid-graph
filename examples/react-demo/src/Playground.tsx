import { useState } from "react";
import { DagGrid } from "dag-grid";

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

export default function Playground() {
  const [branchOrder, setBranchOrder] = useState<string[]>([]);
  
  // Visibility toggles
  const [showBranchDots, setShowBranchDots] = useState(true);
  const [showBranchNames, setShowBranchNames] = useState(true);
  const [showLaneLines, setShowLaneLines] = useState(true);
  const [showEdges, setShowEdges] = useState(true);
  const [showNodeBackgrounds, setShowNodeBackgrounds] = useState(true);
  const [showNodeLabels, setShowNodeLabels] = useState(true);
  const [verticalLabels, setVerticalLabels] = useState(true);
  
  // Config options
  const [rowHeight, setRowHeight] = useState(38);
  const [columnWidth, setColumnWidth] = useState(18);
  const [nodeDiameter, setNodeDiameter] = useState(13);
  const [padding, setPadding] = useState(20);
  const [labelLeftMargin, setLabelLeftMargin] = useState(20);
  const [cornerRadius, setCornerRadius] = useState(8);
  
  // JSON editor
  const [nodesJson, setNodesJson] = useState(JSON.stringify(defaultNodes, null, 2));
  const [edgesJson, setEdgesJson] = useState(JSON.stringify(defaultEdges, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [nodes, setNodes] = useState(defaultNodes);
  const [edges, setEdges] = useState(defaultEdges);

  const handleNodesChange = (value: string) => {
    setNodesJson(value);
    try {
      const parsed = JSON.parse(value);
      setNodes(parsed);
      setJsonError(null);
    } catch (e) {
      setJsonError(`Nodes JSON error: ${(e as Error).message}`);
    }
  };

  const handleEdgesChange = (value: string) => {
    setEdgesJson(value);
    try {
      const parsed = JSON.parse(value);
      setEdges(parsed);
      setJsonError(null);
    } catch (e) {
      setJsonError(`Edges JSON error: ${(e as Error).message}`);
    }
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">DAG Grid Playground</h1>
        <p className="text-sm text-gray-600">Experiment with different configurations and data</p>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Graph Preview */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Preview</h3>
              {jsonError && (
                <div className="px-3 py-1 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                  {jsonError}
                </div>
              )}
            </div>
            <div className="border border-gray-200 rounded p-4 bg-gray-50 overflow-auto">
              <DagGrid
                key={`${rowHeight}-${columnWidth}-${nodeDiameter}-${padding}-${labelLeftMargin}-${cornerRadius}`}
                nodes={nodes}
                edges={edges}
                branchOrder={branchOrder}
                onReorderBranches={setBranchOrder}
                verticalLabels={verticalLabels}
                config={{
                  rowHeight,
                  columnWidth,
                  nodeDiameter,
                  padding,
                  labelLeftMargin,
                  cornerRadius,
                }}
                visibility={{
                  showBranchDots,
                  showBranchNames,
                  showLaneLines,
                  showEdges,
                  showNodeBackgrounds,
                  showNodeLabels,
                }}
              >
                <DagGrid.Header />
                <DagGrid.Content />
              </DagGrid>
            </div>
          </div>
        </div>

        {/* Right Panel - Controls */}
        <div className="w-96 border-l border-gray-200 bg-white overflow-auto">
          <div className="p-6 space-y-6">
            {/* Visibility Options */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Visibility Options</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBranchDots}
                    onChange={(e) => setShowBranchDots(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Branch Dots</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBranchNames}
                    onChange={(e) => setShowBranchNames(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Branch Names</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLaneLines}
                    onChange={(e) => setShowLaneLines(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Lane Lines</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEdges}
                    onChange={(e) => setShowEdges(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Edges</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNodeBackgrounds}
                    onChange={(e) => setShowNodeBackgrounds(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Node Backgrounds</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNodeLabels}
                    onChange={(e) => setShowNodeLabels(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Node Labels</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verticalLabels}
                    onChange={(e) => setVerticalLabels(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Vertical Branch Labels</span>
                </label>
              </div>
            </div>

            {/* Layout Config */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Layout Configuration</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Row Height: {rowHeight}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    value={rowHeight}
                    onChange={(e) => setRowHeight(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Column Width: {columnWidth}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={columnWidth}
                    onChange={(e) => setColumnWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Node Diameter: {nodeDiameter}px
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="30"
                    value={nodeDiameter}
                    onChange={(e) => setNodeDiameter(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Padding: {padding}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={padding}
                    onChange={(e) => setPadding(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label Margin: {labelLeftMargin}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={labelLeftMargin}
                    onChange={(e) => setLabelLeftMargin(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Corner Radius: {cornerRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={cornerRadius}
                    onChange={(e) => setCornerRadius(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* JSON Editor */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Data (JSON)</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nodes
                  </label>
                  <textarea
                    value={nodesJson}
                    onChange={(e) => handleNodesChange(e.target.value)}
                    className="w-full h-40 p-2 font-mono text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    spellCheck={false}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edges
                  </label>
                  <textarea
                    value={edgesJson}
                    onChange={(e) => handleEdgesChange(e.target.value)}
                    className="w-full h-32 p-2 font-mono text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
