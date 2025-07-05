let gameState = 'LOADING';
let currentLocation;

function loadLocations() {
  fetch('src/data/locations.json')
    .then(response => response.json())
    .then(data => {
      const locations = data.jinzhou;
      currentLocation = locations[Math.floor(Math.random() * locations.length)];
      document.getElementById('location-image').src = currentLocation.image;
      gameState = 'WAITING_FOR_GUESS';
    });
}

function calculateDistance(pos1, pos2) {
  const dx = pos1.lat - pos2.lat;
  const dy = pos1.lng - pos2.lng;
  return Math.sqrt(dx * dx + dy * dy) * 1000; // Giả lập khoảng cách (mét)
}

function calculateScore(distance) {
  const maxScore = 5000;
  const maxDistance = 1000;
  return Math.max(0, Math.round(maxScore * (1 - distance / maxDistance)));
}

map.on('click', function(e) {
  if (gameState !== 'WAITING_FOR_GUESS') return;
  const userGuess = placeUserMarker(e.latlng);
  gameState = 'PROCESSING_GUESS';

  const distance = calculateDistance(userGuess, currentLocation.correctCoordinates);
  const score = calculateScore(distance);
  document.getElementById('result').innerText = `Score: ${score} | Distance: ${Math.round(distance)}m`;

  showResult(userGuess, currentLocation.correctCoordinates);
  gameState = 'SHOWING_RESULTS';
});

document.getElementById('guess-button').addEventListener('click', () => {
  if (gameState === 'SHOWING_RESULTS') {
    loadLocations(); // Tải địa điểm mới
    document.getElementById('result').innerText = '';
    gameState = 'LOADING';
  }
});

loadLocations();