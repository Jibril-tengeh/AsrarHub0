import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFont } from '../contexts/FontContext';
import { Link } from 'react-router-dom';
import { Settings, Type, AlignLeft } from 'lucide-react';

export function ProfileSettings() {
  const { t } = useLanguage();
  const { fontPreference, setFontPreference, arabicFontPreference, setArabicFontPreference } = useFont();

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <Link to="/" className="text-emerald-600 dark:text-emerald-500 font-medium hover:underline inline-flex items-center gap-1">
          &larr; {t('back')}
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4 flex items-center gap-2">
          <Settings className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
          Settings
        </h1>
      </div>

      <div className="space-y-6">
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Type className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            Interface Font
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'inter', name: 'Inter (Professional)' },
              { id: 'cairo', name: 'Cairo (Modern Arabic)' },
              { id: 'system', name: 'System Default' }
            ].map(font => (
              <button
                key={font.id}
                onClick={() => setFontPreference(font.id as any)}
                className={`p-4 rounded-xl border text-left transition-colors ${fontPreference === font.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-300'}`}
              >
                <div className={`font-${font.id} font-medium`}>{font.name}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            Sacred Texts/Arabic Font
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Choose a font for reading verses and wirds.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'amiri', name: 'Amiri (Calligraphic)', sample: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
              { id: 'tajawal', name: 'Tajawal (Modern)', sample: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
              { id: 'cairo', name: 'Cairo (Rounded)', sample: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' }
            ].map(font => (
              <button
                key={font.id}
                onClick={() => setArabicFontPreference(font.id as any)}
                className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-colors ${arabicFontPreference === font.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-300'}`}
              >
                <div className="font-medium text-sm text-slate-500 dark:text-slate-400">{font.name}</div>
                <div className={`font-${font.id} text-xl text-slate-900 dark:text-white rtl leading-normal`}>{font.sample}</div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
