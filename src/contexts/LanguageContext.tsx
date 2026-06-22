import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en' | 'ha';

const translations = {
  fr: {
    theme: 'Changer le thème',
    language: 'Changer la langue',
    search: 'Rechercher un secret, un wird...',
    categories: 'Catégories',
    all: 'Tout',
    wirds: 'Wirds',
    asrar: 'Secrets (Asrar)',
    recipes: 'Recettes',
    readMore: 'Lire la suite',
    publishedOn: 'Publié le',
    by: 'par',
    back: 'Retour aux publications',
    noResults: 'Aucun résultat trouvé pour votre recherche.',
    community: 'Communauté',
    notifications: 'Notifications',
    dailyReflection: 'Réflexion du jour',
    readStatus: 'Lu',
    readTime: 'min de lecture',
    bookmarks: 'Favoris',
    zenMode: 'Mode Zen',
    fontSize: 'Taille du texte',
    lineHeight: 'Espacement',
    fontFamily: 'Police',
    allTags: 'Tous les mots-clés',
    saved: 'Sauvegardé',
    dailyTracker: 'Suivi quotidien des Wirds'
  },
  en: {
    theme: 'Toggle theme',
    language: 'Toggle language',
    search: 'Search a secret, a wird...',
    categories: 'Categories',
    all: 'All',
    wirds: 'Wirds',
    asrar: 'Secrets (Asrar)',
    recipes: 'Recipes',
    readMore: 'Read more',
    publishedOn: 'Published on',
    by: 'by',
    back: 'Back to publications',
    noResults: 'No results found for your search.',
    community: 'Community',
    notifications: 'Notifications',
    dailyReflection: 'Daily Reflection',
    readStatus: 'Read',
    readTime: 'min read',
    bookmarks: 'Bookmarks',
    zenMode: 'Zen Mode',
    fontSize: 'Font Size',
    lineHeight: 'Line Height',
    fontFamily: 'Font Family',
    allTags: 'All Tags',
    saved: 'Saved',
    dailyTracker: 'Daily Wirds Tracker'
  },
  ha: {
    theme: 'Canja jigo',
    language: 'Canja harshe',
    search: 'Nemi sirri, wird...',
    categories: 'Rukunoni',
    all: 'Duka',
    wirds: 'Wirdo',
    asrar: 'Sirrika (Asrar)',
    recipes: 'Magunguna',
    readMore: 'Kara karantawa',
    publishedOn: 'An wallafa a',
    by: 'daga',
    back: 'Koma ga bayanai',
    noResults: 'Babu sakamako don bincikenku.',
    community: 'Al\'umma',
    notifications: 'Sanarwa',
    dailyReflection: 'Tunanin Yau',
    readStatus: 'An karanta',
    readTime: 'min karatu',
    bookmarks: 'Alamomi',
    zenMode: 'Sakin Karatu',
    fontSize: 'Girman Rubutu',
    lineHeight: 'Tsakanin Layuka',
    fontFamily: 'Rukunin Rubutu',
    allTags: 'Dukkan Alamu',
    saved: 'Ajiye',
    dailyTracker: 'Bibiyar Wirdo Na Yau'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['fr']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'fr' ? 'en' : 'fr'));
  };

  const t = (key: keyof typeof translations['fr']) => {
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
