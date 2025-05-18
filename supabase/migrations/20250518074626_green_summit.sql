/*
  # Create route_stops table

  1. New Tables
    - `route_stops`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `location` (text)
      - `lat` (double precision)
      - `lng` (double precision)
      - `planned_date` (timestamp with timezone, nullable)
      - `visited` (boolean)
      - `description` (text, nullable)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `route_stops` table
    - Add policies for:
      - Authenticated users can read all route stops
      - Users can only create/update/delete their own route stops
*/

CREATE TABLE IF NOT EXISTS route_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  location text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  planned_date timestamptz,
  visited boolean DEFAULT false,
  description text,
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Route stops are viewable by authenticated users"
  ON route_stops
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own route stops"
  ON route_stops
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own route stops"
  ON route_stops
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own route stops"
  ON route_stops
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);