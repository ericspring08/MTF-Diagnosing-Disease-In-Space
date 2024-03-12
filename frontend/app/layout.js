import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../utils/Navbar'

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Smart Diagnosis',
  description: 'Diagnose your health in space with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
