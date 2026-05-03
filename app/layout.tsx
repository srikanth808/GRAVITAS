import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GRAVITAS — Crime Intelligence Platform',
  description: 'AI-powered crime incident classification and analysis system',
};

export const viewport: Viewport = {
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          background: '#0a0c10',
          color: '#e2e8f0',
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {/* Grid background overlay */}
        <div
          aria-hidden
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage:
              'linear-gradient(#1e2330 1px, transparent 1px), linear-gradient(90deg, #1e2330 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.25,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
