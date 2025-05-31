document.addEventListener("DOMContentLoaded", () => {
  const threatStatusEl = document.getElementById("threat-status");
  const reportForm = document.getElementById("report-form");
  const reportText = document.getElementById("report-text");
  const reportLocation = document.getElementById("report-location");
  const reportStatus = document.getElementById("report-status");

  let userLat = null;
  let userLng = null;

  // Get user's current location
  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userLat = pos.coords.latitude;
          userLng = pos.coords.longitude;
          fetchLocationThreat();
        },
        (err) => {
          console.warn("Geolocation failed", err);
          threatStatusEl.textContent = "⚠️ Location unavailable for threat detection.";
        }
      );
    } else {
      threatStatusEl.textContent = "⚠️ Geolocation not supported by browser.";
    }
  }

  // Fetch nearby threat level from backend
  async function fetchLocationThreat() {
    try {
      const res = await fetch("/api/location-threat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat: userLat, lng: userLng }),
      });
      const data = await res.json();
      threatStatusEl.textContent = ` Reports nearby: ${data.count} | Threat Level: ${data.level}`;
    } catch (error) {
      console.error("Threat fetch failed:", error);
      threatStatusEl.textContent = "⚠️ Failed to get location-based threat level.";
    }
  }

  // Submit suspicious activity report
  async function submitReport(activity, location) {
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity, location, lat: userLat, lng: userLng }),
      });

      const data = await res.json();

      if (res.ok) {
        reportStatus.style.color = "green";
        reportStatus.textContent = " Report submitted.";
        reportText.value = "";
        reportLocation.value = "";
        fetchLocationThreat(); // Refresh threat info
      } else {
        reportStatus.style.color = "red";
        reportStatus.textContent = `❗ Error: ${data.error}`;
      }
    } catch (err) {
      reportStatus.style.color = "red";
      reportStatus.textContent = "❗ Failed to send report.";
      console.error(err);
    }
  }

  // Initialize
  if (threatStatusEl) {
    getCurrentLocation();
  }

  if (reportForm) {
    reportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      reportStatus.textContent = "";

      const activity = reportText.value.trim();
      const location = reportLocation.value.trim();

      if (!activity || !location) {
        reportStatus.style.color = "red";
        reportStatus.textContent = "❗ Fill in all fields.";
        return;
      }

      if (userLat === null || userLng === null) {
        reportStatus.style.color = "red";
        reportStatus.textContent = "❗ Location not detected yet.";
        return;
      }

      submitReport(activity, location);
    });
  }
});
