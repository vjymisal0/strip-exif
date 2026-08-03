# strip-exif

Strip EXIF, GPS, and other metadata from images before upload or storage - and optionally inspect what's embedded first.

Photos taken on phones and cameras routinely embed the exact GPS coordinates where they were shot, plus device make/model and timestamps. Apps that let users upload photos and don't strip this data can leak a user's precise location.

## Install

```bash
npm install strip-exif
```

Requires Node.js >= 18. Uses [`sharp`](https://sharp.pixelplumbing.com/) for image processing and [`exifr`](https://github.com/MikeKovarik/exifr) for reading metadata.

## Usage

```js
import { stripExif, readExif, hasGpsData } from 'strip-exif';

// Remove all EXIF/GPS/IPTC/XMP metadata, get back a clean Buffer.
// Visual orientation is preserved (rotation is baked into the pixels).
const cleanBuffer = await stripExif('photo.jpg');

// Inspect what's embedded before you strip it, e.g. to warn a user.
const info = await readExif('photo.jpg');
// { hasGps: true, latitude: 18.44, longitude: 73.86, make: 'samsung', model: 'SM-A525F', ... }

// Quick boolean check.
if (await hasGpsData('photo.jpg')) {
  console.warn('This photo contains GPS location data.');
}
```

All three functions accept a file path (`string`), an `http(s)` URL (`string`), or image bytes (`Buffer` / `Uint8Array`).

## API

### `stripExif(input)`

Returns `Promise<Buffer>` - the image re-encoded with all EXIF, IPTC, and XMP metadata removed. Any EXIF rotation is applied to the pixels first, so the output looks identical to the original, just without the embedded metadata.

### `readExif(input)`

Returns `Promise<ExifData>`:

```ts
interface ExifData {
  hasGps: boolean;
  latitude: number | null;
  longitude: number | null;
  make: string | null;
  model: string | null;
  dateTimeOriginal: Date | null;
  orientation: number | string | null;
}
```

### `hasGpsData(input)`

Returns `Promise<boolean>` - `true` if the image currently embeds GPS coordinates.

## License

MIT
