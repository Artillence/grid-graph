import React from "react";
import { Node, ResolvedGraphConfig } from "../types";
import { getLaneXPosition } from "../utils";
import { useBranchDrag } from "../hooks";

export const BranchDots: React.FC<{
  branchLaneMap: Map<string, number>;
  branchColorMap: Map<string, string>;
  config: ResolvedGraphConfig;
  onReorderBranches?: (newOrder: string[]) => void;
  className?: string;
  style?: React.CSSProperties;
}> = ({
  branchLaneMap,
  branchColorMap,
  config,
  onReorderBranches,
  className,
  style,
}) => {
  const { draggedBranch, hoverBranch, handleMouseDown } = useBranchDrag(
    branchLaneMap,
    config.columnWidth,
    onReorderBranches,
  );

  return (
    <div className={`gg__absolute gg__inset-0 gg__z-20 ${className || ''}`} style={style}>
      {Array.from(branchLaneMap.entries()).map(([branchName, colIndex]) => {
        const xPos = getLaneXPosition(colIndex, config);
        const color = branchColorMap.get(branchName) ?? "#ccc";
        const isDragging = draggedBranch === branchName;
        const isHoverTarget = hoverBranch === branchName;

        return (
          <div
            key={`dot-${branchName}`}
            className={`gg__branch-dot ${isDragging ? "gg__branch-dot-dragging" : ""} ${isHoverTarget ? "gg__branch-dot-hover" : ""} ${onReorderBranches ? "gg__branch-dot-draggable" : "gg__branch-dot-static"}`}
            style={{
              left: xPos,
              transform: "translateX(-50%)",
              backgroundColor: color,
            }}
            onMouseDown={(e) => handleMouseDown(branchName, e)}
          />
        );
      })}
    </div>
  );
};

export const BranchNames: React.FC<{
  branchLaneMap: Map<string, number>;
  verticalLabels: boolean;
  config: ResolvedGraphConfig;
  className?: string;
  style?: React.CSSProperties;
}> = ({ branchLaneMap, verticalLabels, config, className, style }) => (
  <div className="gg__branch-labels" style={style}>
    {Array.from(branchLaneMap.entries()).map(([branchName, colIndex]) => {
      const xPos = getLaneXPosition(colIndex, config);

      const baseStyle = {
        left: xPos,
        transform: "translateX(-50%)",
        whiteSpace: "nowrap" as const,
      };

      if (verticalLabels) {
        return (
          <div
            key={`label-v-${branchName}`}
            className={`gg__branch-label ${className || ''}`}
            style={{
              ...baseStyle,
              top: 0,
              transform: "translateX(-50%) rotate(180deg)",
              writingMode: "vertical-lr" as const,
            }}
          >
            {branchName}
          </div>
        );
      }

      return (
        <div
          key={`label-h-${branchName}`}
          className={`gg__branch-label ${className || ''}`}
          style={baseStyle}
        >
          {branchName}
        </div>
      );
    })}
  </div>
);

export const LaneLines: React.FC<{
  maxCol: number;
  config: ResolvedGraphConfig;
  className?: string;
  style?: React.CSSProperties;
}> = ({ maxCol, config, className, style }) => (
  <div className="gg__lane-lines-container" style={style}>
    {Array.from({ length: maxCol + 1 }).map((_, colIndex) => {
      const xPos = getLaneXPosition(colIndex, config);
      return (
        <div
          key={`lane-${colIndex}`}
          className={`gg__lane-line ${className || ''}`}
          style={{ left: xPos - 1 }}
        />
      );
    })}
  </div>
);

export const RowBackgrounds: React.FC<{
  nodeRenderIndex: Map<string, number>;
  selected: string | null;
  hovered: string | null;
  rowHeight: number;
  className?: string;
  style?: React.CSSProperties;
  selectedClassName?: string;
  hoveredClassName?: string;
}> = ({
  nodeRenderIndex,
  selected,
  hovered,
  rowHeight,
  className,
  style,
  selectedClassName,
  hoveredClassName,
}) => (
  <div className="gg__node-backgrounds" style={style}>
    {Array.from(nodeRenderIndex.entries()).map(([nodeId, index]) => (
      <div
        key={`bg-${nodeId}`}
        className={`gg__node-background ${className || ''} ${
          selected === nodeId
            ? selectedClassName || "gg__node-background-selected"
            : hovered === nodeId
              ? hoveredClassName || "gg__node-background-hovered"
              : ""
        }`}
        style={{
          height: rowHeight,
          position: "absolute",
          top: index * rowHeight,
          left: 0,
          right: 0,
        }}
      />
    ))}
  </div>
);

