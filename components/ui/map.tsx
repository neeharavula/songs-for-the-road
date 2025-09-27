"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);

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

    return () => map.remove();
  }, []);

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
