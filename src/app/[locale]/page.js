import {getTranslations, setRequestLocale} from 'next-intl/server';
import LanguageSwitcher from '@/components/layout/language-switcher';
export default async function FoundationPage({params, searchParams}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Foundation');
  const query = await searchParams;
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 sm:px-10">
      <header className="flex items-center justify-between gap-6 border-b border-line py-6">
        <span className="text-lg font-bold">{t('title')}</span>
        <LanguageSwitcher locale={locale} query={query} label={t('language')}/>
      </header>
      <main className="flex flex-1 flex-col justify-center py-16">
        <p className="mb-5 text-sm font-medium text-muted">{t('status')}</p>
        <h1 className="max-w-3xl text-4xl font-bold leading-snug sm:text-5xl">{t('heading')}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-9 text-muted">{t('body')}</p>
        <p className="mt-10 text-sm leading-7 text-muted">{t('note')}</p>
      </main>
      <footer className="border-t border-line py-5 text-sm text-muted" dir="ltr">Next.js · JavaScript · Tailwind CSS</footer>
    </div>
  );
}
