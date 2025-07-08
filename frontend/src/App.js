import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Calculator from './pages/Calculator';

// Service Pages
import PaintingServices from './pages/services/PaintingServices';
import WindowFitmentServices from './pages/services/WindowFitmentServices';
import DoorFitmentServices from './pages/services/DoorFitmentServices';
import ReworkServices from './pages/services/ReworkServices';
import InteriorDesignServices from './pages/services/InteriorDesignServices';
import TilesFitmentServices from './pages/services/TilesFitmentServices';
import KitchenStylingServices from './pages/services/KitchenStylingServices';
import PlumbingServices from './pages/services/PlumbingServices';
import MasonryWorkServices from './pages/services/MasonryWorkServices';
import WaterProofingServices from './pages/services/WaterProofingServices';
import GrillsGuardRailServices from './pages/services/GrillsGuardRailServices';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSEO from './pages/admin/AdminSEO';
import AdminServices from './pages/admin/AdminServices';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/calculator" element={<Calculator />} />
            
            {/* Individual Service Pages */}
            <Route path="/services/painting-services" element={<PaintingServices />} />
            <Route path="/services/window-fitment-services" element={<WindowFitmentServices />} />
            <Route path="/services/door-fitment-services" element={<DoorFitmentServices />} />
            <Route path="/services/rework-services" element={<ReworkServices />} />
            <Route path="/services/interior-design-services" element={<InteriorDesignServices />} />
            <Route path="/services/tiles-fitment-services" element={<TilesFitmentServices />} />
            <Route path="/services/kitchen-styling-services" element={<KitchenStylingServices />} />
            <Route path="/services/plumbing-services" element={<PlumbingServices />} />
            <Route path="/services/masonry-work-services" element={<MasonryWorkServices />} />
            <Route path="/services/water-proofing-services" element={<WaterProofingServices />} />
            <Route path="/services/grills-guard-rail-fitment-services" element={<GrillsGuardRailServices />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/seo" element={<AdminSEO />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;