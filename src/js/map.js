const map = L.map('map').setView([45.0, -122.0], 10); // Tọa độ giả lập cho Jinzhou
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

let userMarker, correctMarker, polyline;

function placeUserMarker(latlng) {
  if (userMarker) map.removeLayer(userMarker);
  userMarker = L.marker(latlng, {
    icon: L.icon({ iconUrl: 'icons/user-guess.png', iconSize: [25, 25] })
  }).addTo(map);
  return latlng;
}

function showResult(userGuess, correctLocation) {
  if (correctMarker) map.removeLayer(correctMarker);
  if (polyline) map.removeLayer(polyline);

  correctMarker = L.marker([correctLocation.lat, correctLocation.lng], {
    icon: L.icon({ iconUrl: 'icons/correct-location.png', iconSize: [25, 25] })
  }).addTo(map).bindPopup(correctLocation.name);

  polyline = L.polyline([
    [userGuess.lat, userGuess.lng],
    [correctLocation.lat, correctLocation.lng]
  ], {
    color: 'red',
    weight: 3,
    dashArray: '10, 10'
  }).addTo(map);

  const bounds = L.latLngBounds([
    [userGuess.lat, userGuess.lng],
    [correctLocation.lat, correctLocation.lng]
  ]);
  map.fitBounds(bounds, { padding: [50, 50] });
}