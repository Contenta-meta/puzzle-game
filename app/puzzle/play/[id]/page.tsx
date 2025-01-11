import { getPuzzleById } from "@/app/actions";
import ErrorPage from "@/components/ErrorPage";
import PuzzlePlay from "@/components/PuzzlePlay";
import React from "react";

type PuzzlePlayPageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PuzzlePlayPage({ params }: PuzzlePlayPageParams) {
  const id = (await params).id;
  const data = await getPuzzleById(id);

  if ("error" in data) return <ErrorPage />;

  return <PuzzlePlay puzzle={data} />;
}
