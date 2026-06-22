import { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Globe, User, ChevronDown, Bell, Users, Search as SearchIcon, Tag, FolderOpen, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { mockPosts } from '../data/mockPosts';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMobileSearchOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'ha', label: 'Hausa' },
  ] as const;

  const searchResults = searchQuery.trim() ? mockPosts.filter(post => {
    const term = searchQuery.toLowerCase();
    const titleMatch = post.title[language].toLowerCase().includes(term);
    const excerptMatch = post.excerpt[language].toLowerCase().includes(term);
    const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(term));
    const catMatch = post.category.toLowerCase().includes(term);
    return titleMatch || excerptMatch || tagsMatch || catMatch;
  }).slice(0, 5) : [];

  return (
    <header className="sticky top-0 z-50 px-4 md:px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className={`flex items-center justify-between ${isMobileSearchOpen ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white hover:opacity-80 transition-opacity">
            Asrar<span className="text-emerald-600 dark:text-emerald-500">Hub</span>
          </Link>
        </div>
        
        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 relative" ref={searchRef}>
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full bg-slate-100 dark:bg-slate-800/50 border-0 rounded-full pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
            />
          </div>

          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden py-2 z-50 animate-in fade-in slide-in-from-top-2">
              {searchResults.length > 0 ? (
                <div className="max-h-[70vh] overflow-y-auto">
                  {searchResults.map(post => (
                    <button
                      key={post.id}
                      onClick={() => {
                        navigate(`/post/${post.id}`);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0 flex flex-col gap-1"
                    >
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">
                        {post.title[language]}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                          <FolderOpen className="w-3 h-3" />
                          {post.category}
                        </span>
                        {post.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                  {t('noResults')}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 md:gap-2.5">
          <button 
            className="md:hidden p-1.5 md:p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={t('search')}
            onClick={() => setIsMobileSearchOpen(true)}
          >
            <SearchIcon className="w-4 h-4 md:w-5 md:h-5 text-slate-600 dark:text-slate-400" />
          </button>

          <Link 
            to="/community" 
            className="hidden sm:block p-1.5 md:p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative" 
            title={t('community')}
          >
            <Users className="w-4 h-4 md:w-5 md:h-5 text-slate-600 dark:text-slate-400" />
          </Link>

          <Link 
            to="/notifications" 
            className="p-1.5 md:p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative" 
            title={t('notifications')}
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </Link>

          <div className="relative" ref={langRef}>
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)} 
              className="flex items-center gap-1.5 p-1.5 md:p-2 rounded-full md:rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" 
              title={t('language')}
            >
              <Globe className="w-4 h-4 md:w-5 md:h-5 text-slate-600 dark:text-slate-400" />
              <span className="hidden md:inline text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">
                {languages.find(l => l.code === language)?.label || language.toUpperCase()}
              </span>
              <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-slate-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      language === lang.code 
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={toggleTheme} 
            className="p-1.5 md:p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" 
            title={t('theme')}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 md:w-5 md:h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <Sun className="w-4 h-4 md:w-5 md:h-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>
          
          <Link to="/profile" className="ml-1 w-8 h-8 md:w-9 md:h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center overflow-hidden border-2 border-emerald-200 dark:border-emerald-800 cursor-pointer shadow-sm hover:ring-2 hover:ring-emerald-500/50 transition-all">
            <User className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 dark:text-emerald-400" />
          </Link>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden flex flex-col w-full animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-0 rounded-full pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 outline-none"
              />
            </div>
            <button 
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery('');
              }}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {searchQuery.trim() && (
            <div className="absolute top-16 left-4 right-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden py-2 z-50">
              {searchResults.length > 0 ? (
                <div className="max-h-[60vh] overflow-y-auto">
                  {searchResults.map(post => (
                    <button
                      key={post.id}
                      onClick={() => {
                        navigate(`/post/${post.id}`);
                        setIsMobileSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0 flex flex-col gap-1"
                    >
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">
                        {post.title[language]}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                          <FolderOpen className="w-3 h-3" />
                          {post.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                  {t('noResults')}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
