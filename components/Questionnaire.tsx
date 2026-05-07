'use client';

import { useState, useMemo } from 'react';
import { FormData } from '@/lib/types';
import { dealersList } from '@/lib/dealers';
import { bikes } from '@/lib/bikes';
import LoadingScreen from './LoadingScreen';

const card = 'p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer w-full bg-white';
const on   = 'border-[#ff0000] shadow-[0_4px_20px_rgba(255,0,0,0.14)]';
const off  = 'border-gray-200 hover:border-gray-300';
const lbl  = 'text-[10px] font-black tracking-[0.3em] uppercase text-[#ff0000] mb-2.5 block';

export default function Questionnaire({ onSubmit }: { onSubmit: (d: FormData) => void }) {
  const maxPrice = useMemo(() => Math.max(...bikes.map(b => b.price)), []);
  
  // Most már az összes magyar település listáját használhatnánk, 
  // de kezdésnek az összes olyan várost mutatjuk, ahol van KROSS partner.
  const allCities = useMemo(() => [...new Set(dealersList.map(d => d.city))].sort(), []);

  const [form, setForm] = useState<FormData>({
    style: 'comfortable',
    frame: 'male',
    city: '',
    email: '',
    maxPrice,
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [search, setSearch] = useState('');
  const [drop, setDrop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = useMemo(
    () => allCities.filter(c => c.toLowerCase().includes(search.toLowerCase())),
    [search, allCities]
  );
  
  const pct = (form.maxPrice / maxPrice) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Partial<FormData> = {};
    if (!form.city) err.city = 'Kötelező megadni a települést';
    if (!form.email) err.email = 'Kötelező megadni az e-mail címet';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Érvénytelen formátum';
    
    setErrors(err);
    
    if (!Object.keys(err).length) {
      setIsLoading(true);
      setTimeout(() => {
        onSubmit(form);
      }, 6500);
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
          <div className="relative">
            <input
              type="text" placeholder="Kezdd el írni..."
              value={search}
              onChange={e => { setSearch(e.target.value); setForm(f => ({ ...f, city: '' })); }}
              onFocus={() => setDrop(true)}
              onBlur={() => setTimeout(() => setDrop(false), 150)}
              className={inputCls('city')}
            />
            {drop && filtered.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.1)] z-20 max-h-44 overflow-y-auto">
                {filtered.map(city => (
                  <li key={city}>
                    <button
                      type="button"
                      onMouseDown={() => {
                        setForm(f => ({ ...f, city }));
                        setSearch(city);
                        setDrop(false);
                        setErrors(er => ({ ...er, city: undefined }));
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-black hover:bg-red-50 hover:text-[#ff0000] transition-colors"
                    >
                      {city}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {errors.city && <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase">{errors.city}</p>}
          </div>
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
