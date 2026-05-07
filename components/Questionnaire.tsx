'use client';

import { useState, useMemo } from 'react';
import { FormData } from '@/lib/types';
import { bikes } from '@/lib/bikes';
import LoadingScreen from './LoadingScreen';

// Távolságkalkulátor (Haversine formula)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Föld sugara km-ben
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

// A KROSS boltok városainak fix koordinátái (68 település)
const dealerCoords: Record<string, [number, number]> = {
  "Érd": [47.3804, 18.9139], "Kisújszállás": [47.2186, 20.7622], "Karcag": [47.3167, 20.9333],
  "Budapest": [47.4979, 19.0402], "Nyíregyháza": [47.9554, 21.7167], "Ajka": [47.1000, 17.5667],
  "Szentendre": [47.6667, 19.0833], "Pécs": [46.0727, 18.2323], "Szombathely": [47.2307, 16.6214],
  "Körmend": [47.0111, 16.6060], "Balatonalmádi": [47.0286, 18.0206], "Szentes": [46.6500, 20.2667],
  "Balatonkenese": [47.0342, 18.1008], "Siófok": [46.9041, 18.0580], "Győr": [47.6833, 17.6351],
  "Miskolc": [48.1000, 20.7833], "Kecskemét": [46.9062, 19.6913], "Felsőtárkány": [47.9736, 20.4150],
  "Szolnok": [47.1708, 20.1979], "Mosonmagyaróvár": [47.8679, 17.2694], "Balmazújváros": [47.6167, 21.3333],
  "Eger": [47.9026, 20.3733], "Paks": [46.6250, 18.8583], "Fertőd": [47.6222, 16.8711],
  "Keszthely": [46.7681, 15.2486], "Dombóvár": [46.3750, 18.1361], "Gyula": [46.6500, 21.2833],
  "Pomáz": [47.6483, 19.0253], "Szeged": [46.2530, 20.1414], "Vác": [47.7833, 19.1333],
  "Csorna": [47.6115, 17.2497], "Tatabánya": [47.5800, 18.3975], "Debrecen": [47.5316, 21.6273],
  "Székesfehérvár": [47.1899, 18.4103], "Bordány": [46.3267, 19.9111], "Bonyhád": [46.2975, 18.5306],
  "Szekszárd": [46.3474, 18.7062], "Dunaújváros": [46.9619, 18.9350], "Sopron": [47.6833, 16.5833],
  "Gyöngyös": [47.7833, 19.9333], "Páty": [47.5133, 18.8267], "Bodajk": [47.3236, 18.2300],
  "Budakeszi": [47.5122, 18.9286], "Dabas": [47.1833, 19.3167], "Veszprém": [47.0928, 17.9100],
  "Kiskunfélegyháza": [46.7083, 19.8497], "Mór": [47.3739, 18.2078], "Hatvan": [47.6667, 19.6833],
  "Komárom": [47.7389, 18.1194], "Baja": [46.1833, 18.9500], "Mátészalka": [47.9525, 22.3250],
  "Rétság": [47.9286, 19.1367], "Mohács": [45.9950, 18.6806], "Heves": [47.5992, 20.2764],
  "Békéscsaba": [46.6800, 21.0978], "Budaörs": [47.4619, 18.9525], "Pápa": [47.3300, 17.4675],
  "Kazincbarcika": [48.2533, 20.6225], "Révfülöp": [46.8286, 17.6292], "Tarján": [47.6103, 18.5083],
  "Balatonfüred": [46.9500, 17.8833], "Tata": [47.6533, 18.3183], "Kaposvár": [46.3500, 17.7833],
  "Salgótarján": [48.0983, 19.8050], "Dunakeszi": [47.6333, 19.1333], "Balatonlelle": [46.7869, 17.6953],
  "Nagykanizsa": [46.4500, 16.9833], "Tát": [47.7408, 18.6472]
};

const card = 'p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer w-full bg-white';
const on   = 'border-[#ff0000] shadow-[0_4px_20px_rgba(255,0,0,0.14)]';
const off  = 'border-gray-200 hover:border-gray-300';
const lbl  = 'text-[10px] font-black tracking-[0.3em] uppercase text-[#ff0000] mb-2.5 block';

