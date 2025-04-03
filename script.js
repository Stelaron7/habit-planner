document.getElementById('uploadForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const fileInput = document.getElementById('imageInput');
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        processImage(img);
      }
      img.src = event.target.result;
    }
    reader.readAsDataURL(fileInput.files[0]);
  }
});

function processImage(img) {
  const canvas = document.getElementById('resultCanvas');
  const ctx = canvas.getContext('2d');

  // Set canvas dimensions to match the image
  canvas.width = img.width;
  canvas.height = img.height;

  // Apply initial filters to simulate a "Ghibli" style
  // (These filters adjust contrast, saturation, and hue.)
  ctx.filter = 'contrast(1.2) saturate(1.5) hue-rotate(15deg)';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Remove filters for pixel processing
  ctx.filter = 'none';

  // Apply a posterize effect to simulate a limited color palette (levels = 5)
  posterizeImage(canvas, 5);

  // Show the download button once processing is complete
  document.getElementById('downloadButton').style.display = 'inline-block';
}

function posterizeImage(canvas, levels) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = posterizeValue(data[i], levels);     // Red
    data[i + 1] = posterizeValue(data[i + 1], levels); // Green
    data[i + 2] = posterizeValue(data[i + 2], levels); // Blue
    // Alpha channel remains unchanged (data[i+3])
  }
  ctx.putImageData(imageData, 0, 0);
}

function posterizeValue(value, levels) {
  const step = 256 / levels;
  return Math.floor(value / step) * step;
}

// Download converted image
document.getElementById('downloadButton').addEventListener('click', function() {
  const canvas = document.getElementById('resultCanvas');
  const link = document.createElement('a');
  link.download = 'converted_ghibli.png';
  link.href = canvas.toDataURL();
  link.click();
});
