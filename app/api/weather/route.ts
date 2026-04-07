import { NextResponse } from "next/server";

export const revalidate = 600; // 10 minutes cache

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat") || "48.8566"; // Paris default
  const lon = searchParams.get("lon") || "2.3522";

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m`
    );
    const data = await res.json();

    return NextResponse.json(data.current);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
