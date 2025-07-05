let gameState = 'LOADING';
let currentLocation, round = 1, totalScore = 0, maxRounds = 5;

function loadLocations() {
  fetch('src/data/locations.json')
    .then(response => response.json())
    .then(data => {
      const locations = data.jinzhou;
      currentLocation = locations[Math.floor(Math.random() * locations.length)];
      document.getElementById('location-image').src = currentLocation.image;
      document.getElementById('result').innerText = `Round ${round}/${maxRounds} | Total Score: ${totalScore}`;
      gameState = 'WAITING_FOR_GUESS';
    });
}
function applyFilter(imageElement, filterType) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  ctx.drawImage(imageElement, 0, 0);

  if (filterType === 'blackAndWhite') {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // Red
      data[i + 1] = avg; // Green
      data[i + 2] = avg; // Blue
    }
    ctx.putImageData(imageData, 0, 0);
  }

  return canvas.toDataURL();
}

function loadLocations() {
  fetch('src/data/locations.json')
    .then(response => response.json())
    .then(data => {
      const locations = data.jinzhou;
      currentLocation = locations[Math.floor(Math.random() * locations.length)];
      const img = new Image();
      img.src = currentLocation.image;
      img.onload = () => {
        const filteredImage = applyFilter(img, 'blackAndWhite');
        document.getElementById('location-image').src = filteredImage;
        document.getElementById('result').innerText = `Round ${round}/${maxRounds} | Total Score: ${totalScore}`;
        gameState = 'WAITING_FOR_GUESS';
      };
    });
}
function calculateDistance(pos1, pos2) {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy); // Khoảng cách pixel
}

function calculateScore(distance) {
  const maxScore = 5000;
  const maxDistance = 100; // Điều chỉnh dựa trên kích thước bản đồ
  return Math.max(0, Math.round(maxScore * (1 - distance / maxDistance)));
}

map.on('click', function(e) {
  if (gameState !== 'WAITING_FOR_GUESS') return;
  const userGuess = placeUserMarker([e.latlng.lat, e.latlng.lng]);
  gameState = 'PROCESSING_GUESS';

  const distance = calculateDistance(userGuess, currentLocation.correctCoordinates);
  const score = calculateScore(distance);
  totalScore += score;
  document.getElementById('result').innerText = `Round ${round}/${maxRounds} | Score: ${score} | Distance: ${Math.round(distance)}px | Total: ${totalScore}`;

  showResult(userGuess, currentLocation.correctCoordinates);
  gameState = 'SHOWING_RESULTS';
});

document.getElementById('guess-button').addEventListener('click', () => {
  if (gameState === 'SHOWING_RESULTS') {
    round++;
    if (round > maxRounds) {
      document.getElementById('result').innerText = `Game Over! Final Score: ${totalScore}`;
      gameState = 'GAME_OVER';
      return;
    }
    loadLocations();
  }
});

loadLocations();