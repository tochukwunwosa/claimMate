-- Create claims table
CREATE TABLE claims (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  
  -- Claim Overview
  claim_title TEXT NOT NULL,
  claim_type TEXT NOT NULL,
  client_name TEXT NOT NULL,
  carrier_name TEXT NOT NULL,
  policy_number TEXT NOT NULL,
  incident_date DATE NOT NULL,
  loss_date DATE NOT NULL,
  incident_location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',

  -- People Involved
  parties_involved TEXT[] NOT NULL,
  witnesses TEXT[],
  police_report_filed BOOLEAN NOT NULL,
  police_report_number TEXT,

  -- Incident Details
  incident_description TEXT NOT NULL,
  how_it_happened TEXT NOT NULL,
  injuries TEXT,
  attachments TEXT[],

  -- Losses & Damages
  damages_description TEXT NOT NULL,
  estimated_cost TEXT NOT NULL,
  repairs_done BOOLEAN NOT NULL,
  repairs_details TEXT,

  -- Additional Context
  additional_notes TEXT,
  tone TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  generated_content TEXT,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Create an index for faster user-based queries
CREATE INDEX claims_user_id_idx ON claims(user_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 