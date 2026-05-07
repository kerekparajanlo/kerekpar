'use client';

import { Player } from '@lottiefiles/react-lottie-player';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center">

      <Player
        autoplay
        loop
        src="https://lottie.host/9f5c3575-d2f6-455c-a5b5-e655938479e0/9K4C43XNxF.json"
        className="w-64 h-64 md:w-80 md:h-80"
      />

      <div className="mt-8 space-y-3">
        <h2 className="text-3xl font-black tracking-tighter text-black">
          Keressük a <span className="text-[#ff0000]">Tökéletes</span> Gépet
        </h2>
        <p className="text-gray-500 font-medium max-w-xs mx-auto">
          Mérnökeink épp összevetik az adataidat a legújabb Kross modellekkel...
        </p>
      </div>

      <div className="absolute bottom-10 left-10 w-20 h-20 bg-gray-50 rounded-full opacity-50" />
      <div className="absolute top-20 right-10 w-32 h-32 bg-[#ff0000]/5 rounded-full" />
    </div>
  );
}
