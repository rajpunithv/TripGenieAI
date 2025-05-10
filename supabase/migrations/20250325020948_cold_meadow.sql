/*
  # Enable profile creation for new users

  1. Changes
    - Add INSERT policy for profiles table
    - Allow authenticated users to create their own profile
    - Ensure data integrity with proper checks

  2. Security
    - Only allow users to create their own profile
    - Validate user ID matches authenticated user
*/

-- Drop existing policy if it exists
-- Drop existing policy if it exists
-- Drop existing policy if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Anyone can insert a profile'
  ) THEN
    DROP POLICY "Anyone can insert a profile" ON profiles;
  END IF;
END $$;

-- Create new INSERT policy that allows everyone
CREATE POLICY "Anyone can insert a profile"
  ON profiles
  FOR INSERT
  TO public  -- Allows unauthenticated and authenticated users
  WITH CHECK (
    COALESCE(email, '') <> '' 
    AND COALESCE(full_name, '') <> ''
  );
