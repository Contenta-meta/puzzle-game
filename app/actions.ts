"use server";

import { createClient } from "@supabase/supabase-js";
import { Puzzle } from "@/types/types";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type SavePuzzle = Puzzle | { error: string };
type DeletePuzzle = { message: string } | { error: string };
type GetPuzzlesReturn = Puzzle[] | { error: string };
type GetPuzzleByIdReturn = Puzzle | { error: string };

export const savePuzzle = async (puzzleData: Puzzle): Promise<SavePuzzle> => {
  try {
    const { data, error } = await supabase
      .from("puzzles")
      .insert([
        {
          id: puzzleData.id,
          image: puzzleData.image,
          pieces: puzzleData.pieces,
          dimensions: puzzleData.dimensions,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    revalidatePath("/puzzle/play");
    return data as Puzzle;
  } catch (error) {
    console.error("Error saving puzzle:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to save puzzle",
    };
  }
};

export const deletePuzzle = async (id: string): Promise<DeletePuzzle> => {
  try {
    const { error } = await supabase.from("puzzles").delete().eq("id", id);

    if (error) {
      console.error("Puzzle not found", error);
      return { error: "Puzzle not found" };
    }
    revalidatePath("/puzzle/play");
    return { message: "Puzzle deleted successfully" };
  } catch (error) {
    console.error("Error deleting puzzle:", error);
    return { error: "Failed to delete puzzle" };
  }
};

export const getPuzzles = async (): Promise<GetPuzzlesReturn> => {
  try {
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
    return { error: "Error fetching puzzles" };
  }
};

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
    console.error("Error fetching puzzle:", error);
    return { error: "Error fetching puzzle" };
  }
};
