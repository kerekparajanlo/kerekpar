'use client';

import { useState } from 'react';
import { Bike } from '@/lib/types';

export default function ImageSlider({ bike }: { bike: Bike }) {
  const [idx, setIdx] = useState(0);

  return (
    <div className="relative w-full h-full min-h-[200px] bg-white">
      <img
        src={bike.images[idx]}
        alt={`${bike.name} ${idx + 1}`}
        className="w-full h-full object-contain"
      />

      {bike.images.length > 1 && (
        <>
          <button
            onClick={() => setIdx(p => (p === 0 ? bike.images.length - 1 : p - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center text-xl font-bold text-black hover:bg-[#ff0000] hover:text-white transition-all"
            aria-label="Előző"
          >
            ‹
          </button>
          <button
            onClick={() => setIdx(p => (p + 1) % bike.images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center text-xl font-bold text-black hover:bg-[#ff0000] hover:text-white transition-all"
            aria-label="Következő"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {bike.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-[#ff0000]' : 'w-1.5 bg-white/70 hover:bg-white'}`}
                aria-label={`Kép ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
