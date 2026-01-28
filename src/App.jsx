import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import AILab from './pages/labs/AILab'
import SoftwareLab from './pages/labs/SoftwareLab'
import RoboticsLab from './pages/labs/RoboticsLab'

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
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
