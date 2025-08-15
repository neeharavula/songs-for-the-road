"use client";

import * as React from "react";

export type SimpleTrack = {
  id: string;
  name: string;
  artists: string;
  album: string;
  image: string | null;
  previewUrl: string | null;
  uri: string;
};

type Props = {
  value: SimpleTrack | null;
  onChange: (track: SimpleTrack | null) => void;
  placeholder?: string;
  className?: string;
};

export default function TrackSearchInput({
  value,
  onChange,
  placeholder = "What did you hear?",
  className,
}: Props) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SimpleTrack[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [highlight, setHighlight] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Show selected track label in input; otherwise show query
  const inputValue = value ? `${value.name} — ${value.artists}` : query;

  // Debounced search
  React.useEffect(() => {
    if (!query || query.length < 2 || value) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    setError(null);
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&limit=8`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data?.error || `Search failed (${res.status})`);
          setResults([]);
          setOpen(false);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setResults(data.tracks || []);
        setOpen(true);
        setHighlight(0);
      } catch (e: any) {
        setError(e?.message || "Network error");
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(id);
  }, [query, value]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectTrack(t: SimpleTrack) {
    onChange(t);
    setOpen(false);
    setQuery("");
  }

  function clearSelection() {
    onChange(null);
    setQuery("");
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectTrack(results[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className={["relative", className].filter(Boolean).join(" ")} ref={containerRef}>
      {/* Input */}
      <div className="flex items-center gap-2 bg-[#303030] rounded-lg px-2">
        {/* Show selected track inside input */}
        {value ? (
          <div className="flex items-center gap-2 py-2 flex-1">
            {value.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value.image} alt="" className="h-6 w-6 rounded flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs truncate">{value.name}</div>
              <div className="text-white/60 text-xs truncate">{value.artists}</div>
            </div>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onFocus={() => {
              if (results.length > 0) setOpen(true);
            }}
            onKeyDown={onKeyDown}
            className="w-full bg-transparent placeholder:text-[#686868] pt-2 pb-2 text-white outline-none"
            aria-autocomplete="list"
            aria-expanded={open}
            role="combobox"
          />
        )}
        
        {value && (
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs text-white/70 hover:text-white flex-shrink-0 p-1"
            aria-label="Clear selected track"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-2 w-full rounded-lg border border-[#3a3a3a] bg-[#1E1E1E] shadow-xl overflow-hidden"
        >
          {loading && (
            <div className="px-3 py-2 text-xs text-white/70">Searching…</div>
          )}
          {!loading && error && (
            <div className="px-3 py-2 text-xs text-red-400">{error}</div>
          )}
          {!loading && !error && results.length === 0 && (
            <div className="px-3 py-2 text-xs text-white/70">No results</div>
          )}
          {!loading &&
            !error &&
            results.map((t, i) => (
              <button
                key={t.id}
                role="option"
                aria-selected={i === highlight}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => selectTrack(t)}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2 text-left",
                  i === highlight ? "bg-[#2A2A2A]" : "bg-transparent",
                  "hover:bg-[#2A2A2A]",
                ].join(" ")}
              >
                {t.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.image}
                    alt=""
                    className="h-8 w-8 rounded"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-8 w-8 rounded bg-[#303030]" />
                )}
                <div className="flex-1">
                  <div className="text-xs text-white">{t.name}</div>
                  <div className="text-[10px] text-white/60">
                    {t.artists} • {t.album}
                  </div>
                </div>
                {/* Optional: preview icon if available */}
                {t.previewUrl && (
                  <span className="text-[10px] text-white/50">Preview</span>
                )}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}