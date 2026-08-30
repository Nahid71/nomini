import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MapPin, Phone, Mail, Globe, Shield, Leaf, HeartHandshake } from 'lucide-react';
import nominiEmblem from '@/assets/nomini-emblem.png';

export const metadata: Metadata = {
  title: 'NOMINI GROUP & AGRO. | Sustainable Growth. Better Future.',
  description:
    'Pioneering Sustainable Agro-Industrial Excellence in South Asia across Agriculture, Advanced Aquaculture, Dairy & Livestock, Food Processing, Renewable Bio-Energy, and Agri-Tourism.',
  icons: {
    icon: '/nomini-emblem.png',
    apple: '/nomini-emblem.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8">
          {children}
        </main>
        <CartDrawer />

        {/* Official Corporate Footer from PDF */}
        <footer className="bg-slate-900 text-white border-t border-slate-800 pt-10 sm:pt-12 pb-8 mt-12 sm:mt-16">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
              {/* Column 1: Company Profile */}
              <div className="space-y-3">
                <Link href="/about" className="flex items-center space-x-3 group" title="About Nomini Group & Agro">
                  <Image
                    src={nominiEmblem}
                    alt="Nomini Group & Agro"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain rounded-xl bg-white p-0.5 border border-slate-700 flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <span className="font-black text-sm text-white tracking-tight block group-hover:text-forest-400 transition-colors">
                      NOMINI GROUP & AGRO.
                    </span>
                    <span className="text-[10px] text-forest-400 font-bold uppercase tracking-wider block">
                      Nomini Group & Agro
                    </span>
                  </div>
                </Link>
                <p className="text-slate-400 leading-relaxed">
                  Established in 2018. Pioneering South Asia’s sustainable agro-industrial revolution through closed-loop circular systems, climate-smart technologies, and precision food production.
                </p>
                <div className="text-[11px] text-forest-400 font-bold uppercase tracking-wider">
                  Sustainable Growth • Better Future • Innovate • Grow • Sustain
                </div>
              </div>

              {/* Column 2: 6 Core Divisions */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider text-forest-400">
                  6 Core Divisions
                </h4>
                <ul className="space-y-1.5 text-slate-300">
                  <li>• Agriculture & Precision Crops</li>
                  <li>• Advanced Biofloc Aquaculture</li>
                  <li>• Dairy & Livestock Farming</li>
                  <li>• Food Processing & Bio-Fibers</li>
                  <li>• 15 MW Renewable Bio-Energy Grid</li>
                  <li>• Eco-Agro Tourism & Training Hubs</li>
                </ul>
              </div>

              {/* Column 3: Corporate HQ & Operations Hub */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider text-forest-400">
                  Corporate Headquarters
                </h4>
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-forest-400 flex-shrink-0 mt-0.5" />
                    <span>Corporate Office & Operations Hub, Fulbari, Dinajpur, Rangpur, Bangladesh</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-forest-400 flex-shrink-0" />
                    <span>Hotline: +880 1714-864178</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-forest-400 flex-shrink-0" />
                    <span>Email: info@nominigroup.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-forest-400 flex-shrink-0" />
                    <span>Web: www.nominigroup.com</span>
                  </div>
                </div>
              </div>

              {/* Column 4: Leadership & Governance */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider text-forest-400">
                  Leadership & Governance
                </h4>
                <div className="space-y-1.5 text-slate-300">
                  <div>
                    <strong className="text-white block">Md. Abdul Wares</strong>
                    <span className="text-slate-400">Managing Director & CEO</span>
                  </div>
                  <div>
                    <strong className="text-white block">Board of Directors</strong>
                    <span className="text-slate-400">Nomini Group Executive Board</span>
                  </div>
                  <div>
                    <strong className="text-white block">Auditors</strong>
                    <span className="text-slate-400">Chartered Accountants Bangladesh</span>
                  </div>
                  <div>
                    <strong className="text-white block">Legal Advisory</strong>
                    <span className="text-slate-400">Supreme Court Counsel Bangladesh</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center sm:text-left">
              <div className="flex items-center space-x-2">
                <span>© 2018–2026 NOMINI GROUP & AGRO. All rights reserved.</span>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-4 text-[11px] text-slate-400">
                <span>ISO 22000 & HACCP Certified</span>
                <span className="hidden sm:inline">•</span>
                <span>BSTI Approved</span>
                <span className="hidden sm:inline">•</span>
                <span>Halal Certified Bangladesh</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
