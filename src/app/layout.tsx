import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OUTPOST ZERO — Junior Astronaut Mission Trainer | Team Parakram',
  description:
    'Interactive web simulation and junior astronaut mission trainer built by Team Parakram for the 2026 NASA Space Apps Challenge. Master engineering trade-offs between ECLSS, MOXIE, thermal shielding, and power budgets on the Moon and Mars.',
  other: {
    'ai-disclosure':
      'Code, UI scaffolding, and procedural SVG/audio assets accelerated using Super Intelligence (SI) tools by Team Parakram for the 2026 NASA Space Apps Challenge.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta
          name="ai-disclosure"
          content="Code, UI scaffolding, and procedural SVG/audio assets accelerated using Super Intelligence (SI) tools by Team Parakram for the 2026 NASA Space Apps Challenge."
        />
        <meta name="theme-color" content="#070B19" />
      </head>
      <body className="bg-space-900 text-slate-100 min-h-screen selection:bg-cyan-500/30 selection:text-cyan-neon font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
