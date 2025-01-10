import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Puzzle } from "@/types/types";

const dataFilePath = path.join(process.cwd(), "data", "puzzles.json");

async function readPuzzles(): Promise<Puzzle[]> {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading puzzles:", err);
    return [];
  }
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await params;
    const puzzles = await readPuzzles();
    const puzzle = puzzles.find((p) => p.id === id);

    if (!puzzle) {
      return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
    }

    return NextResponse.json(puzzle);
  } catch (error) {
    console.error("Error fetching puzzle:", error);
    return NextResponse.json(
      { error: "Failed to fetch puzzle" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await params;
    const puzzles = await readPuzzles();
    const puzzleIndex = puzzles.findIndex((p) => p.id === id);

    if (puzzleIndex === -1) {
      return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
    }

    puzzles.splice(puzzleIndex, 1);
    await fs.writeFile(dataFilePath, JSON.stringify(puzzles, null, 2));

    return NextResponse.json({ message: "Puzzle deleted successfully" });
  } catch (error) {
    console.error("Error deleting puzzle:", error);
    return NextResponse.json(
      { error: "Failed to delete puzzle" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await params;
    const puzzles = await readPuzzles();
    const puzzleIndex = puzzles.findIndex((p) => p.id === id);

    if (puzzleIndex === -1) {
      return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
    }

    const updates = await request.json();
    puzzles[puzzleIndex] = {
      ...puzzles[puzzleIndex],
      ...updates,
      id: id, // Ensure ID cannot be changed
    };

    await fs.writeFile(dataFilePath, JSON.stringify(puzzles, null, 2));

    return NextResponse.json(puzzles[puzzleIndex]);
  } catch (error) {
    console.error("Error updating puzzle:", error);
    return NextResponse.json(
      { error: "Failed to update puzzle" },
      { status: 500 }
    );
  }
}
