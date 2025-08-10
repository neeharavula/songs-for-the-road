"use client";

import dynamic from "next/dynamic";

// Disable SSR to avoid mapbox-gl errors during build
const Map = dynamic(() => import("@/components/ui/map"), { ssr: false });

export default function Home() {
  return (
    <main className="flex-grow">
      <Map />
    </main>
  );
}
