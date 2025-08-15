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
import TrackSearchInput, { type SimpleTrack } from "@/components/ui/track-search-input";

export default function Nav() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  type FormData = {
    location: LocationValue | null;
    song: SimpleTrack | null;
    startDate: string;
    endDate: string;
    notes: string;
  };

  const initialForm: FormData = {
    location: null,
    song: null,
    startDate: "",
    endDate: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!isDialogOpen) {
      // Reset form on dialog close
      setFormData(initialForm);
    }
  }, [isDialogOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      location: formData.location,        // your chosen shape
      trackId: formData.song?.id,
      trackUri: formData.song?.uri,
      trackName: formData.song?.name,
      trackArtists: formData.song?.artists,
      trackImage: formData.song?.image,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      notes: formData.notes || "",
    };

    console.log("Submit form", payload);
    // TODO: POST to your backend and save
    setIsDialogOpen(false);
  };


  return (
    <nav className="w-full flex items-center justify-between p-8 font-mono text-xs">
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
                onChange={(track) => setFormData((prev) => ({ ...prev, song: track }))}
                className=""
              />

            <div className="flex gap-2">
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="bg-[#303030] text-white rounded-lg p-2 flex-1"
              />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="bg-[#303030] text-white rounded-lg p-2 flex-1"
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

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <button>SONGS FOR THE ROAD</button>
      </div>

      <button>PASSPORT</button>
    </nav>
  );
}
