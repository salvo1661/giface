export interface GifFrame {
  id: string;
  imageData: ImageData;
  dataUrl: string;
  delay: number; // in ms
  width: number;
  height: number;
}

export interface ExportSettings {
  width: number;
  height: number;
  quality: number; // 1-20 for gif.js (lower = better)
  speedMultiplier: number;
}

export interface GifProject {
  frames: GifFrame[];
  selectedFrameId: string | null;
  isPlaying: boolean;
  currentFrameIndex: number;
  exportSettings: ExportSettings;
}
