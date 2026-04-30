import React from 'react';

export default function About() {
    return (
        <main className="p-10 min-h-screen">
            <div className="max-w-5xl mx-auto text-center mt-8">
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-indigo-200">
                    Scientific Background
                </span>
                <h1 className="text-5xl font-black text-slate-900 mt-8 mb-6 tracking-tight">Mengenal <span className="text-indigo-600">BaliPulse.</span></h1>
                <p className="text-slate-600 mb-16 max-w-2xl mx-auto text-lg">
                    Sistem ini dibangun sebagai bagian dari penelitian akhir terstruktur menuju gelar Sarjana Komputer (S.Kom). BaliPulse adalah sebuah Dashboard System peramalan kualitas udara yang berfokus pada analisis mendalam konsentrasi PM2.5.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200 text-left">
                        <div className="text-blue-500 text-4xl mb-6">🗄️</div>
                        <h3 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-tight">Dataset Historis</h3>
                        <p className="text-slate-500 text-sm">Dilatih menggunakan data historis kualitas udara yang diverifikasi untuk memetakan distribusi polusi secara akurat dan spesifik.</p>
                    </div>
                    <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200 text-left">
                        <div className="text-indigo-500 text-4xl mb-6">🧠</div>
                        <h3 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-tight">Arsitektur LSTM</h3>
                        <p className="text-slate-500 text-sm">Long Short-Term Memory diimplementasikan untuk keunggulannya dalam menangkap dan mempelajari dependensi jangka panjang pada sekuens data.</p>
                    </div>
                    <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200 text-left">
                        <div className="text-teal-500 text-4xl mb-6">⚙️</div>
                        <h3 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-tight">Optimasi PSO</h3>
                        <p className="text-slate-500 text-sm">Particle Swarm Optimization diintegrasikan secara dinamis untuk mencari konfigurasi hiperparameter optimal, meminimalkan tingkat error peramalan.</p>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col md:flex-row items-center text-left gap-12">
                    <div className="flex-1">
                        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Ketahanan Model Hibrida</h2>
                        <p className="text-slate-600 mb-6 text-sm">
                            Integrasi antara algoritma optimasi dan neural network diterapkan untuk meningkatkan ketahanan Dashboard System.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start text-slate-600 font-bold text-sm">
                                <span className="text-indigo-500 mr-3 text-xl leading-none">•</span> Menangani hubungan non-linear pada dataset polutan.
                            </li>
                            <li className="flex items-start text-slate-600 font-bold text-sm">
                                <span className="text-indigo-500 mr-3 text-xl leading-none">•</span> Mencegah masalah overfitting selama proses komputasi iteratif.
                            </li>
                            <li className="flex items-start text-slate-600 font-bold text-sm">
                                <span className="text-indigo-500 mr-3 text-xl leading-none">•</span> Memastikan stabilitas output data estimasi di semua titik wilayah.
                            </li>
                        </ul>
                    </div>
                    <div className="bg-slate-900 text-white p-10 rounded-[2rem] flex-1 shadow-lg border border-slate-800">
                        <div className="bg-white/10 w-12 h-12 flex items-center justify-center rounded-xl mb-6 shadow-inner">
                            <span className="text-2xl">🔬</span>
                        </div>
                        <h4 className="font-black text-xl mb-4 tracking-tight">Sinergi LSTM & PSO</h4>
                        <p className="text-slate-400 text-sm leading-relaxed italic">
                            "Penerapan mekanisme Particle Swarm Optimization mempercepat proses konvergensi untuk mengoptimalkan penyesuaian bobot pada sel memori LSTM, menghasilkan estimasi konsentrasi parameter PM2.5 yang sangat andal."
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}