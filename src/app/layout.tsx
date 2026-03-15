import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ourverse — A Private Universe for Two',
  description: 'A private little universe built for two people in love.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
