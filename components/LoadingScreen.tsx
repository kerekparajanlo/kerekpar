'use client';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
      
      {/* Brutál egyszerű, de szép egyedi spinner */}
      <div className="relative w-24 h-24">
        {/* Külső piros kör */}
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        
        {/* Forgó piros ív (mint egy gyorsuló kerék) */}
        <div className="absolute inset-0 border-4 border-t-[#ff0000] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        
        {/* Belső pulzáló bringa ikon */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <span className="text-4xl">🚴</span>
        </div>
      </div>

      {/* Szöveg animációval */}
      <div className="mt-12 text-center space-y-4">
        <h2 className="text-2xl font-black tracking-tighter text-black uppercase italic">
          Kerékpár <span className="text-[#ff0000]">keresése</span> folyamatban
        </h2>
        
        <div className="flex justify-center gap-1">
          <div className="w-2 h-2 bg-[#ff0000] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-[#ff0000] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-[#ff0000] rounded-full animate-bounce"></div>
        </div>

        <p className="text-gray-400 text-[10px] font-black tracking-[0.2em] uppercase">
          Kross mérnöki adatok betöltése...
        </p>
      </div>

      {/* Háttér dekoráció */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-gray-50 -rotate-12 -z-10" />
    </div>
  );
}
