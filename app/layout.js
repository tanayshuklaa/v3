import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Bloomberg-Style Stock Dashboard',
  description: 'Real-time equity research dashboard powered by Finnhub and Yahoo Finance',
  metadataBase: new URL('https://stock-dashboard.example.com')
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-gray-950">
      <body className="min-h-screen">
        <Navbar />
        <main className="px-4 pb-10 pt-4 max-w-7xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
