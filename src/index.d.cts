export interface ExifData {
  hasGps: boolean;
  latitude: number | null;
  longitude: number | null;
  make: string | null;
  model: string | null;
  dateTimeOriginal: Date | null;
  orientation: number | string | null;
}

/**
 * Reads EXIF/GPS metadata from an image without modifying it.
 */
export function readExif(input: string | Buffer | Uint8Array): Promise<ExifData>;

/**
 * Returns a copy of the image with all EXIF/IPTC/XMP metadata (including GPS
 * location) removed. Visual orientation is preserved.
 */
export function stripExif(input: string | Buffer | Uint8Array): Promise<Buffer>;

/**
 * Convenience check for whether an image currently embeds GPS coordinates.
 */
export function hasGpsData(input: string | Buffer | Uint8Array): Promise<boolean>;
