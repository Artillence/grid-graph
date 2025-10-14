import { useLayoutEffect, useRef, useState } from "react";

export function useBranchDrag(
  branchLaneMap: Map<string, number>,
  columnWidth: number,
  onReorderBranches?: (newOrder: string[]) => void,
) {
  const [draggedBranch, setDraggedBranch] = useState<string | null>(null);
  const [hoverBranch, setHoverBranch] = useState<string | null>(null);
  const dragStartX = useRef<number>(0);

  const handleMouseDown = (branchName: string, e: React.MouseEvent) => {
    if (!onReorderBranches) return;
    setDraggedBranch(branchName);
    dragStartX.current = e.clientX;
    e.preventDefault();
  };

  useLayoutEffect(() => {
    if (!draggedBranch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const branches = Array.from(branchLaneMap.entries()).sort(
        (a, b) => a[1] - b[1],
      );
      const currentIndex = branches.findIndex(
        ([name]) => name === draggedBranch,
      );
      if (currentIndex === -1) return;

      const deltaX = e.clientX - dragStartX.current;
      const columnOffset = Math.round(deltaX / columnWidth);
      const targetIndex = Math.max(
        0,
        Math.min(branches.length - 1, currentIndex + columnOffset),
      );

      setHoverBranch(
        targetIndex !== currentIndex ? branches[targetIndex][0] : null,
      );
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!onReorderBranches) return;

      const branches = Array.from(branchLaneMap.entries()).sort(
        (a, b) => a[1] - b[1],
      );
      const currentIndex = branches.findIndex(
        ([name]) => name === draggedBranch,
      );
      if (currentIndex === -1) {
        setDraggedBranch(null);
        setHoverBranch(null);
        return;
      }

      const deltaX = e.clientX - dragStartX.current;
      const columnOffset = Math.round(deltaX / columnWidth);
      const targetIndex = Math.max(
        0,
        Math.min(branches.length - 1, currentIndex + columnOffset),
      );

      if (targetIndex !== currentIndex) {
        const newOrder = [...branches.map(([name]) => name)];
        [newOrder[currentIndex], newOrder[targetIndex]] = [
          newOrder[targetIndex],
          newOrder[currentIndex],
        ];
        onReorderBranches(newOrder);
      }

      setDraggedBranch(null);
      setHoverBranch(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedBranch, branchLaneMap, columnWidth, onReorderBranches]);

  return { draggedBranch, hoverBranch, handleMouseDown };
}
