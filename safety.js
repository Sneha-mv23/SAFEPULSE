document.addEventListener("DOMContentLoaded", () => {
  const threatStatusEl = document.getElementById("threat-status");
  const reportForm = document.getElementById("report-form");
  const reportText = document.getElementById("report-text");
  const reportLocation = document.getElementById("report-location");
  const reportStatus = document.getElementById("report-status");

  // Function to simulate fetching threat level
  function fetchThreatLevel() {
    const levels = ["🟢 Low", "🟡 Moderate", "🟠 High", "🔴 Critical"];
    const index = Math.floor(Math.random() * levels.length);
    return levels[index];
  }

  // Set threat level on page load
  if (threatStatusEl) {
    threatStatusEl.textContent = `Current threat level: ${fetchThreatLevel()}`;
  }

  // Handle suspicious activity report form
  if (reportForm) {
    reportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!reportStatus) return;

      reportStatus.textContent = "";

      const activity = reportText.value.trim();
      const location = reportLocation.value.trim();

      if (!activity || !location) {
        reportStatus.style.color = "red";
        reportStatus.textContent = "❗ Please fill in both fields.";
        return;
      }

      // Simulate successful report
      reportStatus.style.color = "green";
      reportStatus.textContent = "✅ Thank you! Your report has been submitted.";

      // Clear form
      reportText.value = "";
      reportLocation.value = "";
    });
  }
});

