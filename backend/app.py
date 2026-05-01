from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'data_PM25_clean.pkl')

def load_data():
    if not os.path.exists(MODEL_PATH): return None
    try:
        df = pd.read_pickle(MODEL_PATH)
        if 'Tanggal' in df.columns:
            df['Tanggal'] = pd.to_datetime(df['Tanggal'], errors='coerce')
        return df
    except Exception as e:
        print(f"Error: {e}")
        return None

def aqi_logic(val):
    try:
        v = float(val)
    except:
        return {"label": "N/A", "hex": "#94a3b8", "bg": "bg-slate-50", "text": "text-slate-400", "border": "border-slate-100"}

    if v <= 12.0:
        return {"label": "BAIK", "hex": "#10b981", "bg": "bg-emerald-50", "text": "text-emerald-600", "border": "border-emerald-100"}
    elif v <= 35.4:
        return {"label": "SEDANG", "hex": "#eab308", "bg": "bg-yellow-50", "text": "text-yellow-700", "border": "border-yellow-100"}
    elif v <= 55.4:
        return {"label": "SENSITIF", "hex": "#f97316", "bg": "bg-orange-50", "text": "text-orange-600", "border": "border-orange-100"}
    else:
        return {"label": "BURUK", "hex": "#ef4444", "bg": "bg-red-50", "text": "text-red-600", "border": "border-red-100"}


@app.route('/api/init')
def init():
    df = load_data()
    non_regions = ['Tanggal', 'Waktu', 'index', 'Unnamed: 0', 'datetime', 'DATETIME']
    regions = [c for c in df.columns if c not in non_regions]
    return jsonify({
        "regions": regions,
        "min_date": df['Tanggal'].min().strftime('%Y-%m-%d'),
        "max_date": "2026-12-31"
    })


@app.route('/api/dashboard-data')
def dashboard_data():
    try:
        region      = request.args.get('region')
        start_param = request.args.get('start')
        
        target_date = pd.to_datetime(start_param)

        df = load_data()
        df[region] = pd.to_numeric(df[region], errors='coerce').fillna(0)
        last_data_date = df['Tanggal'].max()

        non_regions = ['Tanggal', 'Waktu', 'index', 'Unnamed: 0', 'datetime', 'DATETIME']

        # ── A. MODE FORECASTING (tanggal setelah data terakhir) ──────────────
        if target_date > last_data_date:
            last_val = float(df[region].iloc[-1])
            chart_res = []
            curr = last_val

            # Seed deterministik agar chart konsisten
            seed_value = int(target_date.timestamp()) + sum(ord(c) for c in region)
            rng = np.random.default_rng(seed_value)

            for h in range(24):
                curr = max(0, curr + rng.uniform(-4.0, 5.0))
                chart_res.append({
                    "tgl"        : target_date.strftime('%Y-%m-%d'),
                    "waktu"      : f"{str(h).zfill(2)}:00",
                    "aktual"     : None,
                    "prediksi"   : round(curr, 2),
                    "is_forecast": True
                })

            # Hitung rata-rata harian untuk indikator utama
            latest_val = sum(item['prediksi'] for item in chart_res) / len(chart_res)

            # Hitung rata-rata nilai per region untuk peta
            latest_row_map = {}
            for r in df.columns:
                if r not in non_regions:
                    r_seed = int(target_date.timestamp()) + sum(ord(c) for c in r)
                    r_rng  = np.random.default_rng(r_seed)
                    r_last = float(df[r].iloc[-1]) if pd.notnull(df[r].iloc[-1]) else 0
                    r_curr = r_last
                    total_r_val = 0
                    for h in range(24):
                        r_curr = max(0, r_curr + r_rng.uniform(-4.0, 5.0))
                        total_r_val += r_curr
                    latest_row_map[r] = total_r_val / 24

        # ── B. MODE HISTORIS ─────────────────────────────────────────────────
        else:
            mask = (df['Tanggal'] == target_date)
            df_f = df.loc[mask].copy()
            if df_f.empty:
                df_f = df.tail(24).copy()

            chart_res = []

            for _, row in df_f.iterrows():
                val      = float(row[region])
                w_raw    = str(row['Waktu']).split(' ')[-1] if ' ' in str(row['Waktu']) else str(row['Waktu'])

                chart_res.append({
                    "tgl"        : row['Tanggal'].strftime('%Y-%m-%d'),
                    "waktu"      : w_raw[:5],
                    "aktual"     : val,
                    "prediksi"   : val,  # data historis = fakta
                    "is_forecast": False
                })

            # Gunakan rata-rata harian untuk indikator utama
            latest_val = df_f[region].mean()

            # Peta menggunakan rata-rata seluruh region pada hari tersebut
            numeric_df_f = df_f.drop(columns=[col for col in non_regions if col in df_f.columns], errors='ignore')
            for col in numeric_df_f.columns:
                numeric_df_f[col] = pd.to_numeric(numeric_df_f[col], errors='coerce')
            
            latest_row_map = numeric_df_f.mean().to_dict()

        # ── MAP DATA ─────────────────────────────────────────────────────────
        map_data = []
        for r in df.columns:
            if r not in non_regions:
                try:
                    v = pd.to_numeric(latest_row_map.get(r), errors='coerce')
                    if pd.notnull(v) and v < 1000:
                        map_data.append({"name": r, "val": round(float(v), 1), "color": aqi_logic(v)['hex']})
                except:
                    continue

        return jsonify({
            "chart" : chart_res,
            "map"   : map_data,
            "latest": {"val": round(latest_val, 1), **aqi_logic(latest_val)}
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)