-- Drop the existing table if it exists
DROP TABLE IF EXISTS puzzles;

-- Create the table with all required columns
CREATE TABLE puzzles (
    id UUID PRIMARY KEY,
    image TEXT NOT NULL,
    pieces JSONB NOT NULL,
    dimensions JSONB NOT NULL DEFAULT '{"width": 800, "height": 800}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on created_at for better sorting performance
CREATE INDEX IF NOT EXISTS puzzles_created_at_idx ON puzzles(created_at DESC);

-- Grant necessary permissions (adjust according to your needs)
ALTER TABLE puzzles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read puzzles
CREATE POLICY "Allow public read access"
    ON puzzles
    FOR SELECT
    TO public
    USING (true);

-- Create policy to allow authenticated users to insert puzzles
CREATE POLICY "Allow authenticated users to insert"
    ON puzzles
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
