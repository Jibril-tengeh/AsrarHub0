import { useLanguage } from '../contexts/LanguageContext';
import { Bell, BellOff } from 'lucide-react';
import { motion } from 'motion/react';

export function Notifications() {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto pt-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
          <Bell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {t('notifications')}
        </h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center"
      >
        <BellOff className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-6" />
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Aucune notification
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Vous n'avez pas de nouvelles notifications pour le moment. Nous vous tiendrons informé des nouvelles publications et des interactions de la communauté.
        </p>
      </motion.div>
    </div>
  );
}
