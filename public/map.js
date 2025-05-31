let map;

function initMap() {
  const defaultLocation = [28.6139, 77.2090]; // Delhi

  map = L.map("map").setView(defaultLocation, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  // Fetch Danger Zones after map is initialized
  fetchDangerZones();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const userLocation = [userLat, userLng];

        map.setView(userLocation, 13);

        L.marker(userLocation)
          .addTo(map)
          .bindPopup("📍 Your Location")
          .openPopup();

        fetchThreatLevel(userLat, userLng);
      },
      (error) => {
        let errorMsg = "⚠️ Geolocation failed. Using default location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "❗ Location access denied by user.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "❗ Location unavailable.";
            break;
          case error.TIMEOUT:
            errorMsg = "❗ Location request timed out.";
            break;
          default:
            errorMsg = "❗ Unknown geolocation error.";
        }

        console.warn(errorMsg);
        displayThreatStatus(errorMsg);

        fetchThreatLevel(defaultLocation[0], defaultLocation[1]);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  } else {
    const msg = "⚠️ Geolocation not supported by this browser.";
    console.warn(msg);
    displayThreatStatus(msg);
    fetchThreatLevel(defaultLocation[0], defaultLocation[1]);
  }
}

function displayThreatStatus(msg) {
  if (!window.threatStatusEl) {
    window.threatStatusEl = document.createElement("div");
    Object.assign(window.threatStatusEl.style, {
      margin: "10px",
      padding: "8px",
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
      borderRadius: "4px",
      fontWeight: "bold",
    });
    document.body.insertBefore(window.threatStatusEl, document.body.firstChild);
  }
  window.threatStatusEl.textContent = msg;
}

function fetchThreatLevel(lat, lng) {
  fetch("/api/location-threat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lng }),
  })
    .then((res) => res.json())
    .then((data) => {
      const msg = `Threat Level: ${data.level} (Reports: ${data.count})`;
      console.log(msg);
      displayThreatStatus(msg);

      if (window.threatCircle) {
        map.removeLayer(window.threatCircle);
      }

      let color = "#28a745"; // green
      if (data.level === "Moderate") color = "#ffc107";
      else if (data.level === "High") color = "#fd7e14";
      else if (data.level === "Critical") color = "#dc3545";

      window.threatCircle = L.circle([lat, lng], {
        radius: 2000,
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
      }).addTo(map);
    })
    .catch((err) => {
      console.error("Failed to fetch threat level", err);
      displayThreatStatus("⚠️ Failed to load threat level.");
    });
}

function fetchDangerZones() {
  fetch("/api/danger-zones")
    .then((res) => res.json())
    .then((zones) => {
      zones.forEach(zone => {
        const intensityColor = getColorByCount(zone.count);
        const radius = Math.min(5000, zone.count * 100); // Scale size by report count

        L.circle([zone.lat, zone.lng], {
          radius,
          color: intensityColor,
          fillColor: intensityColor,
          fillOpacity: 0.4,
        }).addTo(map).bindPopup(`🚨 Danger Zone<br>Reports: ${zone.count}`);
      });
    })
    .catch((err) => {
      console.error("Failed to fetch danger zones", err);
    });
}

function getColorByCount(count) {
  if (count >= 15) return "#dc3545";     // Critical
  if (count >= 10) return "#fd7e14";     // High
  if (count >= 5) return "#ffc107";      // Moderate
  return "#28a745";                      // Safe
}

document.addEventListener("DOMContentLoaded", initMap);
