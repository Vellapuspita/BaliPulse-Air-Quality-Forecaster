import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { RefreshCcw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const BALI_COORDS = {
    "Denpasar": [-8.6705, 115.2126], "Badung": [-8.5175, 115.1311],
    "Gianyar": [-8.4750, 115.3000], "Tabanan": [-8.4500, 115.0500],
    "Klungkung": [-8.5333, 115.4000], "Bangli": [-8.3000, 115.3500],
    "Karangasem": [-8.3500, 115.5500], "Buleleng": [-8.1120, 115.0880],
    "Jembrana": [-8.3000, 114.6500], "Singaraja": [-8.1120, 115.0880] 
};

const BALI_BOUNDS = [[-8.9, 114.4], [-8.0, 115.7]];
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000/api";

function MapUpdater({ center, zoom }) {
    const map = useMap();
    useEffect(() => { 
        if (center) { map.flyTo(center, zoom, { duration: 1.5 }); } 
    }, [center, zoom, map]);
    return null;
}

export default function Maps() {
    const [regions, setRegions] = useState([]);
    const [data, setData] = useState({ map: [] });
    const [filter, setFilter] = useState({ region: "", date: "" });
    const [loading, setLoading] = useState(false);
    const circleRefs = useRef({});

    // Inisialisasi awal dengan Error Handling
    useEffect(() => {
        axios.get(`${API_BASE}/init`)
            .then(res => {
                setRegions(res.data.regions);
                const init = { region: res.data.regions[0], date: res.data.min_date };
                setFilter(init);
                fetchMapData(init);
            })
            .catch(err => {
                console.error("Gagal memuat inisialisasi API:", err);
                // Fallback Data Lokal agar UI tidak kosong melompong jika API putus
                const fallbackRegions = Object.keys(BALI_COORDS);
                setRegions(fallbackRegions);
                const init = { region: fallbackRegions[0], date: new Date().toISOString().split('T')[0] };
                setFilter(init);
            });
    }, []);

    const fetchMapData = async (f) => {
        if (!f.date || !f.region) return;
        setLoading(true);
        try {
            // Note: Tambahkan 'time' jika backend kamu wajib menerimanya, jika tidak biarkan seperti ini
            const res = await axios.get(`${API_BASE}/dashboard-data`, { params: { region: f.region, start: f.date } });
            if (res.data && res.data.map) {
                setData({ map: res.data.map });
            }
        } catch (err) {
            console.error("Gagal mengambil data peta:", err);
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => {
        let timeoutId;
        if (filter.region && circleRefs.current[filter.region]) {
            timeoutId = setTimeout(() => {
                const layer = circleRefs.current[filter.region];
                if (layer && !layer.isPopupOpen()) { layer.openPopup(); }
            }, 800); 
        }
        return () => clearTimeout(timeoutId);
    }, [filter.region, data.map]);

    return (
        <main className="p-8 space-y-6 text-left h-full flex flex-col min-h-screen relative z-0">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic leading-none">
                        Spatial <span className="text-indigo-600">Maps</span>
                    </h1>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 italic">
                        Distribusi Spasial Prediksi PM2.5
                    </p>
                </div>
                {loading && <RefreshCcw className="animate-spin text-indigo-500" size={20} />}
            </header>

            <div className="bg-white p-5 rounded-[2.5rem] border border-slate-200 flex flex-wrap gap-4 items-center shadow-sm relative z-10">
                <div className="w-48 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1 tracking-widest">Lokasi Fokus</label>
                    <select 
                        value={filter.region} 
                        onChange={(e) => setFilter({ ...filter, region: e.target.value })} 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none"
                    >
                        {regions.length > 0 ? (
                            regions.map(r => <option key={r} value={r}>{r}</option>)
                        ) : (
                            <option value="">Memuat...</option>
                        )}
                    </select>
                </div>
                <div className="flex-1 min-w-[130px] text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1 tracking-widest">Tanggal</label>
                    <input 
                        type="date" 
                        value={filter.date} 
                        min="2025-01-01" 
                        max="2026-12-31" 
                        onChange={(e) => setFilter({ ...filter, date: e.target.value })} 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs outline-none" 
                    />
                </div>

                <div className="mt-6">
                    <button 
                        onClick={() => fetchMapData(filter)} 
                        disabled={loading}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 disabled:opacity-50 shadow-xl shadow-indigo-200 transition-all h-[46px]"
                    >
                        {loading ? 'MEMUAT...' : 'UPDATE PETA'}
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white p-2 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden min-h-[600px] z-0">
                <MapContainer 
                    center={BALI_COORDS[filter.region] || [-8.4, 115.1]} 
                    zoom={filter.region ? 11 : 9.5} 
                    style={{ height: '100%', width: '100%', borderRadius: '2.5rem' }} 
                    zoomControl={false} 
                    maxBounds={BALI_BOUNDS} 
                    maxBoundsViscosity={1.0} 
                    minZoom={9}
                >
                    <MapUpdater center={BALI_COORDS[filter.region] || [-8.4, 115.1]} zoom={filter.region ? 11 : 9.5} />
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" bounds={BALI_BOUNDS} />
                    
                    {data.map && data.map.map((m) => (
                        <Circle 
                            key={`${m.name}-${m.color}-${filter.date}`} 
                            center={BALI_COORDS[m.name] || [-8.4, 115.1]} 
                            radius={3500 + (m.val * 80)} 
                            pathOptions={{ fillColor: m.color, color: m.color, fillOpacity: 0.5, weight: 2 }} 
                            ref={(r) => circleRefs.current[m.name] = r}
                        >
                            <Popup>
                                <div className="text-center font-bold font-sans">
                                    <b>{m.name}</b><br />{m.val} µg/m³
                                </div>
                            </Popup>
                        </Circle>
                    ))}
                </MapContainer>
            </div>
        </main>
    );
}