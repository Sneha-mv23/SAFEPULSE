document.addEventListener("DOMContentLoaded", () => {
  const emergencyBtn = document.getElementById("emergency-button");

  // ✅ Ensure socket.io is defined
  if (typeof io !== "undefined") {
    const socket = io();

    // 🔹 Immediately ask for location and send to server
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          socket.emit("registerLocation", { lat, lng });
          console.log("📍 Location sent to server:", lat, lng);
        },
        (error) => {
          console.warn("⚠️ Location permission denied or error:", error.message);
          alert("⚠️ Please enable location access in your browser settings for real-time alerts.");
        }
      );
    } else {
      alert("❌ Geolocation is not supported by your browser.");
    }

    // 🔴 Emergency alerts from server
    socket.on("emergency-alert", (data) => {
      alert(`🚨 Emergency Nearby!\n${data.message}\nAt: ${data.timestamp}`);
    });
  } else {
    console.error("❌ Socket.io not loaded. Check your script includes.");
  }

  // 🔴 Emergency button handler
  if (emergencyBtn) {
    emergencyBtn.addEventListener("click", () => {
      const confirmed = confirm("Are you sure you want to send an emergency alert?");
      if (!confirmed) return;

      if (!navigator.geolocation) {
        alert("❌ Geolocation not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            const response = await fetch("/api/emergency", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: "🚨 Emergency alert triggered by user!",
                timestamp: new Date().toISOString(),
                lat,
                lng,
              }),
            });

            const result = await response.json();
            if (response.ok) {
              alert("✅ Emergency alert sent successfully!");
            } else {
              alert("❌ Failed: " + (result.error || "Unknown error"));
            }
          } catch (error) {
            console.error("❌ Network error:", error);
            alert("❌ Error sending emergency alert.");
          }
        },
        (error) => {
          console.error("❌ Location error:", error.message);
          alert("❌ Failed to get your location. Please enable location services.");
        }
      );
    });
  }
});
