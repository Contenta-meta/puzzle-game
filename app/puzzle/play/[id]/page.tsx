import { getPuzzleById } from "@/app/actions";
import PuzzlePlay from "@/components/PuzzlePlay";
import { notFound } from "next/navigation";
import React from "react";

type PuzzlePlayPageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PuzzlePlayPage({ params }: PuzzlePlayPageParams) {
  const id = (await params).id;
  const data = await getPuzzleById(id);

  if ("error" in data) return notFound();

  return <PuzzlePlay puzzle={data} />;
}
