import { useState } from "react";
import { Puzzle } from "@/types/types";
import { savePuzzle } from "@/app/actions";

export const usePuzzleSave = (onSuccess?: (id: string) => void) => {
  const [isSaving, setIsSaving] = useState(false);

  const savePuzzleData = async (puzzleData: Puzzle) => {
    try {
      const result = await savePuzzle(puzzleData);
      if ("error" in result) {
        throw new Error(result.error);
      }
      onSuccess?.(result.id);
    } catch (error) {
      console.error("Error saving puzzle:", error);
      alert("Failed to save puzzle");
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, savePuzzleData };
};
