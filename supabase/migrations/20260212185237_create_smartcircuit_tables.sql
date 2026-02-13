/*
  # SmartCircuit Database Schema

  1. New Tables
    - `projects`
      - `id` (uuid, primary key) - Unique project identifier
      - `user_id` (uuid, nullable) - Owner of the project (for future auth)
      - `name` (text) - Project name
      - `building_type` (text) - Type of building (apartment/house/commercial)
      - `phase` (text) - Electrical phase (1 phase/3 phases)
      - `wooden_construction` (boolean) - Whether it's wooden construction
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `power_lines`
      - `id` (uuid, primary key) - Unique line identifier
      - `project_id` (uuid, foreign key) - Reference to project
      - `name` (text) - Line name/description
      - `icon` (text) - Icon identifier
      - `power_kw` (numeric) - Power in kilowatts
      - `length_m` (numeric) - Cable length in meters
      - `breaker` (text) - Circuit breaker specification
      - `cable` (text) - Cable specification
      - `rcd` (text) - Residual current device specification
      - `afdd` (text) - Arc fault detection device (yes/no)
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (for now, until auth is implemented)
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL DEFAULT 'New Project',
  building_type text NOT NULL DEFAULT 'apartment',
  phase text NOT NULL DEFAULT '1 phase',
  wooden_construction boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS power_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text NOT NULL DEFAULT 'socket',
  power_kw numeric(10,2) NOT NULL DEFAULT 0,
  length_m numeric(10,2) NOT NULL DEFAULT 0,
  breaker text NOT NULL DEFAULT '16A C',
  cable text NOT NULL DEFAULT '3×2.5',
  rcd text NOT NULL DEFAULT '30mA',
  afdd text NOT NULL DEFAULT 'no',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE power_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to projects"
  ON projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to projects"
  ON projects FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to projects"
  ON projects FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to power_lines"
  ON power_lines FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to power_lines"
  ON power_lines FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to power_lines"
  ON power_lines FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to power_lines"
  ON power_lines FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS power_lines_project_id_idx ON power_lines(project_id);
CREATE INDEX IF NOT EXISTS power_lines_order_idx ON power_lines(project_id, order_index);