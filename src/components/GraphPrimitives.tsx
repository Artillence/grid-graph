import React from "react";
import { GraphNode, GraphClassNames, ResolvedGraphConfig } from "../types";
import { getLaneXPosition } from "../utils";
import { useBranchDrag } from "../hooks";

export const BranchDots: React.FC<{
  branchLaneMap: Map<string, number>;
  branchColorMap: Map<string, string>;
  config: ResolvedGraphConfig;
  onReorderBranches?: (newOrder: string[]) => void;
}> = ({ branchLaneMap, branchColorMap, config, onReorderBranches }) => {
  const { draggedBranch, hoverBranch, handleMouseDown } = useBranchDrag(
    branchLaneMap,
    config.columnWidth,
    onReorderBranches
  );

  return (
    <div className="absolute inset-0 z-20">
      {Array.from(branchLaneMap.entries()).map(([branchName, colIndex]) => {
        const xPos = getLaneXPosition(colIndex, config);
        const color = branchColorMap.get(branchName) ?? "#ccc";
        const isDragging = draggedBranch === branchName;
        const isHoverTarget = hoverBranch === branchName;

        return (
          <div
            key={`dot-${branchName}`}
            className="absolute top-0 h-3 w-3 rounded-full transition-all duration-200"
            style={{
              left: xPos,
              transform: `translateX(-50%) ${isDragging ? "scale(1.3)" : "scale(1)"}`,
              backgroundColor: color,
              opacity: isDragging ? 0.7 : 1,
              cursor: onReorderBranches ? "grab" : "default",
              pointerEvents: onReorderBranches ? "auto" : "none",
              boxShadow: isHoverTarget ? "0 0 0 3px rgba(59, 130, 246, 0.5)" : "none",
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
  className: string;
}> = ({ branchLaneMap, verticalLabels, config, className }) => (
  <div className="pointer-events-none absolute top-4 right-0 left-0 z-20">
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
            className={className}
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
        <div key={`label-h-${branchName}`} className={className} style={baseStyle}>
          {branchName}
        </div>
      );
    })}
  </div>
);

export const LaneLines: React.FC<{
  maxCol: number;
  config: ResolvedGraphConfig;
  className: string;
  headerHeight: string;
}> = ({ maxCol, config, className, headerHeight }) => (
  <div className="pointer-events-none absolute z-[1]" style={{ top: `-${headerHeight || 0}`, bottom: 0 }}>
    {Array.from({ length: maxCol + 1 }).map((_, colIndex) => {
      const xPos = getLaneXPosition(colIndex, config);
      return <div key={`lane-${colIndex}`} className={className} style={{ left: xPos - 1 }} />;
    })}
  </div>
);

export const NodeBackgrounds: React.FC<{
  nodeRenderIndex: Map<string, number>;
  selected: string | null;
  hovered: string | null;
  rowHeight: number;
  classNames: Required<GraphClassNames>;
}> = ({ nodeRenderIndex, selected, hovered, rowHeight, classNames }) => (
  <div className="relative z-0">
    {Array.from(nodeRenderIndex.entries()).map(([nodeId, index]) => (
      <div
        key={`bg-${nodeId}`}
        className={`${classNames.nodeBackground} ${
          selected === nodeId
            ? classNames.nodeBackgroundSelected
            : hovered === nodeId
            ? classNames.nodeBackgroundHovered
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
}> = ({ edgePaths }) => (
  <svg className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full">
    {edgePaths.map((edge) => (
      <path
        key={edge.id}
        d={edge.path}
        stroke={edge.color}
        strokeWidth={2.5}
        fill="none"
        style={{ transition: "d 0.3s ease-in-out" }}
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
    className="relative rounded-full transition-all duration-300"
    style={{
      width: config.nodeDiameter,
      height: config.nodeDiameter,
      marginLeft: columnIndex * config.columnWidth + config.padding / 2,
      backgroundColor: color,
      transform: isHovered ? "scale(1.15)" : "scale(1)",
    }}
  >
    <div className="absolute inset-[3px] rounded-full" style={{ backgroundColor: "white" }} />
  </div>
);

export const Nodes: React.FC<{
  nodes: GraphNode[];
  nodeColumnMap: Map<string, number>;
  nodeBranchMap: Map<string, string>;
  branchColorMap: Map<string, string>;
  nodeRenderIndex: Map<string, number>;
  selected: string | null;
  hovered: string | null;
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  onNodeClick: (id: string) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
  config: ResolvedGraphConfig;
  classNames: Required<GraphClassNames>;
  graphWidth: number;
  showNodeLabels: boolean;
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
  onMouseEnter,
  onMouseLeave,
  config,
  classNames,
  graphWidth,
  showNodeLabels,
}) => (
  <div className="relative z-20">
    {nodes.map((node) => {
      const col = nodeColumnMap.get(node.id) ?? 0;
      const branch = nodeBranchMap.get(node.id);
      const color = branch ? branchColorMap.get(branch) ?? "#ccc" : "#ccc";
      const isSelected = selected === node.id;
      const isHovered = hovered === node.id;
      const top = (nodeRenderIndex.get(node.id) ?? 0) * config.rowHeight;

      return (
        <div
          key={node.id}
          onClick={() => onNodeClick(node.id)}
          onMouseEnter={() => onMouseEnter(node.id)}
          onMouseLeave={onMouseLeave}
          style={{ height: config.rowHeight, position: "absolute", top, width: "100%" }}
          className="flex cursor-pointer items-center"
        >
          <div className="flex-shrink-0" style={{ width: graphWidth }}>
            <NodeCircle
              nodeId={node.id}
              color={color}
              columnIndex={col}
              isHovered={isHovered}
              config={config}
              nodeRefs={nodeRefs}
            />
          </div>
          {showNodeLabels && (
            <div
              style={{ marginLeft: config.labelLeftMargin }}
              className={`${classNames.nodeLabel} ${isSelected ? classNames.nodeLabelSelected : ""}`}
            >
              {node.label}
            </div>
          )}
        </div>
      );
    })}
  </div>
);
