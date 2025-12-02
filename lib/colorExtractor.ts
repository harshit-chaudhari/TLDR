// K-means clustering for dominant color extraction from images

interface RGB {
  r: number;
  g: number;
  b: number;
}

// Calculate Euclidean distance between two colors
function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

// K-means clustering to find dominant colors
function kMeans(pixels: RGB[], k: number = 3, maxIterations: number = 10): RGB[] {
  if (pixels.length === 0) return [];

  // Initialize centroids randomly
  let centroids: RGB[] = [];
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * pixels.length);
    centroids.push({ ...pixels[randomIndex] });
  }

  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign pixels to nearest centroid
    const clusters: RGB[][] = Array(k).fill(null).map(() => []);

    pixels.forEach(pixel => {
      let minDist = Infinity;
      let clusterIndex = 0;

      centroids.forEach((centroid, i) => {
        const dist = colorDistance(pixel, centroid);
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = i;
        }
      });

      clusters[clusterIndex].push(pixel);
    });

    // Update centroids
    let hasChanged = false;
    centroids = clusters.map((cluster, i) => {
      if (cluster.length === 0) return centroids[i];

      const sum = cluster.reduce(
        (acc, pixel) => ({
          r: acc.r + pixel.r,
          g: acc.g + pixel.g,
          b: acc.b + pixel.b,
        }),
        { r: 0, g: 0, b: 0 }
      );

      const newCentroid = {
        r: Math.round(sum.r / cluster.length),
        g: Math.round(sum.g / cluster.length),
        b: Math.round(sum.b / cluster.length),
      };

      if (colorDistance(newCentroid, centroids[i]) > 1) {
        hasChanged = true;
      }

      return newCentroid;
    });

    if (!hasChanged) break;
  }

  return centroids;
}

// Extract dominant color from an image
export async function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve('rgba(212, 175, 55, 0.35)'); // Fallback to gold
          return;
        }

        // Use smaller canvas for performance
        const scale = 0.1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels: RGB[] = [];

        // Sample pixels (every 4th pixel for performance)
        for (let i = 0; i < imageData.data.length; i += 16) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const a = imageData.data[i + 3];

          // Skip very dark or very light pixels and transparent pixels
          if (a > 128 && (r + g + b) > 50 && (r + g + b) < 700) {
            pixels.push({ r, g, b });
          }
        }

        if (pixels.length === 0) {
          resolve('rgba(212, 175, 55, 0.35)'); // Fallback to gold
          return;
        }

        // Get dominant colors using k-means
        const dominantColors = kMeans(pixels, 3);

        // Find the most vibrant color (highest saturation)
        let mostVibrant = dominantColors[0];
        let maxSaturation = 0;

        dominantColors.forEach(color => {
          const max = Math.max(color.r, color.g, color.b);
          const min = Math.min(color.r, color.g, color.b);
          const saturation = max === 0 ? 0 : (max - min) / max;

          if (saturation > maxSaturation) {
            maxSaturation = saturation;
            mostVibrant = color;
          }
        });

        // Return as rgba with higher opacity for more visible gradient
        resolve(`rgba(${mostVibrant.r}, ${mostVibrant.g}, ${mostVibrant.b}, 0.35)`);
      } catch (error) {
        console.error('Error extracting color:', error);
        resolve('rgba(212, 175, 55, 0.35)'); // Fallback to gold
      }
    };

    img.onerror = () => {
      resolve('rgba(212, 175, 55, 0.35)'); // Fallback to gold
    };

    // Use TMDB image with CORS support
    img.src = imageUrl;
  });
}
