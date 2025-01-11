"use client";

import React, { useState, useEffect, useRef } from "react";
import Pieces from "@/components/Pieces";
import { PuzzlePiece, Puzzle } from "@/types/types";
import { Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import ImageDescription from "./ImageDescription";

export default function PuzzlePlay({ puzzle }: { puzzle: Puzzle }) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>(puzzle.pieces);
  const [isComplete, setIsComplete] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (puzzle && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          setImage(img);
          ctx.drawImage(
            img,
            0,
            0,
            puzzle.dimensions.width,
            puzzle.dimensions.height
          );

          // Create white overlay for cut-out pieces
          ctx.fillStyle = "white";
          pieces.forEach((piece) => {
            if (piece.originalPath) {
              ctx.beginPath();
              ctx.moveTo(piece.originalPath[0].x, piece.originalPath[0].y);
              piece.originalPath.slice(1).forEach((point) => {
                ctx.lineTo(point.x, point.y);
              });
              ctx.closePath();
              ctx.fill();
            }
          });

          // Draw piece outlines
          ctx.strokeStyle = "#666";
          ctx.lineWidth = 2;
          pieces.forEach((piece) => {
            if (piece.originalPath) {
              ctx.beginPath();
              ctx.moveTo(piece.originalPath[0].x, piece.originalPath[0].y);
              piece.originalPath.slice(1).forEach((point) => {
                ctx.lineTo(point.x, point.y);
              });
              ctx.closePath();
              ctx.stroke();
            }
          });
        };
        img.src = puzzle.image;
      }
    }
  }, [puzzle, pieces]);

  const onPieceChange = (newPiece: { id: string; x: number; y: number }) => {
    const newPieces = pieces.map((piece) =>
      piece.id === newPiece.id ? { ...piece, ...newPiece } : piece
    );
    setPieces(newPieces);
    checkCompletion(newPieces);
  };

  const checkCompletion = (currentPieces: PuzzlePiece[]) => {
    if (!puzzle) return;

    const isComplete = currentPieces.every((piece) => {
      const originalPiece = puzzle.pieces.find(
        (p: PuzzlePiece) => p.id === piece.id
      );
      if (!originalPiece || !originalPiece.originalPath?.length) return false;

      // Get the minimum x,y from originalPath, just like in snapping
      let minX = Infinity,
        minY = Infinity;
      for (const point of originalPiece.originalPath) {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
      }

      // Check if piece is at the snapped position
      return Math.abs(piece.x - minX) < 10 && Math.abs(piece.y - minY) < 10;
    });

    if (isComplete) {
      setIsComplete(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const resetPuzzle = () => {
    if (!puzzle) return;
    window.location.reload();
  };

  if (!puzzle) {
    return <div>Error: Puzzle not found</div>;
  }

  return (
    <div className="overflow-auto bg-gradient-to-b from-yellow-200 to-orange-100">
      <div className="p-4 min-h-full">
        <h1 className="text-4xl font-bold mb-6 text-center text-purple-600">
          Let`s Solve the Puzzle!
        </h1>
        <div className="mb-4 text-center">
          <p className="text-lg text-gray-700">
            Drag and drop the pieces to complete the picture. You can do it!
          </p>
        </div>
        <div className="flex justify-center mb-6">
          <div
            className="relative bg-white rounded-lg shadow-lg"
            style={{
              width: puzzle?.dimensions.width,
              height: puzzle?.dimensions.height,
            }}
          >
            <canvas
              ref={canvasRef}
              width={puzzle?.dimensions.width}
              height={puzzle?.dimensions.height}
              className="rounded-lg"
            />
            <Pieces
              pieces={pieces}
              onPieceChange={onPieceChange}
              // onPieceRemove={() => {}}
              canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
            />
          </div>
        </div>
        {image && <ImageDescription image={image} />}
        {isComplete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg text-center">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-purple-600 mb-4">
                Hooray! You Did It!
              </h2>
              <p className="text-xl text-gray-700 mb-4">
                You`re a puzzle master! Great job completing the puzzle!
              </p>
              <div>
                <Button
                  onClick={resetPuzzle}
                  className="bg-green-400 hover:bg-green-500 text-white font-bold py-6 px-4 rounded-full text-lg transition-transform hover:scale-105"
                >
                  Play Again
                </Button>

                <Button onClick={() => setIsComplete(false)} variant={"link"}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
