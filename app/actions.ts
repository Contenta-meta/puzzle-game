import { createClient } from "@supabase/supabase-js";
import { Puzzle } from "@/types/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type GetPuzzlesReturn = Puzzle[] | { error: string };

export const getPuzzles = async (): Promise<GetPuzzlesReturn> => {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables");
      return { error: "Configuration error" };
    }

    const { data, error } = await supabase
      .from("puzzles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    if (!data) {
      console.error("No data returned from Supabase");
      return { error: "No data available" };
    }

    console.log("Fetched puzzles:", data.length);
    return data as Puzzle[];
  } catch (error) {
    console.error("Error fetching puzzles:", error);
    return { error: typeof error === 'object' ? JSON.stringify(error) : 'Error fetching puzzles' };
  }
};

type GetPuzzleByIdReturn = Puzzle | { error: string };

export const getPuzzleById = async (
  id: string
): Promise<GetPuzzleByIdReturn> => {
  try {
    const { data, error } = await supabase
      .from("puzzles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Puzzle;
  } catch (error) {
    console.error("Error fetching puzzles:", error);
    return { error: "Error fetching puzzles" };
  }
};
