import sharp from 'sharp';
import exifr from 'exifr';

/**
 * Reads EXIF/GPS metadata from an image buffer without modifying it.
 * Useful for warning a user what will be removed before stripping.
 * @param {Buffer} imageBuffer
 * @returns {Promise<{
 *   hasGps: boolean,
 *   latitude: number | null,
 *   longitude: number | null,
 *   make: string | null,
 *   model: string | null,
 *   dateTimeOriginal: Date | null,
 *   orientation: number | string | null,
 * }>}
 */
export async function readExifData(imageBuffer) {
  const data = await exifr.parse(imageBuffer, { gps: true, tiff: true, exif: true, ifd0: true }).catch(() => null);

  if (!data) {
    return {
      hasGps: false,
      latitude: null,
      longitude: null,
      make: null,
      model: null,
      dateTimeOriginal: null,
      orientation: null,
    };
  }

  const hasGps = typeof data.latitude === 'number' && typeof data.longitude === 'number';

  return {
    hasGps,
    latitude: hasGps ? data.latitude : null,
    longitude: hasGps ? data.longitude : null,
    make: data.Make ?? null,
    model: data.Model ?? null,
    dateTimeOriginal: data.DateTimeOriginal ?? null,
    orientation: data.Orientation ?? null,
  };
}

/**
 * Returns a copy of the image with all EXIF/IPTC/XMP metadata (including GPS
 * location) removed. Visual orientation is preserved by baking any EXIF
 * rotation into the pixel data before the metadata is dropped.
 * @param {Buffer} imageBuffer
 * @returns {Promise<Buffer>}
 */
export async function stripExif(imageBuffer) {
  return sharp(imageBuffer).rotate().toBuffer();
}
