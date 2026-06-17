import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meal Planner — Budget-friendly weekly plans',
  description: 'Get a 7-day meal plan within your budget, tailored to your household and dietary needs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
