import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { readExif, stripExif, hasGpsData } from '../src/index.js';

async function makeJpegWithExif() {
  const raw = Buffer.alloc(64 * 64 * 3, 128);
  return sharp(raw, { raw: { width: 64, height: 64, channels: 3 } })
    .jpeg()
    .withExifMerge({ IFD0: { Make: 'TestMake', Model: 'TestModel' } })
    .toBuffer();
}

async function makePlainJpeg() {
  const raw = Buffer.alloc(32 * 32 * 3, 200);
  return sharp(raw, { raw: { width: 32, height: 32, channels: 3 } }).jpeg().toBuffer();
}

test('readExif reports embedded make/model', async () => {
  const buffer = await makeJpegWithExif();
  const data = await readExif(buffer);

  assert.equal(data.make, 'TestMake');
  assert.equal(data.model, 'TestModel');
  assert.equal(data.hasGps, false);
  assert.equal(data.latitude, null);
});

test('readExif returns empty data for an image with no EXIF', async () => {
  const buffer = await makePlainJpeg();
  const data = await readExif(buffer);

  assert.equal(data.make, null);
  assert.equal(data.hasGps, false);
});

test('stripExif removes all EXIF fields', async () => {
  const buffer = await makeJpegWithExif();
  const stripped = await stripExif(buffer);
  const data = await readExif(stripped);

  assert.equal(data.make, null);
  assert.equal(data.model, null);
  assert.equal(data.orientation, null);
});

test('stripExif preserves pixel dimensions for a non-rotated image', async () => {
  const buffer = await makeJpegWithExif();
  const stripped = await stripExif(buffer);

  const before = await sharp(buffer).metadata();
  const after = await sharp(stripped).metadata();

  assert.equal(after.width, before.width);
  assert.equal(after.height, before.height);
});

test('hasGpsData returns false when there is no GPS data', async () => {
  const buffer = await makeJpegWithExif();
  assert.equal(await hasGpsData(buffer), false);
});

test('accepts a file path', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'strip-exif-'));
  const filePath = join(dir, 'test.jpg');
  try {
    await writeFile(filePath, await makeJpegWithExif());
    const stripped = await stripExif(filePath);
    const data = await readExif(stripped);
    assert.equal(data.make, null);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('rejects unsupported input types', async () => {
  await assert.rejects(() => readExif(12345), TypeError);
});
