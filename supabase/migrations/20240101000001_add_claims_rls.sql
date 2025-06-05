-- Enable Row Level Security
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own claims"
ON claims FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own claims"
ON claims FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own claims"
ON claims FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own claims"
ON claims FOR DELETE
USING (auth.uid() = user_id); 