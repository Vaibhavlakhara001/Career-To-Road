import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthContext';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Road to Career - Discover, Learn, Build Evidence & Get Hired',
  description: 'Help students discover suitable career paths, develop practical skills, complete projects, and build verifiable evidence of their abilities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
