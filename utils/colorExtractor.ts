import { FastAverageColor } from 'fast-average-color';

export interface ColorPalette {
  dominant: string;
  rgb: { r: number; g: number; b: number };
  isDark: boolean;
}

/**
 * Extract dominant color from an image using FastAverageColor
 * @param imageUrl - URL of the image to analyze
 * @returns ColorPalette object with hex color and RGB values
 */
export async function extractColors(imageUrl: string): Promise<ColorPalette | null> {
  try {
    const fac = new FastAverageColor();

    // For server-side, we need to fetch the image and convert to buffer
    // For client-side, FAC can handle image URLs directly
    const color = await fac.getColorAsync(imageUrl, {
      algorithm: 'dominant',
      ignoredColor: [[255, 255, 255, 255, 10]], // Ignore white-ish colors
    });

    return {
      dominant: color.hex,
      rgb: {
        r: color.value[0],
        g: color.value[1],
        b: color.value[2],
      },
      isDark: color.isDark,
    };
  } catch (error) {
    console.error('Error extracting colors:', error);
    // Return default warm gold color
    return {
      dominant: '#d4af37',
      rgb: { r: 212, g: 175, b: 55 },
      isDark: false,
    };
  }
}

/**
 * Convert hex color to RGB object
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Create a radial gradient CSS string from a color palette
 */
export function createRadialGradient(palette: ColorPalette): string {
  const { r, g, b } = palette.rgb;
  return `radial-gradient(ellipse at top, rgba(${r}, ${g}, ${b}, 0.3) 0%, rgba(0, 0, 0, 1) 70%)`;
}

/**
 * Create a linear gradient CSS string from a color palette
 */
export function createLinearGradient(palette: ColorPalette, direction: string = 'to bottom'): string {
  const { r, g, b } = palette.rgb;
  return `linear-gradient(${direction}, rgba(${r}, ${g}, ${b}, 0.4) 0%, rgba(0, 0, 0, 1) 70%)`;
}
