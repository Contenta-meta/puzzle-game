
import PuzzlePlay from "@/components/PuzzlePlay";
import React from "react";

type PuzzlePlayPageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PuzzlePlayPage({ params }: PuzzlePlayPageParams) {
  const id = (await params).id;

  return <PuzzlePlay id={id} />;
}
