-- Migration: Add status field to stores table
-- Description: Adds approval status (pending/approved/rejected) to stores
-- Date: 2026-03-19

ALTER TABLE stores
ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'pending';

-- Update existing stores to 'approved' if they are active (retroactive migration)
UPDATE stores SET status = 'approved' WHERE is_active = true AND status = 'pending';

-- Create index for faster filtering by status
CREATE INDEX IF NOT EXISTS stores_status_idx ON stores (status);
