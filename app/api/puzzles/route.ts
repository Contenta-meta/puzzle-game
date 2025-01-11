import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


export const runtime = "edge";

// Get all puzzles
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('puzzles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching puzzles:", error);
    return NextResponse.json(
      { error: "Failed to fetch puzzles" },
      { status: 500 }
    );
  }
}

// Create a new puzzle
export async function POST(request: Request) {
  try {
    const puzzleData = await request.json();
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const { data, error } = await supabase
      .from('puzzles')
      .insert([
        {
          id,
          image: puzzleData.image,
          pieces: puzzleData.pieces,
          dimensions: puzzleData.dimensions,
          created_at: createdAt
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error saving puzzle:", error);
    return NextResponse.json(
      { error: "Failed to save puzzle" },
      { status: 500 }
    );
  }
}
