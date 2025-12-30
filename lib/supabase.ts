import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// TypeScript type for a Memory record
export type Memory = {
  id: string
  location_name: string
  latitude: number
  longitude: number
  track_name: string
  track_artist: string
  track_album: string | null
  track_image_url: string | null
  track_preview_url: string | null
  spotify_track_id: string | null
  memory_month: number | null
  memory_year: number | null
  notes: string | null
  created_at: string
}
