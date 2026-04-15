import { Routes, Route, Navigate } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';

function App() {
  return (
    <ResumeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/builder/:id" element={<BuilderPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ResumeProvider>
  );
}

export default App;
