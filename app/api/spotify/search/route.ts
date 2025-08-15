// app/api/spotify/search/route.ts
import { NextResponse } from "next/server";
import { getAppAccessToken } from "@/lib/spotify";

export const dynamic = "force-dynamic"; // safer for dev; can tune later

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const limit = Number(searchParams.get("limit") || 8);

    if (!q || q.length < 2) {
      return NextResponse.json({ tracks: [] });
    }

    const token = await getAppAccessToken();

    const sp = new URL("https://api.spotify.com/v1/search");
    sp.searchParams.set("q", q);
    sp.searchParams.set("type", "track");
    sp.searchParams.set("limit", String(Math.max(1, Math.min(limit, 10))));

    const res = await fetch(sp.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 429) {
      // Rate limited – surface a gentle signal to client
      return NextResponse.json({ tracks: [], rateLimited: true }, { status: 429 });
    }

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Spotify search failed: ${res.status} ${text}` },
        { status: 500 }
      );
    }

    const data = await res.json();

    // Map to a small, UI-friendly shape
    const tracks =
      data?.tracks?.items?.map((t: any) => ({
        id: t.id as string,
        name: t.name as string,
        artists: (t.artists || []).map((a: any) => a.name).join(", "),
        album: t.album?.name as string,
        image:
          t.album?.images?.[1]?.url || // medium
          t.album?.images?.[0]?.url || // large
          t.album?.images?.[2]?.url || // small
          null,
        previewUrl: t.preview_url as string | null,
        uri: t.uri as string,
      })) ?? [];

    return NextResponse.json({ tracks });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
