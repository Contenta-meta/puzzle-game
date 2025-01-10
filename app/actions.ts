import { createClient } from "@supabase/supabase-js";
import { Puzzle } from "@/types/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type GetPuzzlesReturn = Puzzle[] | { error: string };

export const getPuzzles = async (): Promise<GetPuzzlesReturn> => {
  try {
    const { data, error } = await supabase
      .from("puzzles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Puzzle[];
  } catch (error) {
    console.error("Error fetching puzzles:", error);
    return { error: "Error fetching puzzles" };
  }
};
