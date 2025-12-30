"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { type Memory } from "@/lib/supabase";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);

  // Function to fetch memories
  const fetchMemories = async () => {
    try {
      const response = await fetch("/api/memories");
      const data = await response.json();
      if (data.memories) {
        setMemories(data.memories);
      }
    } catch (error) {
      console.error("Error fetching memories:", error);
    }
  };

  // Fetch memories from the API once on mount
  useEffect(() => {
    fetchMemories();
  }, []);

  // Listen for custom event to refresh memories
  useEffect(() => {
    const handleRefresh = () => {
      fetchMemories();
    };

    window.addEventListener('refreshMemories', handleRefresh);
    return () => window.removeEventListener('refreshMemories', handleRefresh);
  }, []);

  // Initialize the map
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/nravula/cmdkhc2s1008701sj6phihmpi",
      center: [-73.9857, 40.7484],
      zoom: 3,
      attributionControl: false,
    });

    map.addControl(
      new mapboxgl.AttributionControl({ compact: false }),
      "bottom-right"
    );

    mapInstance.current = map;

    return () => {
      // Clean up markers before removing map
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
    };
  }, []);

  // Add markers for each memory using GeoJSON layer
  useEffect(() => {
    if (!mapInstance.current) return;

    const map = mapInstance.current;

    // Wait for map to load before adding sources/layers
    if (!map.isStyleLoaded()) {
      map.once("load", () => {
        addMemoriesToMap(map, memories);
      });
    } else {
      addMemoriesToMap(map, memories);
    }
  }, [memories]);

  const addMemoriesToMap = (map: mapboxgl.Map, memories: Memory[]) => {
    // Remove existing layer and source if they exist
    if (map.getLayer("memories")) {
      map.removeLayer("memories");
    }
    if (map.getSource("memories")) {
      map.removeSource("memories");
    }

    if (memories.length === 0) return;

    // Load custom icon image if not already loaded
    if (!map.hasImage("music-note-icon")) {
      map.loadImage("/music-note-pin.png", (error, image) => {
        if (error) throw error;
        if (image) map.addImage("music-note-icon", image);
      });
    }

    // Create GeoJSON data from memories
    const geojson = {
      type: "FeatureCollection" as const,
      features: memories.map((memory) => ({
        type: "Feature" as const,
        properties: {
          id: memory.id,
          location_name: memory.location_name,
          track_name: memory.track_name,
          track_artist: memory.track_artist,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [memory.longitude, memory.latitude],
        },
      })),
    };

    // Add source
    map.addSource("memories", {
      type: "geojson",
      data: geojson,
    });

    // Add layer with custom icon
    map.addLayer({
      id: "memories",
      type: "symbol",
      source: "memories",
      layout: {
        "icon-image": "music-note-icon",
        "icon-size": 0.2, // Adjust this to scale the icon (0.5 = 50% of original size)
        "icon-anchor": "bottom",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
    });

    console.log(
      `Added ${memories.length} markers to the map using custom icon`
    );
  };

  return (
    <div className="w-full h-[85vh] p-8 flex flex-col rounded-2xl">
      {/* Padding wrapper that creates the inset padding */}
      <div className="relative flex-grow rounded-2xl shadow-xl overflow-hidden">
        {/* Inner container fills padded wrapper fully */}
        <div
          ref={mapContainer}
          className="absolute inset-0 rounded-2xl"
          style={{ margin: 0, padding: 0 }}
        />
      </div>

      {/* Attribution below the map */}
      <div className="mt-4 text-xs text-[#666666] text-right">
        ©{" "}
        <a
          href="https://www.mapbox.com/about/maps/"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mapbox
        </a>
        , ©{" "}
        <a
          href="https://www.openstreetmap.org/about/"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenStreetMap
        </a>
      </div>
    </div>
  );
}
