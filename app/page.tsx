"use client";

import dynamic from "next/dynamic";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { MobileLanding } from "@/components/mobile-landing";

// Disable SSR to avoid mapbox-gl errors during build
const Map = dynamic(() => import("@/components/ui/map"), { ssr: false });

export default function Home() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLanding />;
  }

  return (
    <main className="flex-grow">
      <Map />
    </main>
  );
}
