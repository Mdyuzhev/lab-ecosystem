import { motion } from 'framer-motion'
import { ChevronDown, Sparkles, Cpu, Bot } from 'lucide-react'

export default function Hero() {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 animated-gradient" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[15%] w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl border border-emerald-500/20 flex items-center justify-center"
      >
        <Cpu className="text-emerald-400" size={32} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-[15%] w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/20 flex items-center justify-center"
      >
        <Bot className="text-purple-400" size={40} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/3 left-[20%] w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl border border-amber-500/20 flex items-center justify-center"
      >
        <Sparkles className="text-amber-400" size={28} />
      </motion.div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-slate-300">Новая модель R&D партнёрства</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6"
        >
          <span className="gradient-text from-white via-slate-200 to-slate-400">
            R&D Экосистема
          </span>
          <br />
          <span className="gradient-text from-emerald-400 via-cyan-400 to-purple-400">
            Нового Поколения
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12"
        >
          Объединяем мощь <span className="text-blue-400 font-semibold">Ростелекома</span> и 
          научный потенциал <span className="text-purple-400 font-semibold">Политеха</span> для 
          создания технологий будущего
        </motion.p>

        {/* Partners logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-8 mb-12"
        >
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <span className="text-xl">🏢</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-blue-400">Ростелеком</div>
              <div className="text-xs text-slate-400">Индустриальный партнёр</div>
            </div>
          </div>
          
          <div className="text-3xl text-slate-600">×</div>
          
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <span className="text-xl">🎓</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-purple-400">СПбПУ Политех</div>
              <div className="text-xs text-slate-400">Научный партнёр</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToAbout}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-semibold text-lg flex items-center gap-2"
          >
            Узнать больше
            <ChevronDown size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
          >
            Смотреть презентацию
          </motion.button>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '5', label: 'Лабораторий', suffix: '' },
            { value: '24', label: 'Специалиста', suffix: '+' },
            { value: '70', label: 'Доля РТК', suffix: '%' },
            { value: '100', label: 'Потенциал ROI', suffix: 'M₽' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-display font-bold gradient-text from-emerald-400 to-cyan-400">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          onClick={scrollToAbout}
          className="w-8 h-12 rounded-full border-2 border-white/20 flex items-start justify-center p-2 cursor-pointer hover:border-emerald-400 transition-colors"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-white/50 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
