"use client";

import React, { useEffect, useRef } from "react";
import { cropPath, fillPath, getMousePos } from "@/lib/canvas";
import { GRID_SIZE } from "@/lib/constants";
import { PuzzlePiece } from "@/types/types";

interface CanvasProps {
  width: number;
  height: number;
  onPiece: (piece: PuzzlePiece) => void;
  image: HTMLImageElement;
}

const Canvas = React.forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ width, height, onPiece, image }, canvasRef) => {
    const dragging = useRef(false);
    const paths = useRef<{ x: number; y: number }[]>([]);

    const snapToGrid = (x: number, y: number): { x: number; y: number } => {
      const snapX = Math.round(x / GRID_SIZE) * GRID_SIZE;
      const snapY = Math.round(y / GRID_SIZE) * GRID_SIZE;
      return { x: snapX, y: snapY };
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!dragging.current) return;

      const canvas = canvasRef as React.RefObject<HTMLCanvasElement>;
      const pos = getMousePos(e, canvas.current!.getBoundingClientRect());
      if (!pos) return;

      const ctx = canvas.current!.getContext("2d")!;

      const snappedPos = snapToGrid(pos.x, pos.y);

      if (paths.current.length > 0) {
        const lastPos = paths.current[paths.current.length - 1];
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(snappedPos.x, snappedPos.y);
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(snappedPos.x, snappedPos.y, 3, 0, 2 * Math.PI);
        // ctx.fillStyle = "white";
        // ctx.fill();
      }
      paths.current.push(snappedPos);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      dragging.current = true;
      if (paths.current.length) {
        paths.current = [];
      }

      const canvas = canvasRef as React.RefObject<HTMLCanvasElement>;
      const pos = getMousePos(e, canvas.current!.getBoundingClientRect());
      if (!pos) return;

      const snappedPos = snapToGrid(pos.x, pos.y);
      paths.current.push(snappedPos);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
      dragging.current = false;

      const canvas = canvasRef as React.RefObject<HTMLCanvasElement>;
      const pos = getMousePos(e, canvas.current!.getBoundingClientRect());
      const ctx = canvas.current!.getContext("2d")!;

      if (
        ctx.canvas.width === 0 ||
        ctx.canvas.height === 0 ||
        !pos ||
        paths.current.length < 5
      ) {
        paths.current = [];
        return;
      }

      fillPath({ ctx, paths: paths.current, fillStyle: "white" });

      const piece = cropPath({ width, height, paths: paths.current, image });

      const pieceWithPaths = {
        ...piece,
        originalPath: [...paths.current],
      };

      onPiece(pieceWithPaths);

      paths.current = [];
    };

    useEffect(() => {
      const canvas = canvasRef as React.RefObject<HTMLCanvasElement>;
      if (canvas.current && image) {
        const ctx = canvas.current.getContext("2d")!;
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.clearRect(0, 0, width, height);

        // Scale the image to fit the canvas
        ctx.drawImage(image, 0, 0, width, height);
      }
    }, [image, width, height, canvasRef]);

    return (
      <canvas
        ref={canvasRef as React.RefObject<HTMLCanvasElement>}
        className="border border-gray-300"
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    );
  }
);

Canvas.displayName = "Canvas";

export default Canvas;
