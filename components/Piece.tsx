"use client";

import { SNAP_THRESHOLD } from "@/lib/constants";
import React, { useRef, useState, useEffect } from "react";

interface PieceProps {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onPieceChange: (piece: { id: string; x: number; y: number }) => void;
  onPieceRemove?: (id: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  originalPath?: { x: number; y: number }[];
}

const Piece: React.FC<PieceProps> = ({
  id,
  src,
  x,
  y,
  width,
  height,
  onPieceChange,
  // onPieceRemove,
  canvasRef,
  originalPath = [],
}) => {
  const [tempPiecePos, setTempPiecePos] = useState({ x, y });
  const dragging = useRef(false);
  const originalPos = useRef({ x, y });

  // Update originalPos when x or y props change
  useEffect(() => {
    originalPos.current = { x, y };
  }, [x, y]);

  const findSnapPosition = (pieceX: number, pieceY: number) => {
    if (!originalPath.length) return { x: pieceX, y: pieceY };

    // Calculate the bounds of the original path
    let minX = Infinity,
      minY = Infinity;
    for (const point of originalPath) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
    }

    // Check distance to the original top-left position
    const dx = Math.abs(pieceX - minX);
    const dy = Math.abs(pieceY - minY);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only snap if we're close enough to the original position
    if (distance < SNAP_THRESHOLD) {
      return { x: minX, y: minY };
    }

    return { x: pieceX, y: pieceY };
  };

  const setPiecePosition = (e: React.MouseEvent) => {
    if (!dragging.current) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const { clientX, clientY } = e;

    // Calculate position relative to canvas
    const pieceX = clientX - width / 2 - rect.left;
    const pieceY = clientY - height / 2 - rect.top;

    // Find closest piece to snap to
    const snappedPos = findSnapPosition(pieceX, pieceY);
    setTempPiecePos(snappedPos);
  };

  const onMouseLeave = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    setPiecePosition(e);
  };

  const onMouseDown = () => {
    dragging.current = true;
  };

  const onMouseUp = () => {
    if (!dragging.current) return;

    dragging.current = false;
    const newX = tempPiecePos.x || x;
    const newY = tempPiecePos.y || y;

    onPieceChange({ id, x: newX, y: newY });
  };

  const handlePieceMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    e.persist();
    window.requestAnimationFrame(() => setPiecePosition(e));
  };

  // const handlePieceRemove = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   onPieceRemove(id);
  // };

  return (
    <div
      className={`absolute cursor-move ${dragging.current ? "z-10" : ""}`}
      style={{
        width,
        height,
        backgroundImage: `url(${src})`,
        left: tempPiecePos.x || x,
        top: tempPiecePos.y || y,
      }}
      onMouseMove={handlePieceMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {/* <button
        className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-full"
        onClick={handlePieceRemove}
        onMouseDown={(e) => e.stopPropagation()}
      >
        X
      </button> */}
    </div>
  );
};

export default Piece;
