import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <span className="text-2xl">🔬</span>
              </div>
              <div>
                <div className="font-display font-bold text-xl">R&D Экосистема</div>
                <div className="text-sm text-slate-400">Политех × Ростелеком</div>
              </div>
            </div>
            <p className="text-slate-400 max-w-md mb-6">
              Платформа для создания инновационных продуктов на стыке искусственного интеллекта, 
              робототехники и прикладных решений. Объединяем науку и бизнес.
            </p>
            <div className="flex gap-3">
              {[Github, Linkedin, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2 text-slate-400">
              {['О проекте', 'Лаборатории', 'Экосистема', 'Экономика', 'Roadmap'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-emerald-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="font-semibold mb-4">Партнёры</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="https://www.company.rt.ru/" target="_blank" rel="noopener" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  Ростелеком <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.spbstu.ru/" target="_blank" rel="noopener" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  СПбПУ Политех <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} R&D Labs. Все права защищены.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
