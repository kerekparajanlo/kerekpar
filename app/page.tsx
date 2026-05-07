'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Questionnaire from '@/components/Questionnaire';
import Results from '@/components/Results';
import LoadingScreen from '@/components/LoadingScreen';
import { FormData, SubmissionData } from '@/lib/types';
import { bikes } from '@/lib/bikes';

export default function Home() {
  const [submittedData, setSubmittedData] = useState<SubmissionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (formData: FormData) => {
    const filtered = bikes.filter(
      b => b.style === formData.style && b.frame === formData.frame && b.price <= formData.maxPrice
    );
    if (filtered.length === 0) return;
    const bike = filtered[Math.floor(Math.random() * filtered.length)];

    setIsLoading(true);
    setTimeout(() => {
      setSubmittedData({ ...formData, selectedBike: bike });
      setIsLoading(false);
    }, 6500);
  };

  return (
    <div className="bg-[#f8f8f8]">
      {isLoading && <LoadingScreen />}
      <Header />
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-5">
        {!submittedData ? (
          <>
            <div className="mb-5">
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ff0000] mb-1">
                Konfigurátor
              </p>
              <h1 className="text-2xl font-black tracking-[-0.04em] text-black">
                Találd meg az ideális kerékpárt
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
