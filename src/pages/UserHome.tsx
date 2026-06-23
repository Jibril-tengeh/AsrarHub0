import { useState, useEffect, useMemo, ReactNode } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, Book, Sparkles, Feather, CheckCircle2, Bookmark, BookmarkCheck, Circle, CheckCircle, LayoutGrid, Square, LayoutList } from 'lucide-react';
import { mockPosts, Category, Post } from '../data/mockPosts';
import { Link } from 'react-router-dom';
import { useReadPosts } from '../hooks/useReadPosts';
import { useBookmarks } from '../hooks/useBookmarks';
import { useWirdsProgress } from '../hooks/useWirdsProgress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const categoryIcons = {
  wirds: <Book className="w-4 h-4" />,
  asrar: <Sparkles className="w-4 h-4" />,
  recipes: <Feather className="w-4 h-4" />
};

export function UserHome() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all' | 'saved'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [layout, setLayout] = useState<'grid' | 'single' | 'list'>(() => {
    try {
      const savedLayout = localStorage.getItem('userHomeLayout');
      if (savedLayout === 'grid' || savedLayout === 'single' || savedLayout === 'list') {
        return savedLayout;
      }
    } catch (e) {
      console.error('Failed to load layout preferences', e);
    }
    return 'single';
  });

  // Save layout preference when it changes
  useEffect(() => {
    try {
      localStorage.setItem('userHomeLayout', layout);
    } catch (e) {
      console.error('Failed to save layout preferences', e);
    }
  }, [layout]);
  
  const { readPosts } = useReadPosts();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { completedWirds, toggleWird } = useWirdsProgress();

  // Get unique tags across all posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockPosts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch = post.title[language].toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt[language].toLowerCase().includes(searchTerm.toLowerCase());
                          
    let matchesCategory = true;
    if (selectedCategory === 'saved') {
      matchesCategory = bookmarks.includes(post.id);
    } else if (selectedCategory !== 'all') {
      matchesCategory = post.category === selectedCategory;
    }

    const matchesTag = selectedTag === 'all' || (post.tags && post.tags.includes(selectedTag));

    return matchesSearch && matchesCategory && matchesTag;
  });

  const dailyPost = useMemo(() => {
    const today = new Date().getDate();
    return mockPosts[today % mockPosts.length];
  }, []);

  const wirdsList = useMemo(() => mockPosts.filter(p => p.category === 'wirds'), []);
  const progressPercentage = Math.round((completedWirds.length / (wirdsList.length || 1)) * 100);

  return (
    <div className="max-w-5xl mx-auto pt-8">
      {/* Daily Reflection Section */}
      <div className="mb-10 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 md:p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex items-center gap-4 flex-grow w-full md:w-auto">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md shrink-0">
            <Sparkles className="w-6 h-6 text-emerald-50" />
          </div>
          <div className="flex-grow min-w-0">
            <h2 className="text-xs font-bold tracking-widest text-emerald-100 uppercase mb-1">
              {t('dailyReflection') || 'Réflexion du jour'}
            </h2>
            <h3 className="text-lg md:text-xl font-bold truncate">
              {dailyPost.title[language]}
            </h3>
          </div>
        </div>
        
        <Link to={`/post/${dailyPost.id}`} className="relative z-10 shrink-0 inline-flex items-center justify-center w-full md:w-auto gap-2 bg-white text-emerald-800 px-5 py-2.5 md:py-2 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-colors shadow-sm">
          {t('readMore')} &rarr;
        </Link>
      </div>

      {/* Progress Tracker Widget */}
      <div className="mb-10 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            {t('dailyTracker') || 'Daily Wirds Tracker'}
          </h3>
          <span className="text-sm font-bold text-slate-500">
            {progressPercentage}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {wirdsList.map(wird => {
            const isDone = completedWirds.includes(wird.id);
            return (
              <button
                key={wird.id}
                onClick={() => toggleWird(wird.id)}
                className={`flex items-center gap-3 p-3 text-left rounded-xl border transition-all ${
                  isDone 
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-300' 
                    : 'border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className={`shrink-0 ${isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <span className={`text-sm font-medium line-clamp-1 ${isDone ? '' : 'text-slate-700 dark:text-slate-300'}`}>
                  {wird.title[language]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-10 space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-shadow text-lg"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">
              {t('categories')}:
            </span>
            <CategoryButton 
              active={selectedCategory === 'all'} 
              onClick={() => setSelectedCategory('all')}
              label={t('all')}
            />
            <CategoryButton 
              active={selectedCategory === 'wirds'} 
              onClick={() => setSelectedCategory('wirds')}
              icon={categoryIcons.wirds}
              label={t('wirds')}
            />
            <CategoryButton 
              active={selectedCategory === 'asrar'} 
              onClick={() => setSelectedCategory('asrar')}
              icon={categoryIcons.asrar}
              label={t('asrar')}
            />
            <CategoryButton 
              active={selectedCategory === 'recipes'} 
              onClick={() => setSelectedCategory('recipes')}
              icon={categoryIcons.recipes}
              label={t('recipes')}
            />
            <CategoryButton 
              active={selectedCategory === 'saved'} 
              onClick={() => setSelectedCategory('saved')}
              icon={<Bookmark className="w-4 h-4" />}
              label={t('saved')}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-full md:w-56 lg:w-64">
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl">
                  <SelectValue placeholder={t('allTags')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allTags')}</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>#{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-3xl shrink-0">
              <button
                className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 ${
                  layout === 'grid' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                onClick={() => setLayout('grid')}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 ${
                  layout === 'single' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                onClick={() => setLayout('single')}
              >
                <Square className="w-5 h-5" />
              </button>
              <button
                className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 ${
                  layout === 'list' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                onClick={() => setLayout('list')}
              >
                <LayoutList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className={`grid gap-6 ${
          layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' : 
          layout === 'single' ? 'grid-cols-1 max-w-2xl mx-auto' :
          'grid-cols-1'
        }`}>
          {filteredPosts.map((post) => (
            <div key={post.id}>
              <PostCard 
                post={post} 
                language={language} 
                t={t} 
                isRead={readPosts.includes(post.id)} 
                isBookmarked={bookmarks.includes(post.id)}
                onToggleBookmark={() => toggleBookmark(post.id)}
                layout={layout}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Book className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-lg text-slate-500 dark:text-slate-400">{t('noResults')}</p>
        </div>
      )}
    </div>
  );
}

function CategoryButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon?: ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active 
          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' 
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function PostCard({ post, language, t, isRead, isBookmarked, onToggleBookmark, layout = 'grid' }: { post: Post, language: 'en' | 'fr' | 'ha', t: any, isRead: boolean, isBookmarked: boolean, onToggleBookmark: () => void, layout?: 'grid' | 'single' | 'list' }) {
  const isDarkCategory = post.category === 'asrar';
  const isBlueCategory = post.category === 'wirds';
  
  const bgBadgeClass = isDarkCategory 
    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
    : isBlueCategory 
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';

  if (layout === 'list') {
    return (
      <div className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-slate-900 rounded-3xl border ${isRead ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-800'} hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:shadow-lg transition-all duration-300 group p-5 overflow-hidden`}>
        
        {/* Progress Bar indicator for read status */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 z-0">
          <div className={`h-full bg-emerald-500 transition-all duration-700 ${isRead ? 'w-full' : 'w-0'}`}></div>
        </div>

        <div className="flex-grow min-w-0 z-10 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${bgBadgeClass}`}>
                {categoryIcons[post.category]}
                {t(post.category)}
              </span>
              {isRead && (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="hidden sm:inline">{t('readStatus')}</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleBookmark();
              }}
            >
              {isBookmarked ? <BookmarkCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <Bookmark className="w-5 h-5 text-slate-400" />}
            </Button>
          </div>
          
          <Link to={`/post/${post.id}`} className="group-hover:opacity-90 block">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight truncate">
              {post.title[language]}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3 sm:mb-0">
              {post.excerpt[language]}
            </p>
          </Link>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 sm:pl-4 sm:border-l border-slate-100 dark:border-slate-800 z-10">
           <div className="flex items-center gap-2 sm:mb-4">
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                {post.author.charAt(0)}
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {post.author}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex h-8 w-8"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleBookmark();
                }}
              >
                {isBookmarked ? <BookmarkCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <Bookmark className="w-5 h-5 text-slate-400" />}
              </Button>
              <Link to={`/post/${post.id}`}>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 cursor-pointer">
                  &rarr;
                </span>
              </Link>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border ${isRead ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-800'} hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 group`}>
      <div className="p-6 md:p-8 flex-grow flex flex-col relative z-10 block">
        {isRead && (
          <div className="absolute top-0 right-0 p-4">
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded-md text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-3 h-3" />
              {t('readStatus')}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4 mt-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${bgBadgeClass}`}>
            {categoryIcons[post.category]}
            {t(post.category)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleBookmark();
            }}
            className={`rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 ${isBookmarked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </Button>
        </div>
        
        <Link to={`/post/${post.id}`} className="group-hover:opacity-90">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {post.title[language]}
          </h3>
          
          <p className="text-slate-600 dark:text-slate-400 pb-6 flex-grow leading-relaxed">
            {post.excerpt[language]}
          </p>
        </Link>
        
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
              {post.author.charAt(0)}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {post.author}
            </span>
          </div>
          <Link to={`/post/${post.id}`}>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 cursor-pointer">
              {t('readMore')} &rarr;
            </span>
          </Link>
        </div>
      </div>

      {/* Progress Bar indicator for read status */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-b-3xl overflow-hidden">
        <div className={`h-full bg-emerald-500 transition-all duration-700 ${isRead ? 'w-full' : 'w-0'}`}></div>
      </div>
    </div>
  );
}
