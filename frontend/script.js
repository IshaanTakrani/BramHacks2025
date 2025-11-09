/*********************
 * STARFIELD (black sky + twinkle)
 *********************/
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const n = Math.min(300, Math.floor((canvas.width * canvas.height) / 11000));
  stars = Array.from({ length: n }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.3 + 0.3,
    tw: Math.random() * 0.05 + 0.01,
    p: Math.random() * Math.PI * 2,
    hue: 210 + Math.random() * 40, // cool white/blue tone variety
  }));
}
function drawStars(t = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    const a = 0.55 + Math.sin(t * s.tw + s.p) * 0.35; // twinkle
    ctx.globalAlpha = a;
    ctx.fillStyle = `hsl(${s.hue} 100% 90%)`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}
window.addEventListener("resize", resize);
resize();
requestAnimationFrame(drawStars);

/*********************
 * HZ INDEX DEMO (animated value)
 *********************/
const hzValEl = document.getElementById("hz-val");
const hzRiskEl = document.getElementById("hz-risk");
const tryBtn = document.getElementById("try-demo");

function riskFromValue(v) {
  if (v <= 3) return { label: "Safe", color: "#146b46" };
  if (v <= 6) return { label: "Moderate", color: "#d97706" };
  if (v <= 8) return { label: "High Risk", color: "#f97316" };
  return { label: "Extreme", color: "#e24f40" };
}
function animateHZ(toVal) {
  const from = parseFloat(hzValEl.textContent) || 5.0;
  const start = performance.now();
  const dur = 700;
  function tick(now) {
    const k = Math.min(1, (now - start) / dur);
    const v = from + (toVal - from) * k;
    const risk = riskFromValue(v);
    hzValEl.textContent = v.toFixed(1);
    hzRiskEl.textContent = risk.label;
    hzRiskEl.style.color = risk.color;
    if (k < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
tryBtn.addEventListener("click", () => {
  const target = Math.max(0, Math.min(10, 3 + Math.random() * 7));
  animateHZ(target);
  document.getElementById("mapEl").scrollIntoView({ behavior: "smooth" });
});

/*********************
 * LEAFLET MAP (FREE, OSM)
 *********************/
let map;
let userLat = 43.653; // Default to Toronto
let userLon = -79.383; // Default to Toronto

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
        localStorage.setItem("userLat", userLat);
        localStorage.setItem("userLon", userLon);
        console.log("Location obtained:", userLat, userLon);
        // Re-initialize map with new location if it's already loaded
        if (map) {
          map.setView([userLat, userLon], 10);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        // Fallback to stored location if available
        const storedLat = localStorage.getItem("userLat");
        const storedLon = localStorage.getItem("userLon");
        if (storedLat && storedLon) {
          userLat = parseFloat(storedLat);
          userLon = parseFloat(storedLon);
          console.log("Using stored location:", userLat, userLon);
          if (map) {
            map.setView([userLat, userLon], 10);
          }
        }
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
    // Fallback to stored location if available
    const storedLat = localStorage.getItem("userLat");
    const storedLon = localStorage.getItem("userLon");
    if (storedLat && storedLon) {
      userLat = parseFloat(storedLat);
      userLon = parseFloat(storedLon);
      console.log("Using stored location:", userLat, userLon);
    }
  }
}

function initMap() {
  // Try to get location from localStorage first
  const storedLat = localStorage.getItem("userLat");
  const storedLon = localStorage.getItem("userLon");
  if (storedLat && storedLon) {
    userLat = parseFloat(storedLat);
    userLon = parseFloat(storedLon);
    console.log("Using stored location for map init:", userLat, userLon);
  } else {
    // If not in localStorage, try to get current location
    getLocation();
  }

  map = L.map("mapEl").setView([userLat, userLon], 10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
  }).addTo(map);

  // Demo HZ bubbles
  const demo = [
    { lat: 43.7, lon: -79.4, hz: 6.8 },
    { lat: 43.63, lon: -79.3, hz: 7.9 },
    { lat: 43.58, lon: -79.55, hz: 4.2 },
  ];
  demo.forEach((p) => {
    const risk = riskFromValue(p.hz);
    L.circle([p.lat, p.lon], {
      radius: 2000 + p.hz * 400,
      color: risk.color,
      weight: 2,
      fillColor: risk.color,
      fillOpacity: 0.15,
    })
      .addTo(map)
      .bindPopup(`<b>HZ ${p.hz.toFixed(1)}</b><br>${risk.label}`);
  });
}

async function getHazardIndex(lat, lon) {
  try {
    const res = await fetch("http://localhost:8000/hz/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: lat.toString(), lon: lon.toString() }),
    });
    const data = await res.json();
    if (data && data.hz) {
      console.log("Hazard Index:", data.hz);
      animateHZ(data.hz);

      // Add user's hazard index as a point on the map
      const risk = riskFromValue(data.hz);
      L.circle([lat, lon], {
        radius: 2000 + data.hz * 400,
        color: risk.color,
        weight: 2,
        fillColor: risk.color,
        fillOpacity: 0.15,
      })
        .addTo(map)
        .bindPopup(`<b>Your HZ ${data.hz.toFixed(1)}</b><br>${risk.label}`);

      return data.hz;
    }
  } catch (e) {
    console.error("Error fetching hazard index:", e);
  }
  return null;
}

