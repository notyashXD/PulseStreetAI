import {
  AQIData,
  AQITrendPoint,
  WeatherData,
  OutdoorGuidanceLevel,
} from "@/lib/types";

export type { AQIData, WeatherData, AQITrendPoint, OutdoorGuidanceLevel };

function sampleAQI(): AQIData {
  return {
    aqi: 148,
    pm25: 62.4,
    pm10: 94.1,
    no2: 38.2,
    o3: 31.0,
    category: "Unhealthy for Sensitive",
    fetchedAt: new Date().toISOString(),
  };
}

function sampleWeather(): WeatherData {
  return {
    temperature: 29.5,
    humidity: 72,
    windSpeed: 8.2,
    windDirection: 230,
    weatherCode: 3,
    description: "Partly cloudy",
    fetchedAt: new Date().toISOString(),
  };
}

function sampleTrend(): AQITrendPoint[] {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    time: new Date(now - (23 - i) * 3600000).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    aqi: Math.round(110 + Math.random() * 80),
    pm25: Math.round(40 + Math.random() * 40),
  }));
}

function weatherDescription(code: number): string {
  const map: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Icy fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Light snow",
    80: "Showers",
    95: "Thunderstorm",
  };
  return map[code] ?? "Unknown";
}

function classifyAQI(aqi: number): AQIData["category"] {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function pm25ToAQI(pm25: number): number {
  if (pm25 <= 12) return Math.round((pm25 / 12) * 50);
  if (pm25 <= 35.4) return Math.round(50 + ((pm25 - 12) / 23.4) * 50);
  if (pm25 <= 55.4) return Math.round(100 + ((pm25 - 35.4) / 20) * 50);
  if (pm25 <= 150.4) return Math.round(150 + ((pm25 - 55.4) / 95) * 50);
  return Math.min(500, Math.round(200 + ((pm25 - 150.4) / 100) * 100));
}

export async function fetchAQI(lat: number, lng: number): Promise<AQIData> {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm10,pm2_5,nitrogen_dioxide,ozone&timezone=auto`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error("AQI fetch failed");
    const data = await res.json();
    const current = data.current;
    const pm25: number = current.pm2_5 ?? 0;
    const pm10: number = current.pm10 ?? 0;
    const no2: number = current.nitrogen_dioxide ?? 0;
    const o3: number = current.ozone ?? 0;
    const aqi = pm25ToAQI(pm25);
    return {
      aqi,
      pm25,
      pm10,
      no2,
      o3,
      category: classifyAQI(aqi),
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return sampleAQI();
  }
}

export async function fetchWeather(
  lat: number,
  lng: number
): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error("Weather fetch failed");
    const data = await res.json();
    const current = data.current;
    const code: number = current.weather_code ?? 0;
    return {
      temperature: current.temperature_2m ?? 0,
      humidity: current.relative_humidity_2m ?? 0,
      windSpeed: current.wind_speed_10m ?? 0,
      windDirection: current.wind_direction_10m ?? 0,
      weatherCode: code,
      description: weatherDescription(code),
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return sampleWeather();
  }
}

export async function fetchAQITrend(
  lat: number,
  lng: number
): Promise<AQITrendPoint[]> {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&hourly=pm2_5&past_days=1&timezone=auto&forecast_days=0`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Trend fetch failed");
    const data = await res.json();
    const times: string[] = data.hourly?.time ?? [];
    const pm25s: number[] = data.hourly?.pm2_5 ?? [];
    return times.slice(-24).map((t, i) => ({
      time: new Date(t).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      aqi: pm25ToAQI(pm25s[times.length - 24 + i] ?? 0),
      pm25: Math.round(pm25s[times.length - 24 + i] ?? 0),
    }));
  } catch {
    return sampleTrend();
  }
}

export function getOutdoorGuidance(aqi: number): {
  level: OutdoorGuidanceLevel;
  title: string;
  message: string;
  color: string;
} {
  if (aqi <= 100) {
    return {
      level: "good",
      title: "Normal Outdoor Activity",
      message: "Air quality is within acceptable safety parameters.",
      color: "#22c55e",
    };
  }
  if (aqi <= 150) {
    return {
      level: "caution",
      title: "Moderate Caution Advised",
      message:
        "Sensitive demographics should minimize strenuous outdoor exertion.",
      color: "#f59e0b",
    };
  }
  return {
    level: "avoid",
    title: "Air Quality Alert",
    message:
      "Unhealthy atmospheric particulate concentration. Limit outdoor exposure.",
    color: "#ef4444",
  };
}
