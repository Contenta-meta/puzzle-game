"use client";

import React from "react";
import PuzzleList from "@/components/PuzzleList";
import ErrorPage from "@/components/ErrorPage";
import { usePuzzles } from "@/hooks/usePuzzles";
import { Loader } from "lucide-react";

export default function PuzzleListPage() {
  const { puzzles, error, loading } = usePuzzles();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return <ErrorPage />;
  }

  return <PuzzleList data={puzzles} />;
}
