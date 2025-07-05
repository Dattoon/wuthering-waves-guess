const map = L.map('map', {
  crs: L.CRS.Simple, // Dùng tọa độ đơn giản (pixel-based)
  minZoom: -2,
  maxZoom: 2
});

const bounds = [[0, 0], [1000, 1000]]; // Kích thước bản đồ (pixel)
L.imageOverlay('images/T_LuckdrawShare.png', bounds).addTo(map);
map.fitBounds(bounds);
map.setView([500, 500], 0); // Trung tâm bản đồ

let userMarker, correctMarker, polyline;

function placeUserMarker(coords) {
  if (userMarker) map.removeLayer(userMarker);
  userMarker = L.marker(coords, {
    icon: L.icon({ iconUrl: 'icons/T_IconMap_Pickup_UI.png', iconSize: [25, 25] })
  }).addTo(map);
  return coords;
}

function showResult(userGuess, correctLocation) {
  if (correctMarker) map.removeLayer(correctMarker);
  if (polyline) map.removeLayer(polyline);

  correctMarker = L.marker([correctLocation.x, correctLocation.y], {
    icon: L.icon({ iconUrl: 'icons/T_IconMap_SJ_01_UI.png', iconSize: [25, 25] })
  }).addTo(map).bindPopup(correctLocation.name);

  polyline = L.polyline([
    [userGuess.x, userGuess.y],
    [correctLocation.x, correctLocation.y]
  ], {
    color: 'red',
    weight: 3,
    dashArray: '10, 10'
  }).addTo(map);

  const bounds = L.latLngBounds([
    [userGuess.x, userGuess.y],
    [correctLocation.x, correctLocation.y]
  ]);
  map.fitBounds(bounds, { padding: [50, 50] });
}