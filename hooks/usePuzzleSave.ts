import { useState } from 'react';
import axios from 'axios';
import { PuzzlePiece } from '@/types/types';

interface PuzzleData {
  image: string | undefined;
  pieces: PuzzlePiece[];
  dimensions: { width: number; height: number };
}

export const usePuzzleSave = (onSuccess?: (id: string) => void) => {
  const [isSaving, setIsSaving] = useState(false);

  const savePuzzle = async (puzzleData: PuzzleData) => {
    setIsSaving(true);
    try {
      const { data } = await axios.post("/api/puzzles", puzzleData);
      onSuccess?.(data.id);
      return data;
    } catch (error) {
      console.error("Error saving puzzle:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, savePuzzle };
};
