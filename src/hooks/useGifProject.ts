import { useState, useCallback, useRef, useEffect } from 'react';
import type { GifFrame, ExportSettings, GifProject } from '@/types/gif';
import { decodeGif, imageToFrame } from '@/utils/gifDecoder';
import { encodeGif, downloadBlob } from '@/utils/gifEncoder';
import { arrayMove } from '@dnd-kit/sortable';

const defaultExportSettings: ExportSettings = {
  width: 480,
  height: 480,
  quality: 10,
  speedMultiplier: 1,
};

export function useGifProject() {
  const [frames, setFrames] = useState<GifFrame[]>([]);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [exportSettings, setExportSettings] = useState<ExportSettings>(defaultExportSettings);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const playTimerRef = useRef<number | null>(null);

  const selectedFrame = frames.find(f => f.id === selectedFrameId) || null;

  // Auto-update export dimensions from first frame
  useEffect(() => {
    if (frames.length > 0 && exportSettings.width === 480 && exportSettings.height === 480) {
      setExportSettings(s => ({
        ...s,
        width: frames[0].width,
        height: frames[0].height,
      }));
    }
  }, [frames]);

  // Playback logic
  useEffect(() => {
    if (!isPlaying || frames.length === 0) {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
      return;
    }

    const frame = frames[currentFrameIndex];
    const delay = frame ? frame.delay / exportSettings.speedMultiplier : 100;

    playTimerRef.current = window.setTimeout(() => {
      setCurrentFrameIndex(i => (i + 1) % frames.length);
    }, delay);

    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentFrameIndex, frames, exportSettings.speedMultiplier]);

  const importGif = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const decoded = await decodeGif(buffer);
      setFrames(prev => [...prev, ...decoded]);
      if (decoded.length > 0) {
        setSelectedFrameId(decoded[0].id);
        setCurrentFrameIndex(0);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addImages = useCallback(async (files: File[]) => {
    setIsLoading(true);
    try {
      const newFrames: GifFrame[] = [];
      for (const file of files) {
        if (file.type === 'image/gif') {
          const buffer = await file.arrayBuffer();
          const decoded = await decodeGif(buffer);
          newFrames.push(...decoded);
        } else {
          const frame = await imageToFrame(file);
          newFrames.push(frame);
        }
      }
      setFrames(prev => [...prev, ...newFrames]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteFrame = useCallback((id: string) => {
    setFrames(prev => {
      const next = prev.filter(f => f.id !== id);
      if (selectedFrameId === id) {
        setSelectedFrameId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
  }, [selectedFrameId]);

  const reorderFrames = useCallback((activeId: string, overId: string) => {
    setFrames(prev => {
      const oldIndex = prev.findIndex(f => f.id === activeId);
      const newIndex = prev.findIndex(f => f.id === overId);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const updateFrameDelay = useCallback((id: string, delay: number) => {
    setFrames(prev => prev.map(f => f.id === id ? { ...f, delay } : f));
  }, []);

  const setGlobalDelay = useCallback((delay: number) => {
    setFrames(prev => prev.map(f => ({ ...f, delay })));
  }, []);

  const clearProject = useCallback(() => {
    setFrames([]);
    setSelectedFrameId(null);
    setCurrentFrameIndex(0);
    setIsPlaying(false);
    setExportSettings(defaultExportSettings);
  }, []);

  const togglePlayback = useCallback(() => {
    setIsPlaying(p => !p);
  }, []);

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentFrameIndex(i => (i + 1) % Math.max(1, frames.length));
  }, [frames.length]);

  const stepBackward = useCallback(() => {
    setIsPlaying(false);
    setCurrentFrameIndex(i => (i - 1 + frames.length) % Math.max(1, frames.length));
  }, [frames.length]);

  const exportGif = useCallback(async () => {
    if (frames.length === 0) return;
    setIsExporting(true);
    setExportProgress(0);
    try {
      const blob = await encodeGif(frames, exportSettings, setExportProgress);
      downloadBlob(blob, 'animation.gif');
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [frames, exportSettings]);

  return {
    frames,
    selectedFrameId,
    selectedFrame,
    isPlaying,
    currentFrameIndex,
    exportSettings,
    isExporting,
    exportProgress,
    isLoading,
    setSelectedFrameId,
    setCurrentFrameIndex,
    setExportSettings,
    importGif,
    addImages,
    deleteFrame,
    reorderFrames,
    updateFrameDelay,
    setGlobalDelay,
    clearProject,
    togglePlayback,
    stepForward,
    stepBackward,
    exportGif,
  };
}
