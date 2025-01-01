import { useGifProject } from '@/hooks/useGifProject';
import { useLocale } from '@/i18n/useLocale';
import { Toolbar } from './Toolbar';
import { PreviewCanvas } from './PreviewCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { FrameTimeline } from './FrameTimeline';
import { PrivacyNotice } from './PrivacyNotice';

export function GifEditor() {
  const project = useGifProject();
  const { t, locale, setLocale, locales } = useLocale();

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <PrivacyNotice t={t} />

      <Toolbar
        t={t}
        locale={locale}
        locales={locales}
        onChangeLocale={setLocale}
        onOpenFile={project.importGif}
        onAddImages={files => project.addImages(files)}
        onClear={project.clearProject}
        onExport={project.exportGif}
        isExporting={project.isExporting}
        exportProgress={project.exportProgress}
        hasFrames={project.frames.length > 0}
        isLoading={project.isLoading}
      />

      <div className="flex-1 flex min-h-0">
        <PreviewCanvas
          t={t}
          frames={project.frames}
          currentFrameIndex={project.currentFrameIndex}
          isPlaying={project.isPlaying}
          isLoading={project.isLoading}
          onTogglePlay={project.togglePlayback}
          onStepForward={project.stepForward}
          onStepBackward={project.stepBackward}
        />
        <PropertiesPanel
          t={t}
          selectedFrame={project.selectedFrame}
          exportSettings={project.exportSettings}
          onUpdateFrameDelay={project.updateFrameDelay}
          onSetGlobalDelay={project.setGlobalDelay}
          onUpdateExportSettings={project.setExportSettings}
          frameCount={project.frames.length}
        />
      </div>

      <FrameTimeline
        t={t}
        frames={project.frames}
        selectedFrameId={project.selectedFrameId}
        currentFrameIndex={project.currentFrameIndex}
        onSelectFrame={(id, index) => {
          project.setSelectedFrameId(id);
          project.setCurrentFrameIndex(index);
        }}
        onDeleteFrame={project.deleteFrame}
        onReorder={project.reorderFrames}
      />
    </div>
  );
}
