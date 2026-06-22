import { useLanguage } from '../contexts/LanguageContext';
import { Users, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export function Community() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {t('community')}
        </h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center"
      >
        <MessageSquare className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-6" />
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          La communauté arrive bientôt
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Cet espace vous permettra d'échanger avec les autres membres, de poser des questions et de partager vos expériences avec les wirds et les recettes.
        </p>
      </motion.div>
    </div>
  );
}
