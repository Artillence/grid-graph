import { ResolvedGraphConfig } from "./types";

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
