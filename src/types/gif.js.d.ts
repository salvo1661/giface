declare module 'gif.js' {
  interface GIFOptions {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    workerScript?: string;
    repeat?: number;
    background?: string;
    transparent?: string | null;
    dither?: boolean | string;
  }

  class GIF {
    constructor(options?: GIFOptions);
    addFrame(
      image: CanvasRenderingContext2D | HTMLCanvasElement | HTMLImageElement | ImageData,
      options?: { copy?: boolean; delay?: number; dispose?: number }
    ): void;
    on(event: 'finished', callback: (blob: Blob) => void): this;
    on(event: 'progress', callback: (progress: number) => void): this;
    on(event: 'error', callback: (error: Error) => void): this;
    render(): void;
    abort(): void;
  }

  export default GIF;
}
