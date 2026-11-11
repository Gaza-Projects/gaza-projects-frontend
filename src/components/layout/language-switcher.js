import {Link} from '@/i18n/navigation';
export default function LanguageSwitcher({locale, pathname = '/', query = {}, label}) {
  const target = locale === 'ar' ? 'en' : 'ar';
  return (
    <Link href={{pathname, query}} locale={target} lang={target} hrefLang={target}
      aria-label={label} className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground">
      {target === 'ar' ? 'العربية' : 'English'}
    </Link>
  );
}
