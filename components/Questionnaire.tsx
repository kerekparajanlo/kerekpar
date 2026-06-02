'use client';

import { useState, useMemo } from 'react';
import { FormData } from '@/lib/types';
import { dealersList, normalizeCity } from '@/lib/dealers';
import { bikes } from '@/lib/bikes';

const card = 'p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer w-full bg-white';
const on = 'border-[#ff0000] shadow-[0_4px_20px_rgba(255,0,0,0.14)]';
const off = 'border-gray-200 hover:border-gray-300';
const lbl = 'text-[10px] font-black tracking-[0.3em] uppercase text-[#ff0000] mb-2.5 block';

export default function Questionnaire({ onSubmit }: { onSubmit: (d: FormData) => void }) {
  const maxPrice = useMemo(() => Math.max(...bikes.map(b => b.price)), []);
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

  const filtered = useMemo(
    () => {
      const normalizedSearch = normalizeCity(search);
      return allCities.filter(c => normalizeCity(c).includes(normalizedSearch));
    },
    [search, allCities]
  );

  const pct = (form.maxPrice / maxPrice) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const matchedCity = allCities.find(c => normalizeCity(c) === normalizeCity(search));
    const city = form.city || matchedCity || '';

    const err: Partial<FormData> = {};
    if (!city) err.city = 'Kötelező';
    if (!form.email) err.email = 'Kötelező';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Érvénytelen';

    setErrors(err);

    if (!Object.keys(err).length) {
      onSubmit({ ...form, city });
    }
  };

  const inputCls = (field: keyof FormData) =>
    `w-full px-3 py-3 rounded-xl border-2 bg-white text-black font-semibold text-sm outline-none transition-colors ${
      errors[field]
        ? 'border-red-500'
        : form[field]
        ? 'border-[#ff0000]'
        : 'border-gray-200 focus:border-gray-400'
    }`;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <span className={lbl}>Stílus</span>
          <div className="grid grid-cols-2 gap-2">
            {([
              { val: 'comfortable', icon: '🚲', name: 'TRANS', sub: 'Kényelmes' },
              { val: 'sporty', icon: '⚡', name: 'EVADO', sub: 'Sportos' },
            ] as const).map(o => (
              <button
                key={o.val}
                type="button"
                onClick={() => setForm(f => ({ ...f, style: o.val }))}
                className={`${card} ${form.style === o.val ? on : off}`}
              >
                <span className="text-xl block mb-1.5">{o.icon}</span>
                <span className="block text-xs font-black text-black">{o.name}</span>
                <span className="block text-[10px] text-gray-500 mt-0.5">{o.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className={lbl}>Váz típusa</span>
          <div className="grid grid-cols-2 gap-2">
            {([
              { val: 'male', icon: '♂', name: 'FÉRFI', sub: 'Hagyományos' },
              { val: 'female', icon: '♀', name: 'NŐI', sub: 'Nyitott' },
            ] as const).map(o => (
              <button
                key={o.val}
                type="button"
                onClick={() => setForm(f => ({ ...f, frame: o.val }))}
                className={`${card} ${form.frame === o.val ? on : off}`}
              >
                <span className="text-2xl block mb-1.5 leading-none">{o.icon}</span>
                <span className="block text-xs font-black text-black">{o.name}</span>
                <span className="block text-[10px] text-gray-500 mt-0.5">{o.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5">
        <span className={lbl}>Maximális ár</span>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-4xl font-black tracking-tighter text-black leading-none">
            {(form.maxPrice / 1000).toFixed(0)}
          </span>
          <span className="text-sm font-bold text-gray-400">ezer Ft</span>
        </div>

        <input
          type="range"
          min={0}
          max={maxPrice}
          value={form.maxPrice}
          onChange={e => setForm(f => ({ ...f, maxPrice: +e.target.value }))}
          style={{ background: `linear-gradient(to right,#ff0000 ${pct}%,#e5e5e5 ${pct}%)` }}
          className="w-full"
        />

        <div className="flex justify-between mt-2 text-[11px] font-semibold text-gray-400">
          <span>0 Ft</span>
          <span>{(maxPrice / 1000).toFixed(0)} 000 Ft</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <span className={lbl}>Város</span>
          <div className="relative">
            <input
              type="text"
              placeholder="Keresés..."
              value={search}
              onChange={e => {
                const value = e.target.value;
                const matchedCity = allCities.find(c => normalizeCity(c) === normalizeCity(value));

                setSearch(value);
                setForm(f => ({ ...f, city: matchedCity || '' }));
                setErrors(er => ({ ...er, city: matchedCity ? undefined : er.city }));
              }}
              onFocus={() => setDrop(true)}
              onBlur={() => setTimeout(() => setDrop(false), 150)}
              className={inputCls('city')}
            />

            {drop && filtered.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1.5 bg-white/95 backdrop-blur-2xl border border-gray-100 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.1)] z-20 max-h-44 overflow-y-auto">
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
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-black hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      {city}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {errors.city && (
              <p className="mt-1.5 text-xs font-bold text-red-500">{errors.city}</p>
            )}
          </div>
        </div>

        <div>
          <span className={lbl}>E-mail</span>
          <input
            type="email"
            placeholder="te@email.com"
            value={form.email}
            onChange={e => {
              setForm(f => ({ ...f, email: e.target.value }));
              setErrors(er => ({ ...er, email: undefined }));
            }}
            className={inputCls('email')}
          />

          {errors.email && (
            <p className="mt-1.5 text-xs font-bold text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-[#ff0000] text-white font-black text-sm tracking-[0.2em] uppercase rounded-xl shadow-[0_8px_32px_rgba(255,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(255,0,0,0.4)] hover:bg-red-600 active:scale-[0.99] transition-all duration-200"
      >
        Kerékpár keresése →
      </button>
    </form>
  );
}
