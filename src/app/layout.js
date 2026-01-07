import './globals.css';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import BottomNav from '@/components/BottomNav';
import MobileHeader from '@/components/MobileHeader';
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: 'ConnectX',
  description: 'A full stack social media app built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-ig-black text-ig-primary">
        <AuthProvider>
          <div className="flex min-h-screen">
            {/* Left Sidebar (Desktop) */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-[245px] lg:mr-[320px] transition-all duration-300">
              <MobileHeader />
              <div className="max-w-[630px] mx-auto pt-4 pb-16 md:py-8 px-0 md:px-4">
                {children}
              </div>
            </main>

            {/* Right Sidebar (Desktop) */}
            <RightSidebar />

            {/* Bottom Nav (Mobile) */}
            <BottomNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
