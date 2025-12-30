"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/add-memory-dialog";
import LocationInput, { LocationValue } from "@/components/ui/location-input";
import TrackSearchInput, {
  type SimpleTrack,
} from "@/components/ui/track-search-input";
import { useIsMobile } from "@/hooks/use-is-mobile";

export default function Nav() {
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  type FormData = {
    location: LocationValue | null;
    song: SimpleTrack | null;
    month: string;
    year: string;
    notes: string;
  };

  const initialForm: FormData = {
    location: null,
    song: null,
    month: "",
    year: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!isDialogOpen) {
      // Reset form on dialog close
      setFormData(initialForm);
    }
  }, [isDialogOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the data for the API
    const payload = {
      location_name: formData.location?.name || "",
      latitude: formData.location?.coordinates[1] || 0,
      longitude: formData.location?.coordinates[0] || 0,
      track_name: formData.song?.name || "",
      track_artist: formData.song?.artists || "",
      track_album: formData.song?.album || null,
      track_image_url: formData.song?.image || null,
      track_preview_url: formData.song?.previewUrl || null,
      spotify_track_id: formData.song?.id || null,
      memory_month: formData.month ? parseInt(formData.month) : null,
      memory_year: formData.year ? parseInt(formData.year) : null,
      notes: formData.notes || null,
    };

    try {
      // Send the data to our API
      const response = await fetch("/api/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to save memory:", result.error);
        alert("Failed to save memory. Please try again.");
        return;
      }

      console.log("Memory saved successfully:", result.memory);
      setIsDialogOpen(false);

      // Trigger map refresh
      window.dispatchEvent(new Event('refreshMemories'));
    } catch (error) {
      console.error("Error saving memory:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <nav className="w-full flex items-center justify-between p-8 font-mono text-xs">
      {!isMobile && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="p-2 hover:bg-[#D96466] text-white rounded-lg">
            ADD A MEMORY
          </DialogTrigger>

          <DialogContent className="bg-[#1B1B1B] p-8 shadow-xl">
            <DialogHeader className="text-center text-white text-xs">
              <DialogTitle>NEW MEMORY</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 mt-6 text-xs text-white"
            >
              <LocationInput
                value={formData.location}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, location: val }))
                }
              />

              <TrackSearchInput
                value={formData.song}
                onChange={(track) =>
                  setFormData((prev) => ({ ...prev, song: track }))
                }
                className=""
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Month"
                  value={formData.month}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      month: e.target.value,
                    }))
                  }
                  className="bg-[#303030] text-white placeholder:text-[#686868] rounded-lg p-2 flex-1"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, year: e.target.value }))
                  }
                  className="bg-[#303030] text-white placeholder:text-[#686868] rounded-lg p-2 flex-1"
                />
              </div>

              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="bg-[#303030] placeholder:text-[#686868] rounded-lg p-2"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-[#D96466] text-white rounded-lg"
                disabled={!formData.location || !formData.song}
              >
                Add to Map
              </button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <button>SONGS FOR THE ROAD</button>
      </div>

      {!isMobile && <button>PASSPORT</button>}
    </nav>
  );
}
