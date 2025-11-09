import requests


def normalize(value, min_val, max_val):
    """Clamp and scale to 0–1 safely."""
    if value is None:
        return 0
    return max(0.0, min((value - min_val) / (max_val - min_val), 1.0))


def calculateHazard(lat, lon):
    # === 1. Weather data ===
    w = requests.get(
        f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,precipitation,wind_speed_10m"
    ).json()["current"]

    temp = w.get("temperature_2m", 0)
    rain = w.get("precipitation", 0)
    wind = w.get("wind_speed_10m", 0)

    # === 2. Fire data ===
    fire_url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/demo/VIIRS_NOAA20_NRT/{lat}/{lon}/50/24"
    try:
        fire_text = requests.get(fire_url, timeout=10).text
        fire_count = max(fire_text.count("\n") - 1, 0)
    except Exception:
        fire_count = 0

    heat_score = normalize(temp, 10, 45)  # below 10°C = 0 risk
    rain_score = normalize(rain, 0, 50)  # heavy rain = flood risk
    wind_score = normalize(wind, 0, 80)  # high wind = storm risk
    fire_score = min(fire_count / 10, 1.0)  # normalize fire detections (0–10)

    hz_raw = (
        0.35 * heat_score + 0.25 * rain_score + 0.25 * wind_score + 0.15 * fire_score
    )

    # Scale to 0–10 and clamp
    hz_index = round(max(0, min(hz_raw * 10, 10)), 1)

    return {
        "lat": lat,
        "lon": lon,
        "temperature": temp,
        "rain": rain,
        "wind": wind,
        "fire_count": fire_count,
        "hazard_index": hz_index,
    }


# print(hazard(25.6, 46.8))
