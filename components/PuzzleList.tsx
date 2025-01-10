"use client";

import Link from "next/link";
import Image from "next/image";
import { Puzzle } from "@/types/types";
import {  PuzzleIcon, Plus } from "lucide-react";

export default function PuzzleList({ data }: { data: Puzzle[] }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 to-orange-100 p-8">
      <h1 className="text-5xl font-bold text-center text-purple-600 mb-8 animate-bounce">
        Puzzle Paradise
      </h1>

      {data.length === 0 ? (
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <PuzzleIcon className="w-24 h-24 text-purple-600 mx-auto mb-4" />
          <p className="text-2xl text-gray-700 mb-6">
            Oops! No puzzles yet. Let`s create your first magical puzzle!
          </p>
          <Link
            href="/puzzle/create"
            className="inline-block bg-green-400 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-full text-xl transition-transform hover:scale-105 shadow-lg"
          >
            Create Your First Puzzle
          </Link>
        </div>
      ) : (
        <>
          <p className="text-2xl text-center text-gray-700 mb-8">
            Choose a puzzle and let the fun begin!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((puzzle) => (
              <Link
                key={puzzle.id}
                href={`/puzzle/play/${puzzle.id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="relative w-400 aspect-[4/3]">
                  <Image
                    src={puzzle.image}
                    alt="Puzzle preview"
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-2xl font-bold text-purple-600 mb-2">
                    Puzzle Adventure #{puzzle.id}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {puzzle.pieces.length} magical pieces
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="fixed bottom-8 right-8">
        <Link
          href="/puzzle/create"
          className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-4 px-8 rounded-full text-xl transition-all hover:scale-110 shadow-lg flex items-center gap-3"
        >
          <span>Create New Puzzle</span>
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
