import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZTD Office',
  description: 'Manage your business email, calendar and meetings.',
  robots: { index: false, follow: false },
  icons: { icon: '/ztdoffice-logo.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Dark by default; the theme toggle flips the class and stores the choice.
  return (
    <html lang="en-GB" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;550;600;650&display=swap" rel="stylesheet" />
        <script
          // apply the saved theme before paint to avoid a flash
          dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('ztd-panel-theme')==='light')document.documentElement.classList.remove('dark')}catch(e){}` }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
