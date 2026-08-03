import { loadImageBuffer } from './loadImage.js';
import { readExifData, stripExif as stripExifBuffer } from './exif.js';

/**
 * Reads EXIF/GPS metadata from an image without modifying it.
 * @param {string | Buffer | Uint8Array} input - File path, http(s) URL, or image bytes.
 */
export async function readExif(input) {
  const buffer = await loadImageBuffer(input);
  return readExifData(buffer);
}

/**
 * Returns a copy of the image with all EXIF/IPTC/XMP metadata (including GPS
 * location) removed. Visual orientation is preserved.
 * @param {string | Buffer | Uint8Array} input - File path, http(s) URL, or image bytes.
 * @returns {Promise<Buffer>}
 */
export async function stripExif(input) {
  const buffer = await loadImageBuffer(input);
  return stripExifBuffer(buffer);
}

/**
 * Convenience check for whether an image currently embeds GPS coordinates.
 * @param {string | Buffer | Uint8Array} input - File path, http(s) URL, or image bytes.
 * @returns {Promise<boolean>}
 */
export async function hasGpsData(input) {
  const { hasGps } = await readExif(input);
  return hasGps;
}
