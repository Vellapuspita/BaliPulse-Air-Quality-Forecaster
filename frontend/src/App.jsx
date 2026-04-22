import React from 'react';
import Dashboard from './pages/Dashboard';
import { Wind, Globe, Mail, ShieldCheck } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col text-left">
      {/* Main Content Area */}
      <main className="flex-1">
        <Dashboard />
      </main>

      {/* Modern & Clean Footer */}
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
  );
}

export default App;