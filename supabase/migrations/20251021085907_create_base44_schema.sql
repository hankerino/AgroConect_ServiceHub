/*
  # Base44 Agricultural Services Platform Schema

  ## Overview
  This migration creates the complete database schema for the Base44 agricultural services platform,
  including community features, marketplace functionality, and consultation management.

  ## New Tables

  ### Community Features
  
  1. `community_profiles`
    - `id` (uuid, primary key) - Unique identifier
    - `display_name` (text) - User's display name
    - `location` (text) - User's location
    - `bio` (text) - User biography
    - `specialties` (text[]) - Array of specialties
    - `phone_number` (text) - Contact phone
    - `email` (text) - Contact email
    - `profile_image_url` (text) - Profile image URL
    - `qr_code_data` (text) - QR code data for quick connections
    - `created_date` (timestamptz) - Creation timestamp

  2. `community_groups`
    - `id` (uuid, primary key) - Unique identifier
    - `name` (text) - Group name
    - `description` (text) - Group description
    - `topic` (text) - Group topic/category
    - `members_count` (integer) - Number of members
    - `posts_count` (integer) - Number of posts
    - `created_by` (text) - Creator name
    - `created_date` (timestamptz) - Creation timestamp

  3. `forum_posts`
    - `id` (uuid, primary key) - Unique identifier
    - `title` (text) - Post title
    - `content` (text) - Post content
    - `category` (text) - Post category
    - `author_name` (text) - Author name
    - `location` (text) - Author location
    - `group_name` (text) - Associated group name
    - `tags` (text[]) - Array of tags
    - `likes` (integer) - Number of likes
    - `replies_count` (integer) - Number of replies
    - `created_date` (timestamptz) - Creation timestamp

  4. `video_posts`
    - `id` (uuid, primary key) - Unique identifier
    - `title` (text) - Video title
    - `description` (text) - Video description
    - `category` (text) - Video category
    - `author_name` (text) - Author name
    - `thumbnail_url` (text) - Video thumbnail URL
    - `video_url` (text) - Video URL
    - `views_count` (integer) - Number of views
    - `likes_count` (integer) - Number of likes
    - `created_date` (timestamptz) - Creation timestamp

  ### Marketplace
  
  5. `products`
    - `id` (uuid, primary key) - Unique identifier
    - `name` (text) - Product name
    - `description` (text) - Product description
    - `category` (text) - Product category
    - `price` (numeric) - Product price
    - `unit` (text) - Unit of measurement
    - `availability` (text) - Availability status
    - `location` (text) - Product location
    - `seller_name` (text) - Seller name
    - `seller_contact` (text) - Seller contact
    - `image_url` (text) - Product image URL
    - `created_date` (timestamptz) - Creation timestamp

  6. `experts`
    - `id` (uuid, primary key) - Unique identifier
    - `name` (text) - Expert name
    - `organization` (text) - Expert organization
    - `bio` (text) - Expert biography
    - `specializations` (text[]) - Array of specializations
    - `service_type` (text) - Type of service offered
    - `location` (text) - Expert location
    - `phone` (text) - Contact phone
    - `email` (text) - Contact email
    - `rating` (numeric) - Expert rating
    - `availability` (text) - Availability status
    - `created_date` (timestamptz) - Creation timestamp

  ### Consultations
  
  7. `consultations`
    - `id` (uuid, primary key) - Unique identifier
    - `expert_name` (text) - Expert name
    - `expert_specialty` (text) - Expert specialty
    - `consultation_type` (text) - Type of consultation
    - `scheduled_date` (timestamptz) - Scheduled date and time
    - `duration` (integer) - Duration in minutes
    - `description` (text) - Consultation description
    - `price` (numeric) - Consultation price
    - `status` (text) - Consultation status
    - `meeting_link` (text) - Online meeting link
    - `created_date` (timestamptz) - Creation timestamp

  ## Security
  All tables have Row Level Security (RLS) enabled with policies allowing:
  - Public read access for all data (suitable for marketplace/community platform)
  - Authenticated users can create new records
  - Future enhancement: Add user ownership checks for updates/deletes

  ## Notes
  - Default timestamps are set to now() for all created_date fields
  - Default values set for counters (likes, views, etc.) to 0
  - Numeric fields use appropriate defaults
  - Arrays default to empty arrays
*/

-- Community Profiles Table
CREATE TABLE IF NOT EXISTS community_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  location text DEFAULT '',
  bio text DEFAULT '',
  specialties text[] DEFAULT ARRAY[]::text[],
  phone_number text DEFAULT '',
  email text DEFAULT '',
  profile_image_url text DEFAULT '',
  qr_code_data text DEFAULT '',
  created_date timestamptz DEFAULT now()
);

ALTER TABLE community_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community profiles"
  ON community_profiles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create profiles"
  ON community_profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON community_profiles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Community Groups Table
CREATE TABLE IF NOT EXISTS community_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  topic text DEFAULT 'geral',
  members_count integer DEFAULT 0,
  posts_count integer DEFAULT 0,
  created_by text DEFAULT '',
  created_date timestamptz DEFAULT now()
);

ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view groups"
  ON community_groups FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create groups"
  ON community_groups FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update groups"
  ON community_groups FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Forum Posts Table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text DEFAULT '',
  category text DEFAULT 'general',
  author_name text NOT NULL,
  location text DEFAULT '',
  group_name text DEFAULT '',
  tags text[] DEFAULT ARRAY[]::text[],
  likes integer DEFAULT 0,
  replies_count integer DEFAULT 0,
  created_date timestamptz DEFAULT now()
);

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts"
  ON forum_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON forum_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
  ON forum_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Video Posts Table
CREATE TABLE IF NOT EXISTS video_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'general',
  author_name text NOT NULL,
  thumbnail_url text DEFAULT '',
  video_url text DEFAULT '',
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  created_date timestamptz DEFAULT now()
);

ALTER TABLE video_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos"
  ON video_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create videos"
  ON video_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update videos"
  ON video_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  unit text DEFAULT 'unidade',
  availability text DEFAULT 'available',
  location text DEFAULT '',
  seller_name text NOT NULL,
  seller_contact text DEFAULT '',
  image_url text DEFAULT '',
  created_date timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Experts Table
CREATE TABLE IF NOT EXISTS experts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  organization text DEFAULT '',
  bio text DEFAULT '',
  specializations text[] DEFAULT ARRAY[]::text[],
  service_type text DEFAULT 'free_consultation',
  location text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  rating numeric(3, 2) DEFAULT 0,
  availability text DEFAULT 'available',
  created_date timestamptz DEFAULT now()
);

ALTER TABLE experts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view experts"
  ON experts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create expert profiles"
  ON experts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update expert profiles"
  ON experts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Consultations Table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_name text NOT NULL,
  expert_specialty text DEFAULT '',
  consultation_type text NOT NULL,
  scheduled_date timestamptz NOT NULL,
  duration integer DEFAULT 60,
  description text DEFAULT '',
  price numeric(10, 2) DEFAULT 150.00,
  status text DEFAULT 'scheduled',
  meeting_link text DEFAULT '',
  created_date timestamptz DEFAULT now()
);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view consultations"
  ON consultations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create consultations"
  ON consultations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update consultations"
  ON consultations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_date ON forum_posts(created_date DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_group_name ON forum_posts(group_name);
CREATE INDEX IF NOT EXISTS idx_video_posts_created_date ON video_posts(created_date DESC);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_location ON products(location);
CREATE INDEX IF NOT EXISTS idx_experts_location ON experts(location);
CREATE INDEX IF NOT EXISTS idx_consultations_scheduled_date ON consultations(scheduled_date DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
