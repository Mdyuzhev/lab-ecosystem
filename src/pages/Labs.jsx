import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Cpu, Code, Bot, FlaskConical, Atom, ArrowRight, DollarSign, Plug } from 'lucide-react'

export default function Labs() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeLab, setActiveLab] = useState(null)

  const activeLabs = [
    {
      id: 'ai',
      icon: Cpu,
      title: 'Лаборатория ИИ',
      subtitle: '«Фабрика инструментов»',
      color: 'emerald',
      team: { rt: '1 Tech Lead', uni: '1 Научрук + 3 студента' },
      description: 'Исследует и создаёт детерминированные модули, библиотеки и методики, которые используют все остальные лаборатории.',
      outputs: ['Библиотека модулей', 'Prompt templates', 'Best practices', 'Научные публикации'],
      money: ['Лицензирование модулей → 5-15 млн₽/год', 'Гранты на исследования → 3-8 млн₽/год']
    },
    {
      id: 'software',
      icon: Code,
      title: 'Лаборатория ПО',
      subtitle: '«Быстрые прототипы»',
      color: 'blue',
      team: { rt: '2 Tech Lead', uni: '2 Научрука + 6 студентов' },
      description: 'Создаёт MVP и production-ready решения для бизнес-задач Ростелекома, используя инструменты от ИИ-лаборатории.',
      outputs: ['MVP за 2-4 месяца', 'SaaS-продукты', 'Внутренние инструменты', 'API-интеграции'],
      money: ['Экономия РТ от внедрений → 20-50 млн₽/год', 'Spin-off продукты → от 10 млн₽/год']
    },
    {
      id: 'robotics',
      icon: Bot,
      title: 'Лаборатория Робототехники',
      subtitle: '«Железо + интеллект»',
      color: 'purple',
      team: { rt: '1 Tech Lead + 1 инженер', uni: '1 Научрук + 4 студента' },
      description: 'Создаёт прототипы роботов для производственных задач, интегрируя CV и edge AI от ИИ-лаборатории.',
      outputs: ['Прототипы манипуляторов', 'Edge AI модели', 'CAD-библиотеки', 'Патенты'],
      money: ['Пилотные контракты → 10-30 млн₽', 'Лицензии на патенты']
    },
  ]

  const futureLabs = [
    {
      id: 'biotech',
      icon: FlaskConical,
      title: 'Биотехнологии',
      subtitle: 'Wave 2 • 2027+',
      color: 'cyan',
      potential: ['Биосенсоры + CV диагностика', 'Анализ медицинских изображений', 'Фарма R&D автоматизация'],
    },
    {
      id: 'chemistry',
      icon: Atom,
      title: 'Химическая промышленность',
      subtitle: 'Wave 2 • 2028+',
      color: 'orange',
      potential: ['Контроль качества производства', 'Предиктивное обслуживание', 'Оптимизация процессов'],
    },
  ]

  const colorClasses = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', gradient: 'from-emerald-500 to-emerald-600' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', gradient: 'from-blue-500 to-blue-600' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', gradient: 'from-purple-500 to-purple-600' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', gradient: 'from-cyan-500 to-cyan-600' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', gradient: 'from-orange-500 to-orange-600' },
  }

  return (
    <section id="labs" className="relative py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <span className="text-purple-400 text-sm font-medium">Лаборатории</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Три направления,{' '}
            <span className="gradient-text from-purple-400 to-pink-400">одна цель</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Каждая лаборатория специализируется на своей области, но все они используют 
            общую инфраструктуру и инструменты от ИИ-фабрики
          </p>
        </motion.div>

        {/* Active Labs */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {activeLabs.map((lab, i) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => setActiveLab(activeLab === lab.id ? null : lab.id)}
              className={`relative rounded-2xl p-6 border cursor-pointer transition-all ${
                colorClasses[lab.color].bg
              } ${colorClasses[lab.color].border} ${
                activeLab === lab.id ? 'ring-2 ring-offset-2 ring-offset-slate-950 ' + colorClasses[lab.color].border : ''
              }`}
            >
              {/* Active indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-xs text-slate-400">Active</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[lab.color].gradient} flex items-center justify-center mb-4`}>
                <lab.icon className="text-white" size={28} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-1">{lab.title}</h3>
              <p className={`text-sm mb-4 ${colorClasses[lab.color].text}`}>{lab.subtitle}</p>

              {/* Team */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300">РТК: {lab.team.rt}</span>
                <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">ВУЗ: {lab.team.uni}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-400 mb-4">{lab.description}</p>

              {/* Expanded content */}
              {activeLab === lab.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-700"
                >
                  <div className="mb-4">
                    <div className="text-sm font-semibold mb-2">Выходы:</div>
                    <div className="flex flex-wrap gap-2">
                      {lab.outputs.map((output, j) => (
                        <span key={j} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300">
                          {output}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-semibold mb-2 text-yellow-400 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> Монетизация:
                    </div>
                    <ul className="text-sm text-slate-400 space-y-1">
                      {lab.money.map((item, j) => (
                        <li key={j}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    to={`/labs/${lab.id}`}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${colorClasses[lab.color].bg} ${colorClasses[lab.color].text} hover:opacity-80 transition-opacity`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Открыть страницу</span>
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              )}

              {/* Expand hint */}
              <div className={`flex items-center gap-1 text-sm ${colorClasses[lab.color].text} ${activeLab === lab.id ? 'hidden' : ''}`}>
                <span>Подробнее</span>
                <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Future Labs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-500/30" />
            <span className="text-cyan-400 text-sm font-medium px-4">Roadmap расширения</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-500/30" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {futureLabs.map((lab, i) => (
              <motion.div
                key={lab.id}
                whileHover={{ scale: 1.02 }}
                className={`rounded-2xl p-6 border-2 border-dashed ${colorClasses[lab.color].border} ${colorClasses[lab.color].bg} opacity-80`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[lab.color].gradient} flex items-center justify-center opacity-70`}>
                    <lab.icon className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold">{lab.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded ${colorClasses[lab.color].bg} ${colorClasses[lab.color].text}`}>
                        {lab.subtitle}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">Потенциальные направления:</p>
                    <ul className="text-sm text-slate-500 space-y-1">
                      {lab.potential.map((item, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <span className={colorClasses[lab.color].text}>○</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Platform note */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <Plug className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 text-sm">
                Plug & Play: новые лабы подключаются к готовой инфраструктуре
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
