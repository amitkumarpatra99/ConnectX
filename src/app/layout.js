import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Social Media App',
  description: 'A full stack social media app built with Next.js and MongoDB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
