import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../features/dashboard';
import { ChatPage } from '../features/chat';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
