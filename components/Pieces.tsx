"use client";

import React from "react";
import Piece from "./Piece";
import { PuzzlePiece } from "@/types/types";

interface PiecesProps {
  pieces: PuzzlePiece[];
  onPieceChange: (piece: { id: string; x: number; y: number }) => void;
  onPieceRemove: (id: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const Pieces: React.FC<PiecesProps> = ({
  pieces,
  onPieceChange,
  onPieceRemove,
  canvasRef,
}) => {
  return (
    <>
      {pieces.map(({ id, originalPath, ...props }) => (
        <Piece
          key={id}
          id={id}
          onPieceChange={onPieceChange}
          onPieceRemove={onPieceRemove}
          canvasRef={canvasRef}
          originalPath={originalPath}
          {...props}
        />
      ))}
    </>
  );
};

export default Pieces;
