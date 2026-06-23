import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type FontPreference = 'inter' | 'cairo' | 'amiri' | 'tajawal' | 'system';

interface FontContextType {
  fontPreference: FontPreference;
  setFontPreference: (font: FontPreference) => void;
  arabicFontPreference: FontPreference;
  setArabicFontPreference: (font: FontPreference) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: ReactNode }) {
  const [fontPreference, setFontPreference] = useState<FontPreference>(() => {
    const saved = localStorage.getItem('app-font');
    return (saved as FontPreference) || 'inter';
  });

  const [arabicFontPreference, setArabicFontPreference] = useState<FontPreference>(() => {
    const saved = localStorage.getItem('app-arabic-font');
    return (saved as FontPreference) || 'amiri';
  });

  useEffect(() => {
    localStorage.setItem('app-font', fontPreference);
    // Apply class to body
    const baseClasses = ['font-inter', 'font-cairo', 'font-system'];
    document.body.classList.remove(...baseClasses);
    
    if (fontPreference === 'inter') document.body.classList.add('font-inter');
    else if (fontPreference === 'cairo') document.body.classList.add('font-cairo');
    else document.body.classList.add('font-system');
  }, [fontPreference]);

  useEffect(() => {
    localStorage.setItem('app-arabic-font', arabicFontPreference);
  }, [arabicFontPreference]);

  return (
    <FontContext.Provider value={{ fontPreference, setFontPreference, arabicFontPreference, setArabicFontPreference }}>
      <div className={`
        ${arabicFontPreference === 'amiri' ? 'arabic-amiri' : ''}
        ${arabicFontPreference === 'tajawal' ? 'arabic-tajawal' : ''}
        ${arabicFontPreference === 'cairo' ? 'arabic-cairo' : ''}
      `}>
        {children}
      </div>
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
}
