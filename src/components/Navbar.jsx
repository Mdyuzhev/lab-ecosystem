import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navItems = [
  { id: 'hero', label: 'Главная' },
  { id: 'about', label: 'О проекте' },
  { id: 'labs', label: 'Лаборатории' },
  { id: 'ecosystem', label: 'Экосистема' },
  { id: 'economics', label: 'Экономика' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'team', label: 'Команда' },
]

export default function Navbar({ activeSection }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'glass py-3' : 'py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <span className="text-xl">🔬</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-lg">R&D Labs</div>
              <div className="text-xs text-slate-400">Политех × РТК</div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-shadow"
          >
            Связаться
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? 0 : '100%',
        }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-30 lg:hidden"
      >
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="absolute right-0 top-0 bottom-0 w-72 bg-slate-800 p-6 pt-24">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-semibold">
            Связаться
          </button>
        </div>
      </motion.div>
    </>
  )
}
