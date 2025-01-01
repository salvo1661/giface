import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import type { GifFrame, ExportSettings } from '@/types/gif';
import type { Translations } from '@/i18n/translations';

interface PropertiesPanelProps {
  t: Translations;
  selectedFrame: GifFrame | null;
  exportSettings: ExportSettings;
  onUpdateFrameDelay: (id: string, delay: number) => void;
  onSetGlobalDelay: (delay: number) => void;
  onUpdateExportSettings: (settings: ExportSettings) => void;
  frameCount: number;
}

export function PropertiesPanel({
  t,
  selectedFrame,
  exportSettings,
  onUpdateFrameDelay,
  onSetGlobalDelay,
  onUpdateExportSettings,
  frameCount,
}: PropertiesPanelProps) {
  return (
    <div className="w-64 border-l border-border bg-card overflow-y-auto flex flex-col">
      <div className="p-4 space-y-5">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {t.frameProperties}
          </h3>
          {selectedFrame ? (
            <div className="space-y-3">
              <div>
                <Label className="text-xs">{t.delayMs}</Label>
                <Input
                  type="number"
                  min={20}
                  max={10000}
                  value={selectedFrame.delay}
                  onChange={e => onUpdateFrameDelay(selectedFrame.id, Number(e.target.value))}
                  className="mt-1 h-8 text-sm font-mono"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedFrame.width} × {selectedFrame.height}px
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => onSetGlobalDelay(selectedFrame.delay)}
              >
                {t.applyDelayAll}
              </Button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {frameCount > 0 ? t.selectFrameToEdit : t.noFrames}
            </p>
          )}
        </section>

        <Separator />

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {t.exportSettings}
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">{t.width}</Label>
                <Input
                  type="number"
                  min={1}
                  max={2000}
                  value={exportSettings.width}
                  onChange={e =>
                    onUpdateExportSettings({ ...exportSettings, width: Number(e.target.value) })
                  }
                  className="mt-1 h-8 text-sm font-mono"
                />
              </div>
              <div>
                <Label className="text-xs">{t.height}</Label>
                <Input
                  type="number"
                  min={1}
                  max={2000}
                  value={exportSettings.height}
                  onChange={e =>
                    onUpdateExportSettings({ ...exportSettings, height: Number(e.target.value) })
                  }
                  className="mt-1 h-8 text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">
                {t.quality} ({exportSettings.quality})
              </Label>
              <Slider
                min={1}
                max={30}
                step={1}
                value={[exportSettings.quality]}
                onValueChange={([v]) =>
                  onUpdateExportSettings({ ...exportSettings, quality: v })
                }
                className="mt-2"
              />
              <p className="text-[10px] text-muted-foreground mt-1">{t.qualityHint}</p>
            </div>

            <div>
              <Label className="text-xs">
                {t.speed} ×{exportSettings.speedMultiplier.toFixed(1)}
              </Label>
              <Slider
                min={0.1}
                max={5}
                step={0.1}
                value={[exportSettings.speedMultiplier]}
                onValueChange={([v]) =>
                  onUpdateExportSettings({ ...exportSettings, speedMultiplier: v })
                }
                className="mt-2"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
