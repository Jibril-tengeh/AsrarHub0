import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useFont } from '../contexts/FontContext';
import { mockPosts } from '../data/mockPosts';
import { ArrowLeft, BookOpen, Clock, User, Bookmark, BookmarkCheck, Settings2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useReadPosts } from '../hooks/useReadPosts';
import { useBookmarks } from '../hooks/useBookmarks';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

// Helper to detect Arabic text
const isArabicText = (text: string) => /[\u0600-\u06FF]/.test(text);

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { arabicFontPreference } = useFont();
  const { markAsRead } = useReadPosts();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const isBookmarked = id ? bookmarks.includes(id) : false;
  
  // Zen Mode Settings
  const [fontSize, setFontSize] = useState<number | number[]>([18]);
  const [lineHeight, setLineHeight] = useState<number | number[]>([1.7]);
  const [fontFamily, setFontFamily] = useState('sans');

  const currentFontSize = Array.isArray(fontSize) ? fontSize[0] : fontSize;
  const currentLineHeight = Array.isArray(lineHeight) ? lineHeight[0] : lineHeight;

  const post = mockPosts.find(p => p.id === id);

  useEffect(() => {
    if (id && post) {
      markAsRead(id);
    }
  }, [id, post, markAsRead]);

  const readTime = post ? Math.max(1, Math.ceil(post.content[language].split(/\s+/).length / 200)) : 1;

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Post not found</h2>
        <Link to="/" className="text-emerald-600 hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> {t('back')}
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto pt-8 pb-20"
    >
      <div className="flex items-center justify-between mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('back')}
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full ${isBookmarked ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-slate-500'}`}
            onClick={() => post && toggleBookmark(post.id)}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </Button>

          <Popover>
            <PopoverTrigger render={
              <Button variant="outline" size="icon" className="rounded-full text-slate-500 hover:text-slate-900">
                <Settings2 className="w-5 h-5" />
              </Button>
            } />
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h4 className="font-medium leading-none mb-4">{t('zenMode')}</h4>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-slate-500">{t('fontSize')}</label>
                      <span className="text-sm font-medium">{currentFontSize}px</span>
                    </div>
                    <Slider 
                      value={[currentFontSize]} 
                      onValueChange={(val) => setFontSize(val)} 
                      min={14} 
                      max={40} 
                      step={1} 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-slate-500">{t('lineHeight')}</label>
                      <span className="text-sm font-medium">{currentLineHeight}</span>
                    </div>
                    <Slider 
                      value={[currentLineHeight]} 
                      onValueChange={(val) => setLineHeight(val)} 
                      min={1.2} 
                      max={2.5} 
                      step={0.1} 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm text-slate-500">{t('fontFamily')}</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant={fontFamily === 'sans' ? 'default' : 'outline'}
                        onClick={() => setFontFamily('sans')}
                        className="font-sans text-xs h-8"
                      >
                        Sans
                      </Button>
                      <Button 
                        variant={fontFamily === 'serif' ? 'default' : 'outline'}
                        onClick={() => setFontFamily('serif')}
                        className="font-serif text-xs h-8"
                      >
                        Serif
                      </Button>
                      <Button 
                        variant={fontFamily === 'mono' ? 'default' : 'outline'}
                        onClick={() => setFontFamily('mono')}
                        className="font-mono text-xs h-8"
                      >
                        Mono
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
              <BookOpen className="w-4 h-4" />
              {t(post.category)}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-8">
            {post.title[language]}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('by')}</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{post.author}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Clock className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('publishedOn')}</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  {post.date}
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  {readTime} {t('readTime')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="transition-all duration-300 flex flex-col space-y-6"
          style={{
            fontFamily: fontFamily === 'sans' ? 'ui-sans-serif, system-ui, sans-serif' : fontFamily === 'serif' ? 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' : 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
          }}
        >
          {post.content[language].split('\n\n').map((paragraph, index) => {
            const hasArabic = isArabicText(paragraph);
            return (
              <p 
                key={index} 
                className={`text-slate-700 dark:text-slate-300 font-medium transition-all duration-300 ${hasArabic ? `font-${arabicFontPreference} text-right rtl` : ''}`}
                style={{
                  fontSize: `${hasArabic ? currentFontSize * 1.5 : currentFontSize}px`,
                  lineHeight: currentLineHeight
                }}
              >
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
