'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Questionnaire from '@/components/Questionnaire';
import Results from '@/components/Results';
import { FormData, SubmissionData } from '@/lib/types';
import { bikes } from '@/lib/bikes';

export default function Home() {
  const [submittedData, setSubmittedData] = useState<SubmissionData | null>(null);

  const handleSubmit = (formData: FormData) => {
    // 1. Leszűrjük a stílus és a váz alapján az ÖSSZES egyező bringát
    const matchedBikes = bikes.filter(
      b => b.style === formData.style && b.frame === formData.frame
    );

    if (matchedBikes.length === 0) return;

    // 2. Leszűrjük azokat, amik beleférnek a megadott árba
    const affordableBikes = matchedBikes.filter(b => b.price <= formData.maxPrice);

    let selectedBike;

    if (affordableBikes.length > 0) {
      // Ha van a keretbe beleférő, akkor ár szerint CSÖKKENŐ sorrendbe rakjuk,
      // és a legelsőt (legdrágábbat/legjobbat) választjuk ki.
      selectedBike = affordableBikes.sort((a, b) => b.price - a.price)[0];
    } else {
      // Ha egyáltalán nincs beleférő kerékpár (mert túl keveset állított be),
      // akkor adjuk oda a legolcsóbbat ebből a kategóriából.
      selectedBike = matchedBikes.sort((a, b) => a.price - b.price)[0];
    }

    // Azonnal beállítjuk az eredményt (nincs dupla töltőképernyő!)
    setSubmittedData({ ...formData, selectedBike: selectedBike });
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-5">
        {!submittedData ? (
          <>
            <div className="mb-5">
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ff0000] mb-1">
                TREKKING KERÉKPÁR KONFIGURÁTOR
              </p>
              <h1 className="text-2xl font-black tracking-[-0.04em] text-black">
                Találd meg az ideális túra kerékpárt
              </h1>
            </div>
            <Questionnaire onSubmit={handleSubmit} />
          </>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ff0000] mb-1">
                Eredmény
              </p>
              <h1 className="text-2xl font-black tracking-[-0.04em] text-black">
                A te kerékpárod
              </h1>
            </div>
            <Results bike={submittedData.selectedBike} formData={submittedData} />
            <button
              onClick={() => setSubmittedData(null)}
              className="mt-4 text-sm text-gray-400 hover:text-black transition-colors font-semibold"
            >
              ← Vissza
            </button>
          </>
        )}
      </main>
    </div>
  );
}
