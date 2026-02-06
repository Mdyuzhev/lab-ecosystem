import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import AILab from './pages/labs/AILab'
import SoftwareLab from './pages/labs/SoftwareLab'
import RoboticsLab from './pages/labs/RoboticsLab'
import RoboticsCaseVKR from './pages/labs/cases/RoboticsCaseVKR'
import SoftwareReconciliation from './pages/labs/cases/SoftwareReconciliation'
import SoftwareDBAToolkit from './pages/labs/cases/SoftwareDBAToolkit'
import SoftwareAIAgents from './pages/labs/cases/SoftwareAIAgents'
import SoftwareProductDev from './pages/labs/cases/SoftwareProductDev'
import ImpactCalculator from './pages/tools/ImpactCalculator'
import DataReconciliation from './pages/tools/DataReconciliation'
import ExplainVisualizer from './pages/tools/ExplainVisualizer'
import ERDBuilder from './pages/tools/ERDBuilder'
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
          <Route path="/labs/software/reconciliation" element={<SoftwareReconciliation />} />
          <Route path="/labs/software/dba-toolkit" element={<SoftwareDBAToolkit />} />
          <Route path="/labs/software/ai-agents" element={<SoftwareAIAgents />} />
          <Route path="/labs/software/product-dev" element={<SoftwareProductDev />} />
          <Route path="/outputs/modules" element={<Modules />} />
          <Route path="/outputs/robots" element={<Robots />} />
          <Route path="/outputs/software" element={<Software />} />
          <Route path="/outputs/talents" element={<Talents />} />
          <Route path="/outputs/ip" element={<IP />} />
          <Route path="/tools/impact-calculator" element={<ImpactCalculator />} />
          <Route path="/tools/data-reconciliation" element={<DataReconciliation />} />
          <Route path="/tools/explain-visualizer" element={<ExplainVisualizer />} />
          <Route path="/tools/erd-builder" element={<ERDBuilder />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
