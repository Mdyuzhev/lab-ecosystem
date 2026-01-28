import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SmoothScroll from '../components/SmoothScroll';
import Hero from './Hero';
import About from './About';
import Labs from './Labs';
import Ecosystem from './Ecosystem';
import Economics from './Economics';
import Roadmap from './Roadmap';
import Team from './Team';

export default function Home() {
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
    <SmoothScroll>
      <Navbar activeSection={activeSection} />
      <Hero />
      <About />
      <Labs />
      <Ecosystem />
      <Economics />
      <Roadmap />
      <Team />
    </SmoothScroll>
  );
}
