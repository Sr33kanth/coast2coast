/*
  # Create photos table

  1. New Tables
    - `photos`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `url` (text)
      - `caption` (text, nullable)
      - `location` (text)
      - `lat` (double precision)
      - `lng` (double precision)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on `photos` table
    - Add policies for authenticated users to:
      - View all photos
      - Create their own photos
      - Update their own photos
      - Delete their own photos
*/

CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  url text NOT NULL,
  caption text,
  location text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Photos are viewable by everyone"
  ON photos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own photos"
  ON photos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos"
  ON photos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON photos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);