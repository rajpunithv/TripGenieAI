/*
  # Add INSERT policy for profiles table

  1. Changes
    - Add INSERT policy to allow authenticated users to create their own profile

  2. Security
    - Only allow users to insert their own profile data
    - Maintain data integrity by ensuring user_id matches auth.uid()
*/

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);