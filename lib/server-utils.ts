'use server'

import { Puzzle } from "@/types/types";
import { promises as fs } from "fs";
import path from "path";


export const dataFilePath = path.join(process.cwd(), "data", "puzzles.json");

export async function readPuzzles(): Promise<Puzzle[]> {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading puzzles:", err);
    return [];
  }
}
