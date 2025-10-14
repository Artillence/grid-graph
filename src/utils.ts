import { ResolvedGraphConfig } from "./types";

export function getLaneXPosition(
  columnIndex: number,
  config: ResolvedGraphConfig,
): number {
  return (
    columnIndex * config.columnWidth +
    config.padding / 2 +
    config.nodeDiameter / 2
  );
}

export function computeHeaderHeight(
  showBranchDots: boolean,
  showBranchNames: boolean,
  verticalLabels: boolean,
  branchLaneMap: Map<string, number>,
): string {
  if (!showBranchDots && !showBranchNames) return "0px";
  if (!showBranchNames) return "12px";
  if (!verticalLabels) return "36px";
  const maxNameLength = Math.max(
    ...Array.from(branchLaneMap.keys(), (n) => n.length),
  );
  return `${Math.max(maxNameLength * 8 + 16, 48)}px`;
}
