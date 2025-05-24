let map;

function initMap() {
  // Default location coordinates (Delhi)
  const defaultLocation = [28.6139, 77.2090];

  // Initialize the Leaflet map
  map = L.map('map').setView(defaultLocation, 13);

  // Set the OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Use Geolocation API to get user location and add marker
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = [position.coords.latitude, position.coords.longitude];

        // Center map to user location
        map.setView(userLocation, 13);

        // Add marker at user location
        L.marker(userLocation)
          .addTo(map)
          .bindPopup('Your Location')
          .openPopup();
      },
      () => {
        console.warn('Geolocation failed. Using default location.');
      }
    );
  }

  // Danger Zones coordinates
  const dangerZones = [
    [28.6208, 77.2100],
    [28.6152, 77.2256],
    [28.6100, 77.2000],
    [28.6180, 77.2150],
  ];

  // Add markers for danger zones
  dangerZones.forEach((zone) => {
    L.marker(zone)
      .addTo(map)
      .bindPopup('Danger Zone');
  });

  // Optional: Add heatmap layer using leaflet-heat plugin (needs separate plugin)
  // For now, Leaflet core doesn't have built-in heatmap support.
}
