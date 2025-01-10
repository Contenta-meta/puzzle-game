"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Canvas from "@/components/Canvas";
import Pieces from "@/components/Pieces";
import { PuzzlePiece } from "@/types/types";
import { Upload, Scissors, Save, Loader } from "lucide-react";
import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import axios from "axios";
import { Button } from "@/components/ui/button";
import ImageDescription from "@/components/ImageDescription";

export default function PuzzleCreate() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const handleImageUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result?.info && typeof result.info !== "string") {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = result.info.secure_url;
      img.onload = () => {
        setPieces([])
        setImage(img);
        setDimensions({ width: 800, height: 800 }); // Set fixed canvas size
      };
    }
  };

  const onPiece = (piece: PuzzlePiece) => {
    setPieces([piece, ...pieces]);
  };

  const onPieceChange = (newPiece: { id: string; x: number; y: number }) => {
    const newPieces = pieces.map((piece) =>
      piece.id === newPiece.id ? { ...piece, ...newPiece } : piece
    );
    setPieces(newPieces);
  };

  // const onPieceRemove = (id: string) => {
  //   const newPieces = pieces.filter((piece) => piece.id !== id);
  //   setPieces(newPieces);
  // };

  const handleSavePuzzle = async () => {
    setIsSaving(true);
    const puzzleData = {
      image: image?.src,
      pieces,
      dimensions,
    };

    try {
      const { data } = await axios.post("/api/puzzles", puzzleData);
      router.push(`/puzzle/play/${data.id}`);
    } catch (error) {
      console.error("Error saving puzzle:", error);
    } finally {
      setIsSaving(false);
    }
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
                onPiece={onPiece}
                image={image}
              />
              <Pieces
                pieces={pieces}
                onPieceChange={onPieceChange}
                // onPieceRemove={onPieceRemove}
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
