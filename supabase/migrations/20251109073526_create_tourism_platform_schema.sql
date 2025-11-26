/*
  # Tourism Platform Database Schema

  ## Overview
  Complete database schema for a travel and tourism platform connecting tourists with drivers, guides, and destinations.

  ## New Tables Created

  ### 1. profiles
  Extended user profiles with tourism-specific data
  - `id` (uuid, references auth.users)
  - `full_name` (text)
  - `phone` (text)
  - `avatar_url` (text, nullable)
  - `user_type` (text: 'tourist', 'driver', 'guide')
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. destinations
  Tourist destinations across India
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `state` (text)
  - `city` (text)
  - `image_url` (text)
  - `category` (text: 'heritage', 'nature', 'adventure', 'spiritual', 'beach')
  - `rating` (numeric)
  - `popular` (boolean)
  - `created_at` (timestamptz)

  ### 3. drivers
  Driver profiles and availability
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `vehicle_type` (text: 'sedan', 'suv', 'luxury', 'tempo')
  - `vehicle_number` (text)
  - `license_number` (text)
  - `rating` (numeric)
  - `total_rides` (integer)
  - `available` (boolean)
  - `current_location` (text)
  - `created_at` (timestamptz)

  ### 4. guides
  Local guide profiles
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `specialization` (text[])
  - `languages` (text[])
  - `experience_years` (integer)
  - `hourly_rate` (numeric)
  - `rating` (numeric)
  - `total_bookings` (integer)
  - `bio` (text)
  - `available` (boolean)
  - `created_at` (timestamptz)

  ### 5. rides
  Ride bookings and requests
  - `id` (uuid, primary key)
  - `tourist_id` (uuid, references profiles)
  - `driver_id` (uuid, references drivers, nullable)
  - `pickup_location` (text)
  - `dropoff_location` (text)
  - `pickup_time` (timestamptz)
  - `passengers` (integer)
  - `vehicle_preference` (text)
  - `status` (text: 'pending', 'accepted', 'ongoing', 'completed', 'cancelled')
  - `fare` (numeric)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. guide_bookings
  Guide booking requests
  - `id` (uuid, primary key)
  - `tourist_id` (uuid, references profiles)
  - `guide_id` (uuid, references guides)
  - `destination_id` (uuid, references destinations, nullable)
  - `booking_date` (date)
  - `duration_hours` (integer)
  - `status` (text: 'pending', 'confirmed', 'completed', 'cancelled')
  - `total_cost` (numeric)
  - `created_at` (timestamptz)

  ### 7. reviews
  Reviews for rides and guides
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `reviewee_id` (uuid)
  - `reviewee_type` (text: 'driver', 'guide')
  - `rating` (integer, 1-5)
  - `comment` (text)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Authenticated users can read public data
  - Users can manage their own bookings and profiles
  - Drivers and guides can update their own profiles
  - Reviews are public but can only be created by authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  user_type text NOT NULL DEFAULT 'tourist' CHECK (user_type IN ('tourist', 'driver', 'guide')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  state text NOT NULL,
  city text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL CHECK (category IN ('heritage', 'nature', 'adventure', 'spiritual', 'beach')),
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Destinations are viewable by everyone"
  ON destinations FOR SELECT
  TO authenticated
  USING (true);

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_type text NOT NULL CHECK (vehicle_type IN ('sedan', 'suv', 'luxury', 'tempo')),
  vehicle_number text NOT NULL,
  license_number text NOT NULL,
  rating numeric DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  total_rides integer DEFAULT 0,
  available boolean DEFAULT true,
  current_location text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers are viewable by authenticated users"
  ON drivers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Drivers can update own profile"
  ON drivers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create guides table
CREATE TABLE IF NOT EXISTS guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  specialization text[] NOT NULL,
  languages text[] NOT NULL,
  experience_years integer DEFAULT 0,
  hourly_rate numeric NOT NULL,
  rating numeric DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  total_bookings integer DEFAULT 0,
  bio text,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guides are viewable by authenticated users"
  ON guides FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Guides can update own profile"
  ON guides FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create rides table
CREATE TABLE IF NOT EXISTS rides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tourist_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES drivers(id),
  pickup_location text NOT NULL,
  dropoff_location text NOT NULL,
  pickup_time timestamptz NOT NULL,
  passengers integer NOT NULL DEFAULT 1,
  vehicle_preference text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'ongoing', 'completed', 'cancelled')),
  fare numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rides"
  ON rides FOR SELECT
  TO authenticated
  USING (tourist_id = auth.uid() OR driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));

CREATE POLICY "Tourists can create rides"
  ON rides FOR INSERT
  TO authenticated
  WITH CHECK (tourist_id = auth.uid());

CREATE POLICY "Users can update own rides"
  ON rides FOR UPDATE
  TO authenticated
  USING (tourist_id = auth.uid() OR driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()))
  WITH CHECK (tourist_id = auth.uid() OR driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));

-- Create guide_bookings table
CREATE TABLE IF NOT EXISTS guide_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tourist_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guide_id uuid NOT NULL REFERENCES guides(id),
  destination_id uuid REFERENCES destinations(id),
  booking_date date NOT NULL,
  duration_hours integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_cost numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guide_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own guide bookings"
  ON guide_bookings FOR SELECT
  TO authenticated
  USING (tourist_id = auth.uid() OR guide_id IN (SELECT id FROM guides WHERE user_id = auth.uid()));

CREATE POLICY "Tourists can create guide bookings"
  ON guide_bookings FOR INSERT
  TO authenticated
  WITH CHECK (tourist_id = auth.uid());

CREATE POLICY "Users can update own guide bookings"
  ON guide_bookings FOR UPDATE
  TO authenticated
  USING (tourist_id = auth.uid() OR guide_id IN (SELECT id FROM guides WHERE user_id = auth.uid()))
  WITH CHECK (tourist_id = auth.uid() OR guide_id IN (SELECT id FROM guides WHERE user_id = auth.uid()));

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL,
  reviewee_type text NOT NULL CHECK (reviewee_type IN ('driver', 'guide')),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Insert sample destinations
INSERT INTO destinations (name, description, state, city, image_url, category, rating, popular) VALUES
('Taj Mahal', 'One of the Seven Wonders of the World, this iconic white marble mausoleum is a symbol of eternal love.', 'Uttar Pradesh', 'Agra', 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg', 'heritage', 4.8, true),
('Goa Beaches', 'Beautiful sandy beaches, vibrant nightlife, and Portuguese heritage make Goa a perfect tropical getaway.', 'Goa', 'Panaji', 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg', 'beach', 4.7, true),
('Kerala Backwaters', 'Serene network of lagoons and lakes offering houseboat cruises through lush green landscapes.', 'Kerala', 'Alleppey', 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg', 'nature', 4.9, true),
('Jaipur City Palace', 'The Pink City offers magnificent forts, palaces, and vibrant Rajasthani culture.', 'Rajasthan', 'Jaipur', 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg', 'heritage', 4.6, true),
('Ladakh Mountains', 'High-altitude desert with stunning landscapes, Buddhist monasteries, and adventure activities.', 'Ladakh', 'Leh', 'https://images.pexels.com/photos/1vikesh-singh/pexels-photo-1vikesh-singh.jpeg', 'adventure', 4.9, true),
('Varanasi Ghats', 'Ancient spiritual city on the banks of Ganges, known for its sacred temples and rituals.', 'Uttar Pradesh', 'Varanasi', 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg', 'spiritual', 4.7, true),
('Andaman Islands', 'Pristine beaches, crystal clear waters, and rich marine life perfect for diving and snorkeling.', 'Andaman and Nicobar', 'Port Blair', 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg', 'beach', 4.8, true),
('Mysore Palace', 'Magnificent royal palace showcasing Indo-Saracenic architecture and rich cultural heritage.', 'Karnataka', 'Mysore', 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg', 'heritage', 4.5, false),
('Rishikesh', 'Yoga capital of the world, offering river rafting, spiritual retreats, and Himalayan views.', 'Uttarakhand', 'Rishikesh', 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg', 'spiritual', 4.6, true),
('Munnar Tea Gardens', 'Rolling hills covered with tea plantations, perfect for nature lovers and photographers.', 'Kerala', 'Munnar', 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg', 'nature', 4.7, false)
ON CONFLICT DO NOTHING;