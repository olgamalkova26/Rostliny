import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import PlantDetail from './pages/PlantDetail';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Categories />} />
        <Route path="/category/:name" element={<CategoryDetail />} />
        <Route path="/plant/:id" element={<PlantDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
