import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Newspaper } from 'lucide-react';

const HomePage = lazy(() => import('./pages/HomePage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="flex flex-col items-center gap-4 text-gray-400">
      <Newspaper className="w-10 h-10 animate-pulse" />
      <span className="text-sm">Loading...</span>
    </div>
  </div>
);

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 className="text-6xl font-bold text-gray-200 dark:text-gray-800 mb-4">404</h1>
    <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">Page not found</p>
    <a href="/" className="px-5 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition text-sm font-medium">
      Back to Home
    </a>
  </div>
);

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:id" element={<ArticlePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>

        <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 py-8 text-center text-sm text-gray-400 dark:text-gray-600">
          <p>NewsAggregator · Powered by NewsData.io · Built with React & Express</p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
