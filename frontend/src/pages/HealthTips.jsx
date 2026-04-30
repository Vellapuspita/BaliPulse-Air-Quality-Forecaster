import React from 'react';

const HealthTips = () => {
  const tips = [
    { title: 'Gunakan Masker', desc: 'Gunakan masker standar N95 atau KN95 saat berada di luar ruangan ketika indeks PM2.5 "Buruk".', icon: '😷', bgColor: 'bg-red-50' },
    { title: 'Air Purifier', desc: 'Gunakan penyaring udara (HEPA filter) di dalam ruangan untuk mengurangi partikel halus.', icon: '🌬️', bgColor: 'bg-blue-50' },
    { title: 'Batasi Aktivitas', desc: 'Kurangi aktivitas fisik berat di luar ruangan, terutama saat tingkat polusi tinggi.', icon: '🏃‍♂️', bgColor: 'bg-indigo-50' },
    { title: 'Hidrasi Cukup', desc: 'Jaga hidrasi tubuh untuk membantu sistem pernapasan berfungsi optimal.', icon: '💧', bgColor: 'bg-teal-50' },
    { title: 'Monitor Rutin', desc: 'Selalu pantau dashboard BaliPulse untuk mengetahui estimasi kualitas udara.', icon: '📱', bgColor: 'bg-orange-50' },
    { title: 'Tutup Ventilasi', desc: 'Tutup jendela dan pintu saat polusi di luar ruangan mencapai puncaknya.', icon: '🚪', bgColor: 'bg-pink-50' }
  ];

  return (
    // 1. Hapus ml-64.
    // 2. Gunakan px responsif (px-6 untuk mobile, md:px-12 untuk tablet, lg:px-20 untuk laptop agar tidak mepet sidebar)
    <div className="min-h-screen bg-white py-10 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 mt-4 lg:mt-8">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Health-Conscious <span className="text-blue-600">Lifestyle</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Langkah preventif untuk meminimalisir dampak kesehatan dari paparan polusi partikulat halus.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {tips.map((tip, index) => (
            <div key={index} className={`${tip.bgColor} p-8 rounded-[2rem] shadow-sm hover:shadow-md transition duration-300`}>
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                {tip.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">{tip.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">{tip.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HealthTips;