export const Edges: React.FC<{
  edgePaths: { id: string; path: string; color: string }[];
  className?: string;
  style?: React.CSSProperties;
  pathClassName?: string;
}> = ({ edgePaths, className, style, pathClassName }) => (
  <svg className={`gg__edges ${className || ''}`} style={style}>
    {edgePaths.map((edge) => (
      <path
        key={edge.id}
        className={`gg__edge-path ${pathClassName || ''}`}
        d={edge.path}
        stroke={edge.color}
        strokeWidth={2.5}
        fill="none"
      />
    ))}
  </svg>
);

export const NodeCircle: React.FC<{
  nodeId: string;
  color: string;
  columnIndex: number;
  isHovered: boolean;
  config: ResolvedGraphConfig;
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
}> = ({ nodeId, color, columnIndex, isHovered, config, nodeRefs }) => (
  <div
    ref={(el) => {
      if (el) nodeRefs.current.set(nodeId, el);
      else nodeRefs.current.delete(nodeId);
    }}
    className="gg__node-circle"
    style={{
      width: config.nodeDiameter,
      height: config.nodeDiameter,
      marginLeft: columnIndex * config.columnWidth + config.padding / 2,
      backgroundColor: color,
      transform: isHovered ? "scale(1.15)" : "scale(1)",
    }}
  >
    <div className="gg__node-circle-inner" />
  </div>
);

export const Nodes: React.FC<{
  nodes: Node[];
  nodeColumnMap: Map<string, number>;
  nodeBranchMap: Map<string, string>;
  branchColorMap: Map<string, string>;
  nodeRenderIndex: Map<string, number>;
  selected: string | null;
  hovered: string | null;
  nodeRefs: React.RefObject<Map<string, HTMLDivElement>>;
  onNodeClick: (id: string) => void;
  onNodeDoubleClick?: (id: string) => void;
  onNodeContextMenu?: (id: string, event: React.MouseEvent) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: (id: string) => void;
  config: ResolvedGraphConfig;
  graphWidth: number;
  showLabels?: boolean;
  className?: string;
  style?: React.CSSProperties;
  labelClassName?: string;
  selectedLabelClassName?: string;
}> = ({
  nodes,
  nodeColumnMap,
  nodeBranchMap,
  branchColorMap,
  nodeRenderIndex,
  selected,
  hovered,
  nodeRefs,
  onNodeClick,
  onNodeDoubleClick,
  onNodeContextMenu,
  onMouseEnter,
  onMouseLeave,
  config,
  graphWidth,
  showLabels = true,
  className,
  style,
  labelClassName,
  selectedLabelClassName,
}) => (
  <div className={`gg__nodes ${className || ''}`} style={style}>
    {nodes.map((node) => {
      const col = nodeColumnMap.get(node.id) ?? 0;
      const branch = nodeBranchMap.get(node.id);
      const color = branch ? (branchColorMap.get(branch) ?? "#ccc") : "#ccc";
      const isSelected = selected === node.id;
      const isHovered = hovered === node.id;
      const top = (nodeRenderIndex.get(node.id) ?? 0) * config.rowHeight;

      return (
        <div
          key={node.id}
          className="gg__node"
          onClick={() => onNodeClick(node.id)}
          onDoubleClick={() => onNodeDoubleClick?.(node.id)}
          onContextMenu={(e) => {
            if (onNodeContextMenu) {
              e.preventDefault();
              onNodeContextMenu(node.id, e);
            }
          }}
          onMouseEnter={() => onMouseEnter(node.id)}
          onMouseLeave={() => onMouseLeave(node.id)}
          style={{ height: config.rowHeight, top }}
        >
          <div
            className="gg__node-circle-wrapper"
            style={{ width: graphWidth }}
          >
            <NodeCircle
              nodeId={node.id}
              color={color}
              columnIndex={col}
              isHovered={isHovered}
              config={config}
              nodeRefs={nodeRefs}
            />
          </div>
          {showLabels && (
            <div
              style={{ marginLeft: config.labelLeftMargin }}
              className={`gg__node-label ${labelClassName || ''} ${isSelected ? selectedLabelClassName || "gg__node-label-selected" : ""}`}
              data-label={typeof node.label === 'string' ? node.label : ''}
            >
              {node.label}
            </div>
          )}
        </div>
      );
    })}
  </div>
);
