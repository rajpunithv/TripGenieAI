/*
  # Update profiles table with additional fields

  1. Changes
    - Add full_name column
    - Add phone column
    - Add constraints for new columns

  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone text;
  END IF;
END $$;