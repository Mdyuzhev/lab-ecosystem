import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calendar, CheckCircle, Circle, ArrowRight } from 'lucide-react'

export default function Roadmap() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const phases = [
    {
      year: '2026',
      quarter: 'Q1-Q2',
      title: 'Запуск Wave 1',
      status: 'upcoming',
      items: [
        'Формирование команд',
        'Закупка оборудования',
        'Настройка инфраструктуры',
        'Первые исследовательские проекты',
      ],
      color: 'emerald'
    },
    {
      year: '2026',
      quarter: 'Q3-Q4',
      title: 'Первые результаты',
      status: 'upcoming',
      items: [
        'MVP от лаборатории ПО',
        'Прототип робота',
        '10+ модулей в библиотеке',
        'Первые внедрения в РТК',
      ],
      color: 'blue'
    },
    {
      year: '2027',
      quarter: 'Q1-Q2',
      title: 'Масштабирование',
      status: 'future',
      items: [
        'Расширение команд',
        'Подготовка Wave 2',
        'Публикации и патенты',
        'Привлечение грантов',
      ],
      color: 'purple'
    },
    {
      year: '2027-28',
      quarter: 'Q3+',
      title: 'Wave 2',
      status: 'future',
      items: [
        'Лаборатория Биотехнологий',
        'Лаборатория Химпрома',
        'Выход на внешний рынок',
        'Окупаемость проекта',
      ],
      color: 'cyan'
    },
  ]

  const milestones = [
    { date: 'Март 2026', event: 'Подписание соглашения', done: false },
    { date: 'Июнь 2026', event: 'Команды укомплектованы', done: false },
    { date: 'Сентябрь 2026', event: 'Первый MVP', done: false },
    { date: 'Декабрь 2026', event: 'Первое внедрение в РТК', done: false },
    { date: 'Июнь 2027', event: '50 модулей в библиотеке', done: false },
    { date: 'Декабрь 2027', event: 'Запуск Wave 2', done: false },
    { date: '2028', event: 'Выход на окупаемость', done: false },
  ]

  const colorClasses = {
    emerald: 'from-emerald-500 to-emerald-600 border-emerald-500/30 bg-emerald-500/10',
    blue: 'from-blue-500 to-blue-600 border-blue-500/30 bg-blue-500/10',
    purple: 'from-purple-500 to-purple-600 border-purple-500/30 bg-purple-500/10',
    cyan: 'from-cyan-500 to-cyan-600 border-cyan-500/30 bg-cyan-500/10',
  }

  return (
    <section id="roadmap" className="relative py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-slate-900" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      {/* Background glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <Calendar className="text-cyan-400" size={16} />
            <span className="text-cyan-400 text-sm font-medium">Roadmap</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            План{' '}
            <span className="gradient-text from-cyan-400 to-blue-400">развития</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Поэтапное развитие экосистемы: от запуска первых лабораторий 
            до полноценной платформы с пятью направлениями
          </p>
        </motion.div>

        {/* Timeline phases */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {phases.map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className={`relative glass rounded-2xl p-6 border ${colorClasses[phase.color].split(' ').slice(2).join(' ')}`}
            >
              {/* Connector line */}
              {i < phases.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-slate-600 to-transparent z-10">
                  <ArrowRight className="absolute -right-1 -top-2 text-slate-600" size={16} />
                </div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold">{phase.year}</div>
                  <div className="text-sm text-slate-400">{phase.quarter}</div>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[phase.color].split(' ').slice(0, 2).join(' ')} flex items-center justify-center`}>
                  <span className="text-white font-bold">{i + 1}</span>
                </div>
              </div>

              <h4 className="font-semibold text-lg mb-4">{phase.title}</h4>

              <ul className="space-y-2">
                {phase.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                    <CheckCircle className={`flex-shrink-0 mt-0.5 ${phase.status === 'upcoming' ? 'text-slate-600' : 'text-slate-700'}`} size={14} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Status badge */}
              <div className={`mt-4 inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                phase.status === 'upcoming' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
              }`}>
                <Circle className={`${phase.status === 'upcoming' ? 'fill-emerald-400 text-emerald-400' : ''}`} size={8} />
                {phase.status === 'upcoming' ? 'Ближайший этап' : 'Планируется'}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <h4 className="font-semibold text-lg mb-6 text-center">Ключевые вехи</h4>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-blue-500 to-cyan-500 md:hidden" />
            <div className="hidden md:block absolute top-4 left-0 right-0 h-px bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500" />

            <div className="grid md:grid-cols-7 gap-4 md:gap-2">
              {milestones.map((milestone, i) => (
                <div key={i} className="relative pl-10 md:pl-0 md:text-center">
                  {/* Dot */}
                  <div className={`absolute left-2 top-1 md:left-1/2 md:-translate-x-1/2 md:top-0 w-5 h-5 rounded-full border-2 ${
                    milestone.done 
                      ? 'bg-emerald-500 border-emerald-400' 
                      : 'bg-slate-800 border-slate-600'
                  }`}>
                    {milestone.done && <CheckCircle className="text-white w-full h-full p-0.5" />}
                  </div>
                  
                  <div className="md:pt-8">
                    <div className="text-xs text-slate-500 mb-1">{milestone.date}</div>
                    <div className="text-sm text-slate-300">{milestone.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