export default function Questionnaire({ onSubmit }: { onSubmit: (d: FormData) => void }) {
  const maxPrice = useMemo(() => Math.max(...bikes.map(b => b.price)), []);
  
  const [form, setForm] = useState<FormData>({
    style: 'comfortable',
    frame: 'male',
    city: '',
    email: '',
    maxPrice,
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const pct = (form.maxPrice / maxPrice) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Partial<FormData> = {};
    if (!form.city) err.city = 'Kötelező megadni a települést';
    if (!form.email) err.email = 'Kötelező megadni az e-mail címet';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Érvénytelen formátum';
    
    setErrors(err);
    
    if (!Object.keys(err).length) {
      setIsLoading(true);
      const startTime = Date.now();

      try {
        // Általános keresés a térképen a júzer által beírt településre (q= használata)
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(form.city)}&countrycodes=hu&format=json`);
        const data = await res.json();

        let nearestCity = form.city;

        // Ha megtalálta a térkép a települést
        if (data && data.length > 0) {
          const userLat = parseFloat(data[0].lat);
          const userLon = parseFloat(data[0].lon);
          let minDist = Infinity;

          // Megkeressük a legközelebbi KROSS boltot
          for (const [city, coords] of Object.entries(dealerCoords)) {
            const dist = getDistance(userLat, userLon, coords[0], coords[1]);
            if (dist < minDist) {
              minDist = dist;
              nearestCity = city;
            }
          }
        }

        // Kiszámoljuk mennyi idő telt el, hogy pontosan 6.5mp legyen az animáció
        const elapsed = Date.now() - startTime;
        const timeLeft = Math.max(0, 6500 - elapsed);

        setTimeout(() => {
          // Elküldjük a legközelebbi város nevét a Results-nak
          onSubmit({ ...form, city: nearestCity });
        }, timeLeft);

      } catch (error) {
        // Ha elmegy a net a lekérdezés közben, simán tovább engedjük
        setTimeout(() => onSubmit(form), 6500);
      }
    }
  };

  const inputCls = (field: keyof FormData) =>
    `w-full px-3 py-3 rounded-xl border-2 bg-white text-black font-semibold text-sm outline-none transition-colors ${
      errors[field] ? 'border-red-500' : form[field] ? 'border-[#ff0000]' : 'border-gray-200 focus:border-gray-400'
    }`;

  if (isLoading) return <LoadingScreen />;

  return (
    <form onSubmit={handleSubmit}>

      {/* 1. Sor — Stílus és Váz */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <span className={lbl}>Stílus</span>
          <div className="grid grid-cols-1 gap-2">
            {([
              { val: 'comfortable', icon: '🛣️', name: 'Komfortos', sub: 'kerékpár' },
              { val: 'sporty',      icon: '⚡',  name: 'Sportos',   sub: 'kerékpár' },
            ] as const).map(o => (
              <button
                key={o.val} type="button"
                onClick={() => setForm(f => ({ ...f, style: o.val }))}
                className={`${card} ${form.style === o.val ? on : off} flex items-center gap-3`}
              >
                <span className="text-xl">{o.icon}</span>
                <div>
                    <span className="block text-xs font-black text-black uppercase tracking-tight">{o.name}</span>
                    <span className="block text-[10px] text-gray-500 uppercase font-bold">{o.sub}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className={lbl}>Váz típusa</span>
          <div className="grid grid-cols-1 gap-2">
            {([
              { val: 'male',   icon: '♂', name: 'FÉRFI', sub: 'Hagyományos' },
              { val: 'female', icon: '♀', name: 'NŐI',   sub: 'Nyitott'     },
            ] as const).map(o => (
              <button
                key={o.val} type="button"
                onClick={() => setForm(f => ({ ...f, frame: o.val }))}
                className={`${card} ${form.frame === o.val ? on : off} flex items-center gap-3`}
              >
                <span className="text-2xl leading-none">{o.icon}</span>
                <div>
                    <span className="block text-xs font-black text-black uppercase tracking-tight">{o.name}</span>
                    <span className="block text-[10px] text-gray-500 uppercase font-bold">{o.sub}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Sor — Ár */}
      <div className="mb-5">
        <span className={lbl}>Maximális ár</span>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-4xl font-black tracking-tighter text-black leading-none">
            {(form.maxPrice / 1000).toFixed(0)}
          </span>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">ezer Ft</span>
        </div>
        <input
          type="range" min={0} max={maxPrice} value={form.maxPrice}
          onChange={e => setForm(f => ({ ...f, maxPrice: +e.target.value }))}
          style={{ background: `linear-gradient(to right,#ff0000 ${pct}%,#e5e5e5 ${pct}%)` }}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* 3. Sor — Település és Email */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <span className={lbl}>Település</span>
          <input
            type="text" placeholder="pl. Máriakálnok..."
            value={form.city}
            onChange={e => {
              setForm(f => ({ ...f, city: e.target.value }));
              setErrors(er => ({ ...er, city: undefined }));
            }}
            className={inputCls('city')}
          />
          {errors.city && <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase">{errors.city}</p>}
        </div>

        <div>
          <span className={lbl}>E-mail cím</span>
          <input
            type="email" placeholder="pelda@email.hu"
            value={form.email}
            onChange={e => {
              setForm(f => ({ ...f, email: e.target.value }));
              setErrors(er => ({ ...er, email: undefined }));
            }}
            className={inputCls('email')}
          />
          {errors.email && <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase">{errors.email}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-[#ff0000] text-white font-black text-sm tracking-[0.2em] uppercase rounded-xl shadow-[0_8px_32px_rgba(255,0,0,0.3)] hover:bg-black transition-all duration-300"
      >
        Kerékpár keresése →
      </button>

    </form>
  );
}
