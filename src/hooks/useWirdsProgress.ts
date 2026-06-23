import { useState, useEffect } from 'react';

export function useWirdsProgress() {
  const [completedWirds, setCompletedWirds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('completedWirds');
      const savedDate = localStorage.getItem('wirdsDate');
      const today = new Date().toDateString();
      
      if (saved && savedDate === today) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading wirds progress', e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('completedWirds', JSON.stringify(completedWirds));
    localStorage.setItem('wirdsDate', new Date().toDateString());
  }, [completedWirds]);

  const toggleWird = (id: string) => {
    setCompletedWirds(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  return { completedWirds, toggleWird };
}
