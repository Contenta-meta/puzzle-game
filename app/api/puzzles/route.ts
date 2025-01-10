import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";
import { Puzzle } from "@/types/types";

const dataFilePath = path.join(process.cwd(), "data", "puzzles.json");

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir);
  }
}

// Read puzzles from file
async function readPuzzles(): Promise<Puzzle[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading puzzles:", err);
    // If file doesn't exist or is empty, return empty array
    return [];
  }
}

// Write puzzles to file
async function writePuzzles(puzzles: Puzzle[]) {
  await ensureDataDirectory();
  await fs.writeFile(dataFilePath, JSON.stringify(puzzles, null, 2));
}

export async function POST(request: Request) {
  try {
    const puzzleData = await request.json();
    const puzzles = await readPuzzles();

    const newPuzzle: Puzzle = {
      id: uuidv4(),
      ...puzzleData,
      createdAt: new Date().toISOString(),
    };

    puzzles.push(newPuzzle);
    await writePuzzles(puzzles);

    return NextResponse.json({ id: newPuzzle.id }, { status: 201 });
  } catch (error) {
    console.error("Error saving puzzle:", error);
    return NextResponse.json(
      { error: "Failed to save puzzle" },
      { status: 500 }
    );
  }
}
