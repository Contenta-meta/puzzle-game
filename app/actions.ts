import { promises as fs } from "fs";
import path from "path";
const dataFilePath = path.join(process.cwd(), "data", "puzzles.json");

export const getPuzzles = async () => {
  try {
    const fileContent = await fs.readFile(dataFilePath, "utf-8");
    const puzzles = JSON.parse(fileContent);
    return puzzles;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // If file doesn't exist, return empty array
      return [];
    }
    console.error("Error reading puzzles:", error);
    return { error: "Error reading puzzles" };
  }
};