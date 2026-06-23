import { useState, useCallback } from 'react';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('asrarhub_bookmarks');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const isBookmarked = prev.includes(id);
      const newBookmarks = isBookmarked ? prev.filter((b) => b !== id) : [...prev, id];
      localStorage.setItem('asrarhub_bookmarks', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  }, []);

  return { bookmarks, toggleBookmark };
}
