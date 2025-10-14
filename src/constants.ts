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
  container: "gg__container",
  nodeLabel: "gg__node-label",
  nodeLabelSelected: "gg__node-label-selected",
  nodeBackground: "gg__node-background",
  nodeBackgroundSelected: "gg__node-background-selected",
  nodeBackgroundHovered: "gg__node-background-hovered",
  branchLabel: "gg__branch-label",
  laneLine: "gg__lane-line",
};
