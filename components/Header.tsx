'use client';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
        <img
          src="/logo.png"
          alt="KROSS Sportokboltja"
          width={184}
          height={35}
          className="h-9 w-auto object-contain"
        />
        <span className="hidden sm:block text-[9px] font-black tracking-[0.3em] uppercase text-gray-300">
          Kerékpár Konfigurátor
        </span>
      </div>
    </header>
  );
}
