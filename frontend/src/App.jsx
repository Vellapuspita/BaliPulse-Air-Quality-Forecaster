import React, { useState } from 'react'; // Tambahkan useState
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Wind, Globe, Mail, ShieldCheck, LayoutDashboard, Map as MapIcon, HeartPulse, Info, Menu, X } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import HealthTips from './pages/HealthTips';
import About from './pages/About';

// Terima props isOpen dan setIsOpen dari App
const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navItems = [
      { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { path: '/health-tips', label: 'Health Tips', icon: <HeartPulse size={18} /> },
      { path: '/about', label: 'About Research', icon: <Info size={18} /> }
  ];

  return (
      <>
        {/* 1. Overlay Gelap untuk Mobile: Muncul saat sidebar dibuka */}
        {isOpen && (
            <div 
                className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
                onClick={() => setIsOpen(false)}
            />
        )}

        {/* 2. Sidebar Component */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 p-6 flex flex-col border-r border-slate-800 min-h-screen transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
            <div className="text-white font-black text-2xl mb-12 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/40"><Wind size={20} /></div>
                    BaliPulse
                </div>
                {/* Tombol Close (X) khusus untuk Mobile */}
                <button 
                    className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
                    onClick={() => setIsOpen(false)}
                >
                    <X size={24} />
                </button>
            </div>
            
            <nav className="space-y-2">
                {navItems.map((item) => (
                    // Tambahkan onClick agar sidebar tertutup otomatis saat menu diklik di HP
                    <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                        <div className={`flex items-center gap-3 p-3 rounded-xl font-bold cursor-pointer transition-all mb-2 ${
                            location.pathname === item.path 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}>
                            {item.icon} {item.label}
                        </div>
                    </Link>
                ))}
            </nav>
        </aside>
      </>
  );
};

function App() {
  // State untuk mengontrol sidebar di mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-left text-slate-900">
        
        {/* Kirim state ke Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-x-hidden w-full">
          
          {/* 3. Header Mobile: Hanya muncul di layar kecil (lg:hidden) */}
          <header className="lg:hidden sticky top-0 z-30 bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between shadow-sm">
            <div className="text-white font-black text-xl flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/40">
                <Wind size={16} className="text-white" />
              </div>
              BaliPulse
            </div>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
            >
              <Menu size={24} />
            </button>
          </header>

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/health-tips" element={<HealthTips />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>

          {/* Modern & Clean Footer (Sama persis seperti aslinya) */}
          <footer className="bg-slate-900 text-slate-400 py-12 px-8 border-t border-slate-800 text-left">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Brand & Mission */}
              <div className="space-y-5 text-left">
                <div className="text-white font-black text-2xl italic flex items-center gap-2 text-left">
                  <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 not-italic">
                    <Wind size={20} className="text-white" />
                  </div>
                  BaliPulse
                </div>
                <p className="text-sm leading-relaxed max-w-xs text-left opacity-80">
                  Platform analisis kualitas udara cerdas untuk wilayah Bali.
                  Mengintegrasikan data sensor dengan pemodelan LSTM untuk prediksi PM2.5 yang presisi.
                </p>
              </div>

              {/* Useful Links */}
              <div className="space-y-5 text-left">
                <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] text-left">Informasi</h4>
                <ul className="space-y-3 text-sm text-left">
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-2">
                    <ShieldCheck size={14} /> Metodologi AI
                  </li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-2">
                    <ShieldCheck size={14} /> Baku Mutu Udara
                  </li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-2">
                    <ShieldCheck size={14} /> Dokumentasi API
                  </li>
                </ul>
              </div>

              {/* Social & Contact */}
              <div className="space-y-5 text-left">
                <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] text-left">Kontak Kami</h4>
                <div className="flex gap-4 text-left">
                  <a href="#" className="p-2.5 bg-slate-800 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300">
                    <Globe size={20} />
                  </a>
                  <a href="#" className="p-2.5 bg-slate-800 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300">
                    <Mail size={20} />
                  </a>
                </div>
                <p className="text-[10px] font-medium tracking-wide leading-relaxed text-left">
                  Bekerja sama dengan jaringan stasiun pemantauan terdistribusi di seluruh Kabupaten/Kota di Bali.
                </p>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-left">
                © 2026 BaliPulse Project. <span className="text-slate-600">Built with Precision.</span>
              </p>
              <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest">
                <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              </div>
            </div>
          </footer>
        </div>

      </div>
    </Router>
  );
}

export default App;