import { useState } from 'react';
import { PuzzlePiece } from '@/types/types';

export const usePuzzlePieces = () => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);

  const addPiece = (piece: PuzzlePiece) => {
    setPieces([piece, ...pieces]);
  };

  const updatePiece = (newPiece: { id: string; x: number; y: number }) => {
    setPieces(pieces.map((piece) =>
      piece.id === newPiece.id ? { ...piece, ...newPiece } : piece
    ));
  };

  const removePiece = (id: string) => {
    setPieces(pieces.filter((piece) => piece.id !== id));
  };

  return { pieces, addPiece, updatePiece, removePiece };
};
