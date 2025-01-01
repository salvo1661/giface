import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderOpen, ImagePlus, Trash2, Download, Loader2, Globe, Info } from 'lucide-react';
import type { Translations, Locale } from '@/i18n/translations';
import { LOCALE_LABELS } from '@/i18n/useLocale';

interface ToolbarProps {
  t: Translations;
  locale: Locale;
  locales: Locale[];
  onChangeLocale: (locale: Locale) => void;
  onOpenFile: (file: File) => void;
  onAddImages: (files: File[]) => void;
  onClear: () => void;
  onExport: () => void;
  isExporting: boolean;
  exportProgress: number;
  hasFrames: boolean;
  isLoading: boolean;
}

export function Toolbar({
  t,
  locale,
  locales,
  onChangeLocale,
  onOpenFile,
  onAddImages,
  onClear,
  onExport,
  isExporting,
  exportProgress,
  hasFrames,
  isLoading,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
      <div className="flex items-center gap-1 mr-auto">
        <span className="font-mono text-sm font-semibold tracking-tight text-primary mr-3">
          GIF Editor
        </span>

        <input
          ref={fileInputRef}
          type="file"
          accept=".gif"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) onOpenFile(f);
            e.target.value = '';
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="toolbar-btn"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderOpen className="h-4 w-4" />}
          {t.openGif}
        </Button>

        <input
          ref={addInputRef}
          type="file"
          accept=".gif,.png,.jpg,.jpeg,.webp"
          multiple
          className="hidden"
          onChange={e => {
            const files = Array.from(e.target.files || []);
            if (files.length) onAddImages(files);
            e.target.value = '';
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => addInputRef.current?.click()}
          disabled={isLoading}
          className="toolbar-btn"
        >
          <ImagePlus className="h-4 w-4" />
          {t.addImages}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={!hasFrames}
          className="toolbar-btn text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          {t.clear}
        </Button>
      </div>

      <Link to="/about">
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          <Info className="h-3.5 w-3.5" />
          {t.about}
        </Button>
      </Link>

      <Select value={locale} onValueChange={(v) => onChangeLocale(v as Locale)}>
        <SelectTrigger className="w-auto h-8 gap-1 text-xs border-none bg-transparent hover:bg-accent">
          <Globe className="h-3.5 w-3.5" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {locales.map(loc => (
            <SelectItem key={loc} value={loc} className="text-xs">
              {LOCALE_LABELS[loc]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        size="sm"
        onClick={onExport}
        disabled={!hasFrames || isExporting}
        className="gap-2"
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {Math.round(exportProgress * 100)}%
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            {t.exportGif}
          </>
        )}
      </Button>
    </div>
  );
}
