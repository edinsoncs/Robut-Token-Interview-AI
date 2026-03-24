-- Add language column to interviewer table
ALTER TABLE interviewer 
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- Add comment explaining the column
COMMENT ON COLUMN interviewer.language IS 'Language code (e.g., en, es, fr, de, pt, it, zh, ja, ko)';
