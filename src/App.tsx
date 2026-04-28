import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ModulePage from './pages/ModulePage';

function App() {
  return (
    <HashRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/module/:moduleId" element={<ModulePage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
