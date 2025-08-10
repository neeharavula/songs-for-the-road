"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/add-memory-dialog";

export default function Nav() {
  return (
    <nav className="w-full flex items-center justify-between p-8 font-mono text-sm">
      {/* Dialog wrapper for Add a Memory */}
      <Dialog>
        <DialogTrigger className="p-2 hover:bg-[#D96466] text-white rounded-lg">
          ADD A MEMORY
        </DialogTrigger>
        <DialogContent className="bg-[#1B1B1B] p-8 rounded-lg shadow-lg">
          <DialogHeader className="text-center text-white text-sm">
            <DialogTitle>NEW MEMORY</DialogTitle>
          </DialogHeader>

          {/* Your form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Form submitted");
              // TODO: send data to Supabase
            }}
            className="flex flex-col gap-6 mt-6 text-white"
          >
            <input
              type="text"
              placeholder="Where did you go?"
              className="bg-[#303030] placeholder:text-[#686868] text-xs rounded p-2"
            />
            <input
              type="text"
              placeholder="What did you hear?"
              className="bg-[#303030] placeholder:text-[#686868] text-xs rounded p-2"
            />
            <div className="flex gap-2">
              <input
                type="date"
                className="bg-[#303030] text-white text-xs rounded p-2 flex-1"
              />
              <input
                type="date"
                className="bg-[#303030] text-white text-xs rounded p-2 flex-1"
              />
            </div>
            <textarea
              placeholder="Notes"
              className="bg-[#303030] placeholder:text-[#686868] text-xs rounded p-2"
            ></textarea>

            <button
              type="submit"
              className="px-4 py-2 bg-[#D96466] text-white rounded"
            >
              Add to Map
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Center title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <button>SONGS FOR THE ROAD</button>
      </div>

      {/* Other nav link */}
      <button>PASSPORT</button>
    </nav>
  );
}
