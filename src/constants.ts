import { ResolvedGraphConfig, GraphVisibility, GraphClassNames } from "./types";

export type EdgePath = {
  id: string;
  path: string;
  color: string;
};

export const DEFAULT_CONFIG: Omit<ResolvedGraphConfig, "headerHeight"> = {
  rowHeight: 38,
  columnWidth: 18,
  nodeDiameter: 13,
  padding: 20,
  labelLeftMargin: 20,
  cornerRadius: 8,
  colors: [
    "#4ECDC4",
    "#FF6B6B",
    "#FED766",
    "#45B7D1",
    "#7CFFCB",
    "#F7B267",
    "#F4A261",
    "#E76F51",
  ],
};

export const DEFAULT_VISIBILITY: Required<GraphVisibility> = {
  showBranchDots: true,
  showBranchNames: true,
  showLaneLines: true,
  showEdges: true,
  showNodeBackgrounds: true,
  showNodeLabels: true,
};

export const DEFAULT_CLASSNAMES: Required<GraphClassNames> = {
  container: "relative font-sans",
  nodeLabel: "text-sm",
  nodeLabelSelected: "font-semibold",
  nodeBackground: "pointer-events-none rounded-md transition-all duration-150",
  nodeBackgroundSelected: "bg-blue-100",
  nodeBackgroundHovered: "bg-gray-100",
  branchLabel: "absolute rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 transition-all duration-300",
  laneLine: "absolute top-0 bottom-0 border-l-2 border-dashed border-slate-200 transition-all duration-300",
};
