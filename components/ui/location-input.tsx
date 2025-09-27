"use client";

import React, { useState, useEffect, useRef } from "react";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
const GEOCODING_ENDPOINT = "https://api.mapbox.com/geocoding/v5/mapbox.places";

export type LocationValue = {
  name: string;
  coordinates: [number, number]; // [lng, lat]
};

type LocationInputProps = {
  value: LocationValue | null;
  onChange: (val: LocationValue | null) => void;
};

export default function LocationInput({ value, onChange }: LocationInputProps) {
  const [query, setQuery] = useState(value?.name || "");
  const [suggestions, setSuggestions] = useState<LocationValue[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions from Mapbox as user types
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    async function fetchSuggestions() {
      try {
        const res = await fetch(
          `${GEOCODING_ENDPOINT}/${encodeURIComponent(query)}.json?` +
            new URLSearchParams({
              access_token: MAPBOX_ACCESS_TOKEN,
              autocomplete: "true",
              types: "place,region,country",
              limit: "5",
            }),
          { signal: controller.signal }
        );

        if (!res.ok) {
          setSuggestions([]);
          return;
        }

        const data = await res.json();

        const places: LocationValue[] = data.features.map((feature: any) => ({
          name: feature.place_name,
          coordinates: feature.center as [number, number],
        }));

        setSuggestions(places);
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error("Failed to fetch location suggestions", err);
          setSuggestions([]);
        }
      }
    }

    fetchSuggestions();

    return () => controller.abort();
  }, [query]);

  // Hide dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // When value changes externally, update input text
  useEffect(() => {
    setQuery(value?.name || "");
  }, [value]);

  function handleSelect(place: LocationValue) {
    onChange(place);
    setQuery(place.name);
    setDropdownVisible(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    onChange(null); // clear selection while typing
    setDropdownVisible(true);
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        placeholder="Where did you go?"
        value={query}
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) setDropdownVisible(true);
        }}
        className="bg-[#303030] placeholder:text-[#686868] text-xs rounded-lg p-2 w-full"
        autoComplete="off"
      />
      {dropdownVisible && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#1b1b1b] border border-[#555] text-xs shadow-lg">
          {suggestions.map((place, i) => (
            <li
              key={i}
              onClick={() => handleSelect(place)}
              className="cursor-pointer px-3 py-2 hover:bg-[#303030] hover:text-white"
            >
              {place.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
