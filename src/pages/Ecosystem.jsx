import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, ArrowRight, Building2, GraduationCap, Scale, Brain, Monitor, Bot, Package, Wrench, Briefcase, FileText } from 'lucide-react'

export default function Ecosystem() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="ecosystem" className="relative py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-slate-900" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <span className="text-amber-400 text-sm font-medium">Экосистема</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Как всё{' '}
            <span className="gradient-text from-amber-400 to-orange-400">работает вместе</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Управляющий комитет координирует работу, ИИ-фабрика создаёт инструменты, 
            продуктовые команды превращают их в результаты
          </p>
        </motion.div>

        {/* Main ecosystem diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Stakeholders */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="glass rounded-xl p-4 w-56">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold text-blue-400">Ростелеком</div>
                  <div className="text-2xl font-bold">70%</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Задачи, данные, финансирование</p>
            </div>
            
            <div className="glass rounded-xl p-4 w-56">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="font-semibold text-purple-400">Политех</div>
                  <div className="text-2xl font-bold">30%</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Кадры, наука, гранты</p>
            </div>
          </div>

          {/* Arrows down */}
          <div className="flex justify-center gap-32 mb-4">
            <div className="flex flex-col items-center text-blue-400">
              <ArrowDown size={24} />
              <ArrowUp size={24} className="opacity-50" />
            </div>
            <div className="flex flex-col items-center text-purple-400">
              <ArrowDown size={24} />
              <ArrowUp size={24} className="opacity-50" />
            </div>
          </div>

          {/* Steering Committee */}
          <div className="glass rounded-2xl p-6 mb-6 border-2 border-amber-500/30 max-w-3xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg">Управляющий комитет</div>
                  <div className="text-sm text-slate-400">70/30 • Решения и приоритеты</div>
                </div>
              </div>
              
              <div className="flex gap-4 text-sm">
                <div className="px-3 py-1 rounded-lg bg-slate-800">
                  <span className="text-amber-400">→</span> Приоритеты
                </div>
                <div className="px-3 py-1 rounded-lg bg-slate-800">
                  <span className="text-amber-400">→</span> Бюджет
                </div>
                <div className="px-3 py-1 rounded-lg bg-slate-800">
                  <span className="text-amber-400">→</span> IP
                </div>
              </div>
            </div>
          </div>

          {/* Arrows to labs */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-amber-400">↓ Задачи + бюджет</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400">↑ Результаты</span>
            </div>
          </div>

          {/* Labs */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Brain, title: 'Лаборатория ИИ', subtitle: 'Фабрика инструментов', color: 'emerald' },
              { icon: Monitor, title: 'Лаборатория ПО', subtitle: 'Быстрые прототипы', color: 'blue' },
              { icon: Bot, title: 'Лаб. Робототехники', subtitle: 'Железо + интеллект', color: 'purple' },
            ].map((lab, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3 }}
                className={`glass rounded-xl p-4 border border-${lab.color}-500/30`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <lab.icon className={`w-6 h-6 text-${lab.color}-400`} />
                  <div>
                    <div className="font-semibold text-sm">{lab.title}</div>
                    <div className={`text-xs text-${lab.color}-400`}>{lab.subtitle}</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </div>
              </motion.div>
            ))}
          </div>

          {/* Flow diagram */}
          <div className="glass rounded-2xl p-6 mb-8">
            <h4 className="text-center font-semibold mb-6">Потоки между лабораториями</h4>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800">
                <span className="text-emerald-400 font-semibold">ИИ</span>
                <ArrowRight className="text-yellow-400" size={16} />
                <span className="text-slate-400">модули</span>
                <ArrowRight className="text-yellow-400" size={16} />
                <span className="text-blue-400 font-semibold">ПО + Роботы</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800">
                <span className="text-blue-400 font-semibold">ПО/Роботы</span>
                <ArrowRight className="text-orange-400" size={16} />
                <span className="text-slate-400">запросы</span>
                <ArrowRight className="text-orange-400" size={16} />
                <span className="text-emerald-400 font-semibold">ИИ</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800">
                <span className="text-blue-400 font-semibold">ПО</span>
                <ArrowRight className="text-cyan-400" size={16} />
                <span className="text-slate-400">edge-модели</span>
                <ArrowRight className="text-cyan-400" size={16} />
                <span className="text-purple-400 font-semibold">Роботы</span>
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-yellow-500/10 rounded-2xl p-6 border border-emerald-500/20">
            <h4 className="text-center text-emerald-400 font-semibold mb-6 flex items-center justify-center gap-2">
              <Package className="w-5 h-5" /> Выходы экосистемы
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { icon: Wrench, title: 'Модули', desc: 'OSS + Premium', color: 'emerald', path: '/outputs/modules' },
                { icon: Bot, title: 'Роботы', desc: 'Прототипы', color: 'purple', path: '/outputs/robots' },
                { icon: Briefcase, title: 'ПО', desc: 'SaaS', color: 'blue', path: '/outputs/software' },
                { icon: GraduationCap, title: 'Кадры', desc: '→ РТК', color: 'amber', path: '/outputs/talents' },
                { icon: FileText, title: 'IP', desc: 'Патенты', color: 'cyan', path: '/outputs/ip' },
              ].map((item) => (
                <Link key={item.title} to={item.path}>
                  <div className="glass rounded-xl p-4 text-center hover:border-emerald-500/30 transition-all cursor-pointer hover:scale-105">
                    <item.icon className={`w-6 h-6 mx-auto mb-2 text-${item.color}-400`} />
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs text-yellow-400">{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
