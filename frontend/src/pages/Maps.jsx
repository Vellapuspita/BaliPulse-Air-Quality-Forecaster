import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { RefreshCcw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Konfigurasi Koordinat & Batas Wilayah Bali
const BALI_COORDS = {
    "Denpasar": [-8.6705, 115.2126], "Badung": [-8.5175, 115.1311],
    "Gianyar": [-8.4750, 115.3000], "Tabanan": [-8.4500, 115.0500],
    "Klungkung": [-8.5333, 115.4000], "Bangli": [-8.3000, 115.3500],
    "Karangasem": [-8.3500, 115.5500], "Buleleng": [-8.1120, 115.0880],
    "Jembrana": [-8.3000, 114.6500], "Singaraja": [-8.1120, 115.0880] 
};

const BALI_BOUNDS = [[-8.9, 114.4], [-8.0, 115.7]];

// Menggunakan path relatif agar kompatibel dengan vercel.json rewrites
const API_BASE = "/api"; 

function MapUpdater({ center, zoom }) {
    const map = useMap();
    useEffect(() => { 
        if (center) { 
            map.flyTo(center, zoom, { duration: 1.5 }); 
        } 
    }, [center, zoom, map]);
    return null;
}

export default function Maps() {
    const [regions, setRegions] = useState([]);
    const [data, setData] = useState({ map: [] });
    const [filter, setFilter] = useState({ region: "", date: "" });
    const [loading, setLoading] = useState(false);
    const circleRefs = useRef({});

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE}/init`)
            .then(res => {
                setRegions(res.data.regions);
                const init = { region: res.data.regions[0], date: res.data.min_date };
                setFilter(init);
                fetchMapData(init);
            })
            .catch(err => console.error("Init error:", err))
            .finally(() => setLoading(false));
    }, []);

    const fetchMapData = async (f) => {
        if (!f.date || !f.region) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/dashboard-data`, { 
                params: { region: f.region, start: f.date } 
            });
            setData({ map: res.data.map });
        } catch (err) {
            console.error("Fetch error:", err);
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => {
        let timeoutId;
        if (filter.region && circleRefs.current[filter.region]) {
            timeoutId = setTimeout(() => {
                const layer = circleRefs.current[filter.region];
                if (layer && !layer.isPopupOpen()) { 
                    layer.openPopup(); 
                }
            }, 800); 
        }
        return () => clearTimeout(timeoutId);
    }, [filter.region, data.map]);

    return (
        /* Perbaikan Layout: Menggunakan p-4 di mobile dan p-8 di desktop agar tidak terpotong */
        <main className="p-4 md:p-8 space-y-6 text-left min-h-screen flex flex-col bg-[#F8FAFC]">
            
            {/* Header: Responsif terhadap sidebar mobile */}
            <header className="flex justify-between items-center mt-14 lg:mt-0">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight italic leading-none">
                        Spatial <span className="text-indigo-600">Maps</span>
                    </h1>
                    <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-2 italic">
                        Distribusi Spasial Prediksi PM2.5 BaliPulse
                    </p>
                </div>
                {loading && <RefreshCcw className="animate-spin text-indigo-500" size={20} />}
            </header>

            {/* Input Filter: Berubah menjadi 1 kolom di mobile dan 3 kolom di desktop */}
            <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1 tracking-widest">Lokasi Fokus</label>
                    <select 
                        value={filter.region} 
                        onChange={(e) => setFilter({ ...filter, region: e.target.value })} 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none text-sm transition-all focus:border-indigo-500"
                    >
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                <div className="text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1 tracking-widest">Tanggal Prediksi</label>
                    <input 
                        type="date" 
                        value={filter.date} 
                        min="2025-01-01" 
                        max="2026-12-31" 
                        onChange={(e) => setFilter({ ...filter, date: e.target.value })} 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none transition-all focus:border-indigo-500" 
                    />
                </div>

                <div>
                    <button 
                        onClick={() => fetchMapData(filter)} 
                        className="w-full bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all h-[48px]"
                    >
                        UPDATE PETA
                    </button>
                </div>
            </div>

            {/* Map Container: Menyesuaikan tinggi layar */}
            <div className="flex-1 bg-white p-2 rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden min-h-[400px] md:min-h-[600px] z-10">
                <MapContainer 
                    center={BALI_COORDS[filter.region] || [-8.4, 115.1]} 
                    zoom={filter.region ? 11 : 9.5} 
                    style={{ height: '100%', width: '100%', borderRadius: '1.8rem' }} 
                    zoomControl={false} 
                    maxBounds={BALI_BOUNDS} 
                    maxBoundsViscosity={1.0} 
                    minZoom={9}
                >
                    <MapUpdater center={BALI_COORDS[filter.region] || [-8.4, 115.1]} zoom={filter.region ? 11 : 9.5} />
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    {data.map.map((m) => (
                        <Circle 
                            key={`${m.name}-${m.color}-${filter.date}`} 
                            center={BALI_COORDS[m.name] || [-8.4, 115.1]} 
                            radius={3500 + (m.val * 80)} 
                            pathOptions={{ fillColor: m.color, color: m.color, fillOpacity: 0.5, weight: 2 }} 
                            ref={(r) => circleRefs.current[m.name] = r}
                        >
                            <Popup>
                                <div className="text-center font-sans">
                                    <b className="text-indigo-600 uppercase text-xs block mb-1">{m.name}</b>
                                    <span className="text-lg font-black text-slate-800">{m.val}</span>
                                    <span className="text-[10px] text-slate-400 ml-1">µg/m³</span>
                                </div>
                            </Popup>
                        </Circle>
                    ))}
                </MapContainer>
            </div>
        </main>
    );
}