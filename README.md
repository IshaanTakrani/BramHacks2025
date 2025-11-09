# 🌋 Project Nacme: Badlands

## Multi-Hazard Early Warning and Readiness Network

Badlands has evolved into a multi-hazard early warning and readiness network that blends satellite detection, local forecasting, and community-level action for wildfires, floods, storms, heatwaves, earthquakes, and more.

## 🌎 Core Idea

Badlands is an intelligent disaster awareness and readiness platform that fuses satellite intelligence, ground data, and community inputs into one system. It doesn’t just detect disasters — it predicts, localizes, and helps people act early.

Each community receives a live Hazard Index (HZ Index) — a simple number (0–10) representing the combined local risk level — and personalized guidance for prevention, preparation, and evacuation.

## 🛰️ What Makes Badlands Different

### 1. Local “Satellite + Earth Data” Fusion Model

Most systems focus on single hazards. Badlands fuses multiple data sources across events:

- **Satellites:** VIIRS, Sentinel-2, MODIS, GOES
- **Weather APIs:** Humidity, rainfall, temperature, wind (Open Weather Map API), NASA Earthdata for natural disaster info.
- **Geospatial layers:** topography, river basins, vegetation, soil moisture, seismic zones
- **Human inputs:** local reports and observations

This creates a dynamic multi-hazard risk map that updates every few hours, even before an event is detected.

### 2. Community-Level Hazard Index (HZ Index)

Instead of just showing “alert” or “no alert,” users see a real-time HZ Index (0–10) for their exact area:

| Range | Risk Level | Meaning                                     |
| :---- | :--------- | :------------------------------------------ |
| 0–3   | Safe       | Normal conditions                           |
| 4–6   | Moderate   | Watch for advisories                        |
| 7–8   | High       | Prepare defensible space / emergency kit    |
| 9–10  | Extreme    | High likelihood of disaster or nearby event |

Each level includes localized, plain-language guidance — like: “Check for flood advisories,” “Secure outdoor equipment,” or “Move valuables to higher ground.” When risk spikes, the app shows nearby shelters, hospitals, and evacuation routes automatically.

### 3. “Prevent Before You Panic” Network

Badlands empowers local action before official alerts arrive. Residents, volunteers, and emergency responders can:

- Report hazards (smoke, flash floods, cracked infrastructure, landslides).
- Get verified feedback through satellite and ground sensors.

This creates a human–satellite hybrid detection network, accelerating early warnings.

### 4. Offline Readiness Mode

In rural or disaster-prone zones with poor connectivity:

- Badlands downloads 48 hours of risk data whenever online.

### 5. Adaptive Alert Prioritization

No more one-size-fits-all alerts. Badlands personalizes warnings based on:

- Distance from the hazard
- Forecast path (e.g., floodwater, fire, or storm trajectory)
- Accessibility (road blockages, elevation)
- User type (homeowner, farmer, hiker, driver)

You get actionable alerts — not just sirens.

### 6. AI-Driven Verification Layer

To reduce false alarms, Badlands uses an AI filter that checks:

- **Persistence:** Does the hazard remain across time intervals?
- **Context:** land type, water presence, population density
- **Historical patterns:** previous disaster occurrences

This ensures accuracy before alerts reach the public.

## 🧩 Implementation Plan (Hackathon-Scale)

### Phase 1 (MVP, 48 hours)

- Integrate real-time data (NASA FIRMS, OpenWeather, flood/storm APIs)
- Generate a sample HZ Index heatmap for a pilot region
- Send mock alerts with localized preparation steps
- Add AI verification for false positives
- Build offline-ready hazard maps for low-signal regions

### Phase 2 (Post-hack Expansion)

- Enable crowdsourced hazard reports
- Create an app so that when offline, users receive vibration, tone, or light-based alerts when new hazards are predicted or nearby.

## 🚀 Differentiator Summary

| Category     | Existing Systems                    | Badlands                                        |
| :----------- | :---------------------------------- | :---------------------------------------------- |
| Detection    | Hazard-specific (fire, flood, etc.) | Multi-hazard fusion (fire, flood, storm, quake) |
| Data Sources | Satellite-only                      | Satellite + weather + terrain + human reports   |
| Alerts       | Broad regional                      | Personalized & adaptive                         |
| Focus        | Government & agencies               | Everyday community readiness                    |
| Prediction   | Reactive (after the event starts)   | Proactive (before ignition, flood, or storm)    |
| Readiness    | Limited                             | Step-by-step community guidance                 |
| Connectivity | Online-only                         | Works offline with cached data                  |

## 👥 Team

- **Dulmi:** Presentation
- **Sidak:** Frontend
- **Jerome:** Frontend
- **Omar:** Presentation
- **Ishaan:** Backend
