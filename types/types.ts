export interface PuzzlePiece {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalPath?: { x: number; y: number }[];
}

export interface Puzzle {
  id: string;
  pieces: PuzzlePiece[];
  image: string;
  dimensions: {
    width: number;
    height: number;
  };
}
