import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import AILab from './pages/labs/AILab'
import SoftwareLab from './pages/labs/SoftwareLab'
import RoboticsLab from './pages/labs/RoboticsLab'
import RoboticsCaseVKR from './pages/labs/cases/RoboticsCaseVKR'
import Modules from './pages/outputs/Modules'
import Robots from './pages/outputs/Robots'
import Software from './pages/outputs/Software'
import Talents from './pages/outputs/Talents'
import IP from './pages/outputs/IP'

function App() {
  return (
    <BrowserRouter basename="/lab-ecosystem">
      <ScrollToTop />
      <div className="min-h-screen bg-slate-900 text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/labs/ai" element={<AILab />} />
          <Route path="/labs/software" element={<SoftwareLab />} />
          <Route path="/labs/robotics" element={<RoboticsLab />} />
          <Route path="/labs/robotics/case-vkr" element={<RoboticsCaseVKR />} />
          <Route path="/outputs/modules" element={<Modules />} />
          <Route path="/outputs/robots" element={<Robots />} />
          <Route path="/outputs/software" element={<Software />} />
          <Route path="/outputs/talents" element={<Talents />} />
          <Route path="/outputs/ip" element={<IP />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
