import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/memories - Create a new memory
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()

    // Extract data from the request
    const {
      location_name,
      latitude,
      longitude,
      track_name,
      track_artist,
      track_album,
      track_image_url,
      track_preview_url,
      spotify_track_id,
      memory_month,
      memory_year,
      notes,
    } = body

    // Validate required fields
    if (!location_name || !latitude || !longitude || !track_name || !track_artist) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert the memory into Supabase
    const { data, error } = await supabase
      .from('memories')
      .insert([
        {
          location_name,
          latitude,
          longitude,
          track_name,
          track_artist,
          track_album,
          track_image_url,
          track_preview_url,
          spotify_track_id,
          memory_month,
          memory_year,
          notes,
        },
      ])
      .select() // Return the inserted record

    // Handle database errors
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save memory', details: error.message },
        { status: 500 }
      )
    }

    // Return the created memory
    return NextResponse.json({ success: true, memory: data[0] }, { status: 201 })
  } catch (error) {
    console.error('Error saving memory:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/memories - Fetch all memories
export async function GET() {
  try {
    // Fetch all memories from Supabase, ordered by creation date (newest first)
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false })

    // Handle database errors
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch memories', details: error.message },
        { status: 500 }
      )
    }

    // Return the memories
    return NextResponse.json({ memories: data }, { status: 200 })
  } catch (error) {
    console.error('Error fetching memories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
