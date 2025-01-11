import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = "edge";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('puzzles')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Puzzle deleted successfully" });
  } catch (error) {
    console.error("Error deleting puzzle:", error);
    return NextResponse.json(
      { error: "Failed to delete puzzle" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    const { data, error } = await supabase
      .from('puzzles')
      .update({
        ...updates,
        id: id, // Ensure ID cannot be changed
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating puzzle:", error);
    return NextResponse.json(
      { error: "Failed to update puzzle" },
      { status: 500 }
    );
  }
}
