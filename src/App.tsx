import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { FontProvider } from './contexts/FontContext';
import { Header } from './components/Header';
import { UserHome } from './pages/UserHome';
import { PostDetail } from './pages/PostDetail';
import { Community } from './pages/Community';
import { Notifications } from './pages/Notifications';
import { ProfileSettings } from './pages/ProfileSettings';

import { BottomNav } from './components/BottomNav';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <FontProvider>
          <HashRouter>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 selection:bg-emerald-200 dark:selection:bg-emerald-900 pb-16">
              <Header />
              <main className="container mx-auto px-4 md:px-8 pb-16">
                <Routes>
                  <Route path="/" element={<UserHome />} />
                  <Route path="/post/:id" element={<PostDetail />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/profile" element={<ProfileSettings />} />
                </Routes>
              </main>
              <BottomNav />
            </div>
          </HashRouter>
        </FontProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
