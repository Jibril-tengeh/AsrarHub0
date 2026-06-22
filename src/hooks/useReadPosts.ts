import { useState, useEffect, useCallback } from 'react';

export function useReadPosts() {
  const [readPosts, setReadPosts] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('asrarhub_read_posts');
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

  const markAsRead = useCallback((id: string) => {
    setReadPosts((prev) => {
      if (!prev.includes(id)) {
        const newReadPosts = [...prev, id];
        localStorage.setItem('asrarhub_read_posts', JSON.stringify(newReadPosts));
        return newReadPosts;
      }
      return prev;
    });
  }, []);

  return { readPosts, markAsRead };
}
