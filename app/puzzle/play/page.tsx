import React from "react";
import PuzzleList from "@/components/PuzzleList";
import { getPuzzles } from "@/app/actions";
import ErrorPage from "@/components/ErrorPage";

export default async function PuzzleListPage() {
  const data = await getPuzzles();

  if ("error" in data) return <ErrorPage />;
  return <PuzzleList puzzles={data} />;
}
