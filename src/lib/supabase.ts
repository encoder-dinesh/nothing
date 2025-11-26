import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  user_type: 'tourist' | 'driver' | 'guide';
  created_at: string;
  updated_at: string;
};

export type Destination = {
  id: string;
  name: string;
  description: string;
  state: string;
  city: string;
  image_url: string;
  category: 'heritage' | 'nature' | 'adventure' | 'spiritual' | 'beach';
  rating: number;
  popular: boolean;
  created_at: string;
};

export type Driver = {
  id: string;
  user_id: string;
  vehicle_type: 'sedan' | 'suv' | 'luxury' | 'tempo';
  vehicle_number: string;
  license_number: string;
  rating: number;
  total_rides: number;
  available: boolean;
  current_location: string | null;
  created_at: string;
};

export type Guide = {
  id: string;
  user_id: string;
  specialization: string[];
  languages: string[];
  experience_years: number;
  hourly_rate: number;
  rating: number;
  total_bookings: number;
  bio: string | null;
  available: boolean;
  created_at: string;
};

export type Ride = {
  id: string;
  tourist_id: string;
  driver_id: string | null;
  pickup_location: string;
  dropoff_location: string;
  pickup_time: string;
  passengers: number;
  vehicle_preference: string;
  status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
  fare: number | null;
  created_at: string;
  updated_at: string;
};

export type GuideBooking = {
  id: string;
  tourist_id: string;
  guide_id: string;
  destination_id: string | null;
  booking_date: string;
  duration_hours: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_cost: number;
  created_at: string;
};

export type Review = {
  id: string;
  user_id: string;
  reviewee_id: string;
  reviewee_type: 'driver' | 'guide';
  rating: number;
  comment: string | null;
  created_at: string;
};
