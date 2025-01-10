import Link from "next/link";
import { Puzzle, GamepadIcon as GameController } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-yellow-200 to-orange-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-600 animate-bounce">
        Puzzle Adventure for Kids!
      </h1>
      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          href="/puzzle/create"
          className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-full text-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
        >
          <Puzzle className="w-6 h-6" />
          Make a Puzzle
        </Link>
        <Link
          href="/puzzle/play"
          className="bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-full text-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
        >
          <GameController className="w-6 h-6" />
          Solve Puzzles
        </Link>
      </div>
      <p className="mt-8 text-lg text-center text-gray-700 max-w-md">
        Welcome, young explorers! Are you ready for an exciting puzzle
        adventure? Create your own puzzles or challenge yourself with fun brain
        teasers!
      </p>
    </main>
  );
}
