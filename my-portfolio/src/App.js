import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import RenderController from './components/RenderController/RenderController';

// Desktop Components
import Navbar from './components/Navbar/Navbar';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Projects from './components/pages/Projects';
import Contact from './components/pages/Contact';
import Footer from './components/Footer/Footer';

// Mobile Components
import NavbarMobile from './components/Navbar/mobile/NavbarMobile';
import HomeMobile from './components/pages/mobile/HomeMobile';
import AboutMobile from './components/pages/mobile/AboutMobile';
// import ProjectsMobile from './components/pages/mobile/ProjectsMobile';
import ContactMobile from './components/pages/mobile/ContactMobile';
import DeviceDebugger from './components/DeviceDebugger/DeviceDebugger';

import './App.css';

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="App">
      {!isHomePage && (
        <RenderController 
          desktopComponent={Navbar}
          mobileComponent={NavbarMobile}
        />
      )}
      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              <RenderController 
                desktopComponent={Home}
                mobileComponent={HomeMobile}
              />
            } 
          />
          <Route 
            path="/about" 
            element={
              <RenderController 
                desktopComponent={About}
                mobileComponent={AboutMobile}
              />
            } 
          />
          <Route 
            path="/projects" 
            element={
              <RenderController 
                desktopComponent={Projects}
                mobileComponent={Projects} // Fallback to desktop until mobile version is created
              />
            } 
          />
          <Route 
            path="/contact" 
            element={
              <RenderController 
                desktopComponent={Contact}
                mobileComponent={ContactMobile}
              />
            } 
          />
        </Routes>
      </main>
      <Footer />
      <DeviceDebugger />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
