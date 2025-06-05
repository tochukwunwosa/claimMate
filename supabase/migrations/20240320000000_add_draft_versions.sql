-- Create draft_versions table
CREATE TABLE IF NOT EXISTS draft_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    formatted_content TEXT NOT NULL,
    version INTEGER NOT NULL,
    status TEXT CHECK (status IN ('draft', 'reviewed', 'final')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create draft_corrections table
CREATE TABLE IF NOT EXISTS draft_corrections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    draft_version_id UUID REFERENCES draft_versions(id) ON DELETE CASCADE,
    correction_text TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'applied')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_draft_versions_claim_id ON draft_versions(claim_id);
CREATE INDEX IF NOT EXISTS idx_draft_versions_version ON draft_versions(version);
CREATE INDEX IF NOT EXISTS idx_draft_corrections_draft_version_id ON draft_corrections(draft_version_id);

-- Add current_draft_version column to claims table
ALTER TABLE claims 
ADD COLUMN IF NOT EXISTS current_draft_version INTEGER,
ADD COLUMN IF NOT EXISTS has_draft BOOLEAN DEFAULT false;

-- Create function to update has_draft flag
CREATE OR REPLACE FUNCTION update_claim_has_draft()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE claims
    SET has_draft = true
    WHERE id = NEW.claim_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update has_draft flag
CREATE TRIGGER update_claim_has_draft_trigger
AFTER INSERT ON draft_versions
FOR EACH ROW
EXECUTE FUNCTION update_claim_has_draft(); 