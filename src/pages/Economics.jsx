import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Rocket } from 'lucide-react'

export default function Economics() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const investments = [
    { label: 'ФОТ (24 чел × 12 мес)', value: '35-45', color: 'red' },
    { label: 'Оборудование (роботы, GPU)', value: '15-20', color: 'red' },
    { label: 'Инфраструктура, лицензии', value: '5-10', color: 'red' },
  ]

  const returns = [
    { label: 'Экономия РТ от внедрений', value: '20-50', color: 'green' },
    { label: 'Гранты и субсидии', value: '10-20', color: 'green' },
    { label: 'Пилотные контракты', value: '10-30', color: 'green' },
  ]

  return (
    <section id="economics" className="relative py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
      
      {/* Background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <DollarSign className="text-yellow-400" size={16} />
            <span className="text-yellow-400 text-sm font-medium">Экономика</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Инвестиции и{' '}
            <span className="gradient-text from-yellow-400 to-amber-400">возврат</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Прозрачная модель финансирования с понятным ROI. 
            Окупаемость к концу второго года при успешных внедрениях.
          </p>
        </motion.div>

        {/* Main financial cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Investments */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-red-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <TrendingDown className="text-red-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Инвестиции Wave 1</h3>
                <p className="text-sm text-slate-400">2026 год</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {investments.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-red-400 font-semibold">{item.value} млн₽</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
              <span className="font-semibold">Итого</span>
              <span className="text-2xl font-bold text-red-400">55-75 млн₽</span>
            </div>
          </motion.div>

          {/* Returns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass rounded-2xl p-6 border border-green-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Возврат</h3>
                <p className="text-sm text-slate-400">2026-2027 годы</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {returns.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-green-400 font-semibold">{item.value} млн₽</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
              <span className="font-semibold">Потенциал</span>
              <span className="text-2xl font-bold text-green-400">40-100 млн₽</span>
            </div>
          </motion.div>
        </div>

        {/* Wave 2 scaling */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass rounded-2xl p-6 mb-12 border border-cyan-500/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Rocket className="text-cyan-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Wave 2: Эффект платформы</h3>
              <p className="text-sm text-slate-400">2027-2028 годы</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">+2</div>
              <div className="text-slate-300">Новые лаборатории</div>
              <div className="text-sm text-slate-500">(Биотех, Химия)</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">-40%</div>
              <div className="text-slate-300">Удельные затраты</div>
              <div className="text-sm text-slate-500">За счёт переиспользования</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">×2-3</div>
              <div className="text-slate-300">Рост выручки</div>
              <div className="text-sm text-slate-500">Новые рынки</div>
            </div>
          </div>
        </motion.div>

        {/* Key metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: '📊', value: '18-24', unit: 'мес', label: 'Срок окупаемости' },
            { icon: '💰', value: '1.5-2×', unit: '', label: 'ROI к 2028' },
            { icon: '📈', value: '70%', unit: '', label: 'Доля РТК в IP' },
            { icon: '🎓', value: '30%', unit: '', label: 'Доля ВУЗа в IP' },
          ].map((metric, i) => (
            <div key={i} className="glass rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{metric.icon}</div>
              <div className="text-2xl font-bold gradient-text from-yellow-400 to-amber-400">
                {metric.value}<span className="text-base">{metric.unit}</span>
              </div>
              <div className="text-sm text-slate-400">{metric.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-sm text-slate-500 mt-8"
        >
          * Оценки базируются на анализе аналогичных проектов и могут корректироваться
        </motion.p>
      </div>
    </section>
  )
}
