import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import type { Translations } from '@/i18n/translations';

const STORAGE_KEY = 'gif-editor-privacy-acknowledged';

interface PrivacyNoticeProps {
  t: Translations;
}

export function PrivacyNotice({ t }: PrivacyNoticeProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleAcknowledge(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <DialogTitle>{t.privacyTitle}</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t.privacyBody }} />
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleAcknowledge} className="w-full sm:w-auto">
            {t.privacyOk}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
