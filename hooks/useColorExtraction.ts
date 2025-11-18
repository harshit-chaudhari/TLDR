import { useState, useEffect } from 'react';
import { ColorPalette } from '@/utils/colorExtractor';

/**
 * Hook to extract and cycle through dominant colors from poster images
 */
export function useColorExtraction(posterUrls: string[], intervalMs: number = 8000) {
  const [currentColors, setCurrentColors] = useState<ColorPalette | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Extract colors from the first poster immediately
    const extractInitialColor = async () => {
      if (posterUrls.length === 0) return;

      try {
        const response = await fetch(`/api/colors?url=${encodeURIComponent(posterUrls[0])}`);
        if (response.ok) {
          const colors = await response.json();
          setCurrentColors(colors);
        }
      } catch (error) {
        console.error('Failed to extract initial color:', error);
      }
    };

    extractInitialColor();
  }, [posterUrls]);

  useEffect(() => {
    if (posterUrls.length <= 1 || intervalMs === 0) return;

    // Cycle through different posters and extract their colors
    const interval = setInterval(async () => {
      const nextIndex = (currentIndex + 1) % posterUrls.length;
      setCurrentIndex(nextIndex);

      try {
        const response = await fetch(`/api/colors?url=${encodeURIComponent(posterUrls[nextIndex])}`);
        if (response.ok) {
          const colors = await response.json();
          setCurrentColors(colors);
        }
      } catch (error) {
        console.error('Failed to extract color:', error);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [posterUrls, currentIndex, intervalMs]);

  return currentColors;
}

/**
 * Convert ColorPalette to RGB object for gradient backgrounds
 */
export function useColorRgb(colors: ColorPalette | null) {
  const [rgb, setRgb] = useState({ r: 45, g: 36, b: 22 }); // Default warm gold

  useEffect(() => {
    if (!colors) return;
    setRgb(colors.rgb);
  }, [colors]);

  return rgb;
}
