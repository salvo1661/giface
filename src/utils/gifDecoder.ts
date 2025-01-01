import { parseGIF, decompressFrames } from 'gifuct-js';
import type { GifFrame } from '@/types/gif';

let frameIdCounter = 0;

export function generateFrameId(): string {
  return `frame-${Date.now()}-${frameIdCounter++}`;
}

export async function decodeGif(buffer: ArrayBuffer): Promise<GifFrame[]> {
  const gif = parseGIF(buffer);
  const rawFrames = decompressFrames(gif, true);

  if (rawFrames.length === 0) return [];

  const gifWidth = gif.lsd.width;
  const gifHeight = gif.lsd.height;

  // We need a compositing canvas to handle disposal methods
  const compCanvas = document.createElement('canvas');
  compCanvas.width = gifWidth;
  compCanvas.height = gifHeight;
  const compCtx = compCanvas.getContext('2d')!;

  const frames: GifFrame[] = [];

  for (const raw of rawFrames) {
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = raw.dims.width;
    frameCanvas.height = raw.dims.height;
    const frameCtx = frameCanvas.getContext('2d')!;

    const frameImageData = frameCtx.createImageData(raw.dims.width, raw.dims.height);
    frameImageData.data.set(raw.patch);
    frameCtx.putImageData(frameImageData, 0, 0);

    // Draw onto compositing canvas
    compCtx.drawImage(frameCanvas, raw.dims.left, raw.dims.top);

    // Capture full composite
    const snapshotCanvas = document.createElement('canvas');
    snapshotCanvas.width = gifWidth;
    snapshotCanvas.height = gifHeight;
    const snapshotCtx = snapshotCanvas.getContext('2d')!;
    snapshotCtx.drawImage(compCanvas, 0, 0);

    const imageData = snapshotCtx.getImageData(0, 0, gifWidth, gifHeight);
    const dataUrl = snapshotCanvas.toDataURL('image/png');

    frames.push({
      id: generateFrameId(),
      imageData,
      dataUrl,
      delay: raw.delay * 10 || 100, // gifuct-js returns delay in centiseconds
      width: gifWidth,
      height: gifHeight,
    });

    // Handle disposal
    if (raw.disposalType === 2) {
      compCtx.clearRect(raw.dims.left, raw.dims.top, raw.dims.width, raw.dims.height);
    }
  }

  return frames;
}

export async function imageToFrame(file: File): Promise<GifFrame> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const dataUrl = canvas.toDataURL('image/png');

      resolve({
        id: generateFrameId(),
        imageData,
        dataUrl,
        delay: 100,
        width: img.width,
        height: img.height,
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
