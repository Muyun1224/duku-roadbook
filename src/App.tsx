import { HashRouter, Routes, Route } from 'react-router-dom';
import { RouteSelectPage } from '@/pages/RouteSelectPage';
import { HomePage } from '@/pages/HomePage';
import { DayDetailPage } from '@/pages/DayDetailPage';
import { JournalPage } from '@/pages/MyTripPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<RouteSelectPage />} />
        <Route path="/route/:routeId" element={<HomePage />} />
        <Route path="/route/:routeId/day/:dayNum" element={<DayDetailPage />} />
        <Route path="/route/:routeId/journal" element={<JournalPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <span className="text-4xl mb-4 block">🛣️</span>
        <p className="text-gray-600 mb-1 font-semibold">页面不存在</p>
        <p className="text-gray-400 text-sm mb-4">这条路还没修好，先回主路吧</p>
        <a href="#/" className="inline-block px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-full">
          返回路线选择
        </a>
      </div>
    </div>
  );
}

export default App;
