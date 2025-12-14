import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import TestPage from './pages/Test';
import ManualPage from './pages/Manual';
import ResultsPage from './pages/Results';
import AboutPage from './pages/About';
import { AssessmentProvider } from './context/AssessmentContext';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <AssessmentProvider>
      <div className="app-shell">
        <Header />
        <div className="page-stack">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/manual" element={<ManualPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </div>
    </AssessmentProvider>
  );
}

export default App;
