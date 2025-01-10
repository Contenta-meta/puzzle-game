"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import Canvas from "@/components/Canvas";
import Pieces from "@/components/Pieces";
import { Upload, Scissors, Save, Loader } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import ImageDescription from "@/components/ImageDescription";
import { useImageUpload } from "@/hooks/useImageUpload";
import { usePuzzlePieces } from "@/hooks/usePuzzlePieces";
import { usePuzzleSave } from "@/hooks/usePuzzleSave";

export default function PuzzleCreate() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { image, dimensions, handleImageUpload } = useImageUpload();
  const { pieces, addPiece, updatePiece } = usePuzzlePieces();
  const { isSaving, savePuzzle } = usePuzzleSave((id) => router.push(`/puzzle/play/${id}`));

  const handleSavePuzzle = async () => {
    const puzzleData = {
      image: image?.src,
      pieces,
      dimensions,
    };

    await savePuzzle(puzzleData);
  };

  return (
    <div className="h-screen overflow-y-auto">
      <div className="p-4 bg-gradient-to-b from-yellow-200 to-orange-100 min-h-full pb-24">
        <h1 className="text-4xl font-bold mb-6 text-center text-purple-600 animate-bounce">
          Create Your Own Puzzle!
        </h1>

        <div className="mb-6 text-center">
          <CldUploadButton
            options={{ sources: ["local"] }}
            uploadPreset="puzzle_game"
            onSuccess={(result) => handleImageUpload(result)}
          >
            <div className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-full text-lg inline-flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
              <Upload className="h-5 w-5" />
              Upload Image
            </div>
          </CldUploadButton>
        </div>

        <div className="text-center py-6 mb-8">
          <Button
            onClick={handleSavePuzzle}
            className="bg-green-400 hover:bg-green-500 text-white font-bold py-6 px-8 rounded-full text-lg inline-flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105"
            disabled={!image || pieces.length === 0 || isSaving}
          >
            {isSaving ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                Save and Start Playing!
              </>
            )}
          </Button>
          {(!image || pieces.length === 0) && (
            <p className="text-red-500 mt-2">
              {!image
                ? "Please choose a picture first!"
                : "Create some puzzle pieces before saving!"}
            </p>
          )}
        </div>

        {image && (
          <div className="flex justify-center mb-6">
            <div className="relative max-w-full">
              <Canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                onPiece={addPiece}
                image={image}
              />
              <Pieces
                pieces={pieces}
                onPieceChange={updatePiece}
                canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
              />
            </div>
          </div>
        )}

        {image && (
          <div className="text-center mb-6">
            <ImageDescription image={image} />

            <p className="text-lg text-gray-700 mb-2 mt-4">
              Great job! Now, let`s cut the picture into puzzle pieces.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Click on the picture to create puzzle pieces!
            </p>
            <div className="flex items-center justify-center gap-2 text-purple-600">
              <Scissors className="w-6 h-6" />
              <span className="font-bold">Pieces created: {pieces.length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
