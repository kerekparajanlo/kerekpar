'use client';

import { useEffect } from 'react';
import { Bike, FormData } from '@/lib/types';
import { dealersList } from '@/lib/dealers';
import ImageSlider from './ImageSlider';
import { supabase } from '@/lib/supabase';

interface ResultsProps {
  bike: Bike;
  formData: FormData;
}

export default function Results({ bike, formData }: ResultsProps) {
  const dealers = dealersList.filter(d => d.city === formData.city);

  useEffect(() => {
    const saveLead = async () => {
      // Csak akkor mentsünk, ha van email (biztonsági csekk)
      if (!formData.email) return;

      const { error } = await supabase
        .from('leads')
        .insert([
          {
            email: formData.email,
            bike_name: bike.name,
            city: formData.city,
            gender: formData.frame === 'male' ? 'Férfi' : 'Női',
          }
        ]);

      if (error) {
        console.error('Supabase mentési hiba:', error.message);
      } else {
        console.log('Lead sikeresen elmentve a Supabase-be!');
      }
    };

    saveLead();
  }, [bike.name, formData]); // Függőségek hozzáadva a biztonság kedvéért

  return (
    <div className="space-y-2.5">

      {/* Top bento row */}
      <div className="grid md:grid-cols-[2fr_1fr] gap-2.5">

        {/* Image — aspect-ratio on INNER div, not the grid item */}
        <div className="min-w-0 rounded-2xl overflow-hidden bg-white border border-gray-100">
          <div className="w-full aspect-[4/3]">
            <ImageSlider bike={bike} />
          </div>
        </div>

        {/* Stats column */}
        <div className="min-w-0 flex flex-col gap-2.5">

          {/* Price */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-2">Ár</p>
            <p className="text-3xl font-black tracking-tighter text-[#ff0000] leading-none">
              {new Intl.NumberFormat('hu-HU').format(bike.price)}
              <span className="text-sm font-bold text-gray-400 ml-1">Ft</span>
            </p>
            <p className="text-xs text-gray-400 mt-2 font-semibold">
              Max: {new Intl.NumberFormat('hu-HU').format(formData.maxPrice)} Ft
            </p>
          </div>

          {/* Frame */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-2">Váz</p>
            <p className="text-xl font-black tracking-tight text-black">
              {formData.frame === 'male' ? '♂ Férfi' : '♀ Női'}
            </p>
          </div>

          {/* CTA — fills remaining height */}
          <div className="flex-1 min-h-[100px] rounded-2xl bg-[#ff0000] p-4 shadow-[0_8px_32px_rgba(255,0,0,0.25)] flex flex-col justify-between">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-red-200">
              Termék
            </p>
            {/* Itt most már a konkrét kerékpár URL-jére mutat! */}
            <a
              href={bike.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-white text-[#ff0000] font-black text-xs tracking-widest uppercase rounded-xl text-center hover:bg-gray-50 transition-colors"
            >
              Megnézem →
            </a>
          </div>

        </div>
      </div>

      {/* Bike name hero */}
      <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-black leading-none mb-1 truncate">
            {bike.name}
          </h2>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
            {bike.style === 'comfortable' ? 'Kényelmes trekking kerékpár' : 'Sportos cross trekking kerékpár'}
          </p>
        </div>
        <span className={`shrink-0 px-3 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase rounded-xl ${
          bike.style === 'sporty' ? 'bg-[#ff0000] text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {bike.type === 'trekking' ? 'TRANS' : 'EVADO'}
        </span>
      </div>

      {/* Dealers */}
      {dealers.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-3">
            Kereskedők — {formData.city}
          </p>
          <div className={`grid gap-3 max-h-40 overflow-y-auto pr-1 ${dealers.length > 1 ? 'sm:grid-cols-2' : ''}`}>
            {dealers.map((d, i) => (
              <div key={i} className="border-l-2 border-[#ff0000] pl-3">
                <p className="font-black text-sm text-black">{d.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{d.address}</p>
                {d.email && (
                  <a href={`mailto:${d.email}`}
                    className="text-xs font-semibold text-[#ff0000] hover:underline mt-1 block">
                    {d.email}
                  </a>
                )}
                {d.website && (
                  <a href={d.website} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-black transition-colors mt-0.5 block truncate">
                    {d.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
