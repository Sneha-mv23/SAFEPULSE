document.addEventListener("DOMContentLoaded", () => {
  const threatStatusEl = document.getElementById("threat-status");
  const reportForm = document.getElementById("report-form");
  const reportText = document.getElementById("report-text");
  const reportLocation = document.getElementById("report-location");
  const reportStatus = document.getElementById("report-status");

  // Simulate threat level fetch (replace with real API if available)
  function fetchThreatLevel() {
    const levels = ["Low", "Moderate", "High", "Critical"];
    const index = Math.floor(Math.random() * levels.length);
    return levels[index];
  }
  
  // Display threat level on page load
  if (threatStatusEl) {
    threatStatusEl.textContent = `Current threat level: ${fetchThreatLevel()}`;
  }

  // Handle suspicious activity report form submission
  if (reportForm) {
    reportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!reportStatus) return;

      reportStatus.textContent = "";

      const activity = reportText.value.trim();
      const location = reportLocation.value.trim();

      if (!activity || !location) {
        reportStatus.style.color = "red";
        reportStatus.textContent = "Please fill in both fields.";
        return;
      }

      // Simulate sending report to server or database
      reportStatus.style.color = "green";
      reportStatus.textContent = "Thank you! Your report has been submitted.";

      // Clear form fields
      reportText.value = "";
      reportLocation.value = "";
    });
  }
});
