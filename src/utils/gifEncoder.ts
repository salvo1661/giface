import GIF from 'gif.js';
import type { GifFrame, ExportSettings } from '@/types/gif';

export function encodeGif(
  frames: GifFrame[],
  settings: ExportSettings,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality: settings.quality,
      width: settings.width,
      height: settings.height,
      workerScript: '/gif.worker.js',
    });

    const canvas = document.createElement('canvas');
    canvas.width = settings.width;
    canvas.height = settings.height;
    const ctx = canvas.getContext('2d')!;

    for (const frame of frames) {
      ctx.clearRect(0, 0, settings.width, settings.height);

      // Scale frame to fit export dimensions
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = frame.width;
      tempCanvas.height = frame.height;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.putImageData(frame.imageData, 0, 0);

      ctx.drawImage(tempCanvas, 0, 0, settings.width, settings.height);

      const delay = Math.max(20, frame.delay / settings.speedMultiplier);
      gif.addFrame(ctx, { copy: true, delay });
    }

    gif.on('progress', (p: number) => onProgress?.(p));
    gif.on('finished', (blob: Blob) => resolve(blob));
    gif.on('error', (err: Error) => reject(err));

    gif.render();
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
