import { useState, useEffect } from "react";
import { Puzzle } from "@/types/types";
import { getPuzzles } from "@/app/actions";

export const usePuzzles = () => {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPuzzles = async () => {
    try {
      const data = await getPuzzles();
      if ("error" in data) {
        setError(data.error);
      } else {
        setPuzzles(data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch puzzles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuzzles();
  }, []);

  return { puzzles, setPuzzles,error, loading, refetch: fetchPuzzles };
};
