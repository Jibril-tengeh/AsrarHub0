import { Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function BottomNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pb-safe z-50">
      <div className="flex justify-center items-center h-16 max-w-md mx-auto">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-20 h-full transition-colors ${
            location.pathname === '/' 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-300'
          }`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
      </div>
    </div>
  );
}
