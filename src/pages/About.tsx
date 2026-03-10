import { Link } from 'react-router-dom';
import { useLocale } from '@/i18n/useLocale';
import { LOCALE_LABELS } from '@/i18n/useLocale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Globe,
  ArrowLeft,
  DollarSign,
  ShieldCheck,
  Code2,
  MonitorSmartphone,
  Mail,
} from 'lucide-react';
import type { Locale } from '@/i18n/translations';

const featureIcons = [DollarSign, ShieldCheck, Code2, MonitorSmartphone] as const;

export default function About() {
  const { t, locale, setLocale, locales } = useLocale();

  const features = [
    { title: t.aboutFeature1Title, desc: t.aboutFeature1Desc, Icon: featureIcons[0] },
    { title: t.aboutFeature2Title, desc: t.aboutFeature2Desc, Icon: featureIcons[1] },
    {
      title: t.aboutFeature3Title,
      desc: t.aboutFeature3Desc,
      Icon: featureIcons[2],
      link: {
        href: 'https://github.com/salvo1661/giface',
        label: 'github.com/salvo1661/giface',
      },
    },
    { title: t.aboutFeature4Title, desc: t.aboutFeature4Desc, Icon: featureIcons[3] },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t.aboutBackToEditor}
          </Button>
        </Link>
        <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
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
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {t.aboutHeroTitle}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t.aboutHeroDesc}
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map(({ title, desc, Icon, link }) => (
            <Card key={title} className="border-border">
              <CardContent className="pt-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                {link ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {link.label}
                  </a>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Contact */}
        <section className="text-center space-y-3 pb-8">
          <h2 className="text-2xl font-semibold">{t.aboutContactTitle}</h2>
          <p className="text-muted-foreground">{t.aboutContactDesc}</p>
          <a
            href={`mailto:${t.aboutContactEmail}`}
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <Mail className="h-4 w-4" />
            {t.aboutContactEmail}
          </a>
        </section>
      </main>
    </div>
  );
}
