import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, ImageIcon, Loader2 } from 'lucide-react';
import type { GifFrame } from '@/types/gif';
import type { Translations } from '@/i18n/translations';

interface PreviewCanvasProps {
  t: Translations;
  frames: GifFrame[];
  currentFrameIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
}

export function PreviewCanvas({
  t,
  frames,
  currentFrameIndex,
  isPlaying,
  isLoading,
  onTogglePlay,
  onStepForward,
  onStepBackward,
}: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrame = frames[currentFrameIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentFrame) return;

    canvas.width = currentFrame.width;
    canvas.height = currentFrame.height;
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(currentFrame.imageData, 0, 0);
  }, [currentFrame]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm font-medium">{t.decodingGif}</p>
      </div>
    );
  }

  if (frames.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <ImageIcon className="h-16 w-16 opacity-30" />
        <div className="text-center">
          <p className="text-lg font-medium">{t.noFramesLoaded}</p>
          <p className="text-sm">{t.noFramesHint}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4 overflow-hidden">
      <div className="relative flex items-center justify-center flex-1 w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain rounded-md"
          style={{
            imageRendering: 'auto',
            boxShadow: '0 4px 24px hsl(0 0% 0% / 0.3)',
          }}
        />
      </div>

      <div className="flex items-center gap-3 py-2">
        <Button variant="ghost" size="icon" onClick={onStepBackward}>
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={onTogglePlay}
          className="h-10 w-10"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onStepForward}>
          <SkipForward className="h-4 w-4" />
        </Button>
        <span className="text-xs font-mono text-muted-foreground ml-2">
          {currentFrameIndex + 1} / {frames.length}
        </span>
        {currentFrame && (
          <span className="text-xs font-mono text-muted-foreground">
            {currentFrame.delay}ms
          </span>
        )}
      </div>
    </div>
  );
}