window.addEventListener("load", () => {
  initMap();
  // After map is initialized and location is potentially set, fetch hazard index
  // This will use the default Toronto location if geolocation fails or is not supported
  getHazardIndex(userLat, userLon);
});

/*********************
 * NEWSLETTER / ALERTS (FREE)
 * - Default: store locally (no backend)
 * - Optional: send to Formspree (free) by setting FORMSPREE_ID
 *********************/
const FORMSPREE_ID = ""; // e.g. "xyzzabcd" from https://formspree.io  (leave blank to skip)
const newsletterForm = document.getElementById("newsletter-form");
const toast = document.getElementById("newsletter-msg");

newsletterForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const threshold = document.getElementById("threshold").value;

  // Local persistence (free)
  const subs = JSON.parse(localStorage.getItem("badlands_subs") || "[]");
  subs.push({ email, threshold, ts: Date.now() });
  localStorage.setItem("badlands_subs", JSON.stringify(subs));

  // Optional free submit
  if (FORMSPREE_ID) {
    try {
      await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(newsletterForm),
      });
    } catch (err) {
      console.warn("Formspree send failed (still saved locally).", err);
    }
  }

  toast.textContent = `Subscribed ${email} • HZ ≥ ${threshold}.`;
  toast.style.display = "inline-block";
  newsletterForm.reset();
});

/*********************
 * AI CHAT HOOK (optional, local FastAPI)
 *********************/
async function askAI(prompt) {
  try {
    const res = await fetch("http://localhost:8000/aichat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });
    const data = await res.json();
    if (data && data.response) return data.response;
  } catch (e) {
    console.error(e);
  }
  return "Error: Could not get a response from AI.";
}

const chatPopup = document.getElementById("chat-popup");
const openChatBtn = document.getElementById("open-chat-btn");
const closeChatBtn = document.getElementById("close-chat");
const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-input");
const chatSubmit = document.getElementById("chat-submit");

openChatBtn.addEventListener("click", () => (chatPopup.style.display = "flex"));
closeChatBtn.addEventListener(
  "click",
  () => (chatPopup.style.display = "none")
);
chatSubmit.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;
  appendMessage(userMessage, "user");
  chatInput.value = "";

  const currentLat = localStorage.getItem("userLat") || userLat;
  const currentLon = localStorage.getItem("userLon") || userLon;

  const promptWithLocation = `User message: "${userMessage}". Current location: Latitude ${currentLat}, Longitude ${currentLon}.`;

  const aiResponse = await askAI(promptWithLocation);
  appendMessage(aiResponse, "ai");
}
function appendMessage(message, sender) {
  const el = document.createElement("div");
  el.classList.add("message", sender);
  el.textContent = message;
  chatBody.appendChild(el);
  chatBody.scrollTop = chatBody.scrollHeight;
}
