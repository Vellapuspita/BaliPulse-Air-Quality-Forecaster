import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
        if (center) map.flyTo(center, zoom, { duration: 1.5 });
    }, [center, zoom, map]);
    return null;
}

export default function Dashboard() {
    const [regions, setRegions] = useState([]);
    const [data, setData] = useState({ chart: [], map: [], latest: null });
    const [filter, setFilter] = useState({ region: "", date: "", time: "12:00" });
    const [loading, setLoading] = useState(false);
    const circleRefs = useRef({});

    useEffect(() => {
        axios.get(`${API_BASE}/init`).then(res => {
            setRegions(res.data.regions);
            const init = { region: res.data.regions[0], date: res.data.min_date, time: "12:00" };
            setFilter(init);
            fetchDashboard(init);
        }).catch(err => console.error("Koneksi API Gagal"));
    }, []);

    const fetchDashboard = async (f) => {
        if (!f.date || !f.region) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/dashboard-data`, { params: { region: f.region, start: f.date, time: f.time } });
            setData(res.data);
        } finally { setLoading(false); }
    };

    useEffect(() => {
        let timeoutId;
        if (filter.region && circleRefs.current[filter.region]) {
            timeoutId = setTimeout(() => {
                const layer = circleRefs.current[filter.region];
                if (layer && !layer.isPopupOpen()) layer.openPopup();
            }, 800);
        }
        return () => clearTimeout(timeoutId);
    }, [filter.region, data.map]);

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 text-left overflow-x-hidden">

            {/* Header */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight italic leading-none">
                        Air Quality <span className="text-indigo-600">Forecaster</span>
                    </h1>
                    <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1 md:mt-2 italic">
                        Monitoring Spasial & Estimasi Masa Depan
                    </p>
                </div>
                {loading && <RefreshCcw className="animate-spin text-indigo-500 shrink-0" size={20} />}
            </header>

            {/* Filter & Konsentrasi */}
            <section className="flex flex-col xl:flex-row gap-4 md:gap-6 items-stretch">

                {/* Kotak Filter */}
                <div className="flex-1 bg-white p-4 md:p-5 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-end">

                        {/* Lokasi */}
                        <div className="text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1 tracking-widest">Lokasi</label>
                            <select
                                value={filter.region}
                                onChange={(e) => setFilter({ ...filter, region: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                            >
                                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        {/* Tanggal */}
                        <div className="text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1 tracking-widest">Tanggal</label>
                            <input
                                type="date" value={filter.date} min="2025-01-01" max="2026-12-31"
                                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs outline-none"
                            />
                        </div>

                        {/* Jam */}
                        <div className="text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1 tracking-widest">Jam</label>
                            <input
                                type="time" value={filter.time}
                                onChange={(e) => setFilter({ ...filter, time: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs outline-none"
                            />
                        </div>

                        {/* Tombol UPDATE DATA */}
                        <div>
                            <button
                                onClick={() => fetchDashboard(filter)}
                                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all h-[46px]"
                            >
                                UPDATE DATA
                            </button>
                        </div>
                    </div>
                </div>

                {/* Kartu Konsentrasi PM */}
                <div className={`w-full xl:w-80 p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-700 flex items-center justify-between shadow-sm shrink-0 ${data.latest?.bg || 'bg-white'} ${data.latest?.border || 'border-slate-200'}`}>
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${data.latest?.text || 'text-slate-400'}`}>
                            Tingkat Konsentrasi
                        </p>
                        <h2 className={`text-4xl md:text-5xl font-black tracking-tighter ${data.latest?.text || 'text-slate-800'}`}>
                            {data.latest?.val || "0.0"}
                            <span className="text-sm font-bold opacity-40 italic ml-1 leading-none">µg/m³</span>
                        </h2>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-white/60 ${data.latest?.text || 'text-slate-400'} border border-current/10`}>
                            {data.latest?.label || "Standby"}
                        </span>
                        <span className={`text-[10px] font-bold uppercase italic ${data.latest?.text || 'text-slate-400'} opacity-80 text-right`}>
                            Lokasi: {filter.region || "Pilih Lokasi"}
                        </span>
                    </div>
                </div>
            </section>

            {/* AQI Guide */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                    { range: "0 - 12", label: "BAIK", color: "bg-emerald-500", desc: "Aman beraktivitas" },
                    { range: "12 - 35", label: "SEDANG", color: "bg-yellow-500", desc: "Sensitif waspada" },
                    { range: "35 - 55", label: "SENSITIF", color: "bg-orange-500", desc: "Kurangi luar ruang" },
                    { range: "> 55", label: "BURUK", color: "bg-red-500", desc: "Wajib masker" }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3 md:gap-4">
                        <div className={`w-1.5 h-8 md:h-10 rounded-full shrink-0 ${item.color}`} />
                        <div className="text-left min-w-0">
                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none">{item.range}</p>
                            <p className="text-[11px] md:text-xs font-black text-slate-800 uppercase my-0.5">{item.label}</p>
                            <p className="text-[8px] text-slate-500 font-medium leading-tight">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Peta & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">

                {/* Map */}
                <div
                    className="lg:col-span-7 bg-white p-2 rounded-[2.5rem] md:rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden"
                    style={{ height: '380px' }}
                >
                    <MapContainer
                        center={BALI_COORDS[filter.region] || [-8.4, 115.1]}
                        zoom={filter.region ? 11 : 9.5}
                        style={{ height: '100%', width: '100%', borderRadius: '2.5rem' }}
                        zoomControl={false}
                        maxBounds={BALI_BOUNDS}
                        maxBoundsViscosity={1.0}
                        minZoom={9}
                    >
                        <MapUpdater
                            center={BALI_COORDS[filter.region] || [-8.4, 115.1]}
                            zoom={filter.region ? 11 : 9.5}
                        />
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            bounds={BALI_BOUNDS}
                        />
                        {data.map.map((m) => (
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

                {/* Chart */}
                <div
                    className="lg:col-span-5 bg-white p-5 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-slate-200 shadow-sm flex flex-col"
                    style={{ height: '380px' }}
                >
                    <div className="mb-4 md:mb-6 text-left shrink-0">
                        <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight uppercase italic leading-none">
                            Analisis Tren 24 Jam
                        </h3>
                        {data.chart[0]?.is_forecast && (
                            <span className="inline-block mt-2 text-[8px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 uppercase tracking-[0.2em] animate-pulse">
                                Recursive Prediction Mode Active
                            </span>
                        )}
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.chart} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorInd" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="waktu" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 900 }} dy={15} minTickGap={20} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 900 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey={data.chart[0]?.is_forecast ? "prediksi" : "aktual"}
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fill="url(#colorInd)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-slate-700 text-[10px] text-left">
                <p className="font-black text-indigo-400 mb-2 uppercase border-b border-slate-800 pb-2">
                    {payload[0].payload.tgl} | {payload[0].payload.waktu}
                </p>
                <div className="font-bold uppercase tracking-tighter">
                    Value: {payload[0].value.toFixed(2)} µg/m³
                </div>
            </div>
        );
    }
    return null;
};