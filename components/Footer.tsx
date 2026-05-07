'use client';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-xl font-bold text-slate-700 dark:text-slate-300">
            Sportokboltja
          </div>
        </div>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
          © 2026 KROSS Sportokboltja. Minden jog fenntartva.
        </p>
      </div>
    </footer>
  );
}
