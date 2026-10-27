import '@fontsource-variable/inter';
import './globals.css';
import { site } from '@/site.config';

export const metadata = {
  title: { default: `${site.name} | Painel de performance para gestoras de social media`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, locale: 'pt_BR', type: 'website' },
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0f172a' };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  );
}
