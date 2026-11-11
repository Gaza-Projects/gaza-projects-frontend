import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');
export default withNextIntl({
  turbopack: {rules: {'*.css': {loaders: ['@tailwindcss/turbopack'], as: '*.css'}}}
});
