import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/home';
import { ProfilePage } from '../pages/profile';
import { QuestsPage } from '../pages/quests';
import { ShopPage } from '../pages/shop';
import { DiscoverPage } from '../pages/discover';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/quests" element={<QuestsPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
