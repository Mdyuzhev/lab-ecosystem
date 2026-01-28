import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './pages/Hero';
import About from './pages/About';
import Labs from './pages/Labs';
import Ecosystem from './pages/Ecosystem';
import Economics from './pages/Economics';
import Roadmap from './pages/Roadmap';
import Team from './pages/Team';

function App() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'labs', 'ecosystem', 'economics', 'roadmap', 'team'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar activeSection={activeSection} />
      <Hero />
      <About />
      <Labs />
      <Ecosystem />
      <Economics />
      <Roadmap />
      <Team />
      <Footer />
    </div>
  );
}

export default App;
