import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, GraduationCap, Users, Briefcase, Award, ArrowDown } from 'lucide-react'
import OutputsNavigation from '../../components/OutputsNavigation'

export default function Talents() {
  const program = [
    { icon: Users, title: 'Стажировка в лабораториях', desc: 'Начиная со 2 курса, работа в реальных командах' },
    { icon: Briefcase, title: 'Реальные задачи', desc: 'Не учебные проекты, а production-код и исследования' },
    { icon: Award, title: 'Менторство', desc: 'Обучение от специалистов Ростелекома' },
    { icon: GraduationCap, title: 'Защита диплома', desc: 'На материалах лаборатории, готовые кейсы' },
  ]

  const funnel = [
    { stage: 'Вход', count: '20-30', desc: 'студентов/год', color: 'slate' },
    { stage: 'Стажёры', count: '15-20', desc: 'активных', color: 'amber' },
    { stage: 'Джуниоры', count: '10-15', desc: 'готовых к работе', color: 'yellow' },
    { stage: 'Найм в РТК', count: '5-10', desc: 'человек/год', color: 'green' },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <Link to="/#ecosystem" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span>Назад к экосистеме</span>
          </Link>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <GraduationCap className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Подготовка кадров</h1>
              <p className="text-xl text-amber-400">Воронка талантов - РТК</p>
            </div>
          </div>
        </div>
      </section>

      {/* Описание */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="glass rounded-2xl p-8 border border-amber-500/20">
            <p className="text-lg text-slate-300 leading-relaxed">
              Студенты работают на реальных проектах и после выпуска готовы к работе в Ростелекоме
              <span className="text-amber-400 font-semibold"> без дополнительного обучения.</span>
              Это сокращает время адаптации до нуля и гарантирует качество кадров.
            </p>
          </div>
        </div>
      </section>

      {/* Программа */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Программа подготовки</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {program.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 hover:border-amber-500/30 transition-colors"
              >
                <item.icon className="text-amber-400 mb-4" size={28} />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Воронка */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Воронка талантов</h2>

          <div className="glass rounded-2xl p-8">
            <div className="flex flex-col items-center gap-4">
              {funnel.map((item, i) => (
                <div key={item.stage} className="flex flex-col items-center">
                  <div className={`px-8 py-4 rounded-xl bg-${item.color}-500/20 border border-${item.color}-500/30 text-center`}
                       style={{ width: `${280 - i * 40}px` }}>
                    <div className={`text-2xl font-bold text-${item.color}-400`}>{item.count}</div>
                    <div className="font-semibold">{item.stage}</div>
                    <div className="text-sm text-slate-400">{item.desc}</div>
                  </div>
                  {i < funnel.length - 1 && (
                    <ArrowDown className="text-amber-400 my-2" size={24} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Метрики */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Метрики</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { value: '80%', label: 'трудоустройство', desc: 'Выпускников программы находят работу в IT' },
              { value: '0', label: 'месяцев на адаптацию', desc: 'Готовы к работе сразу после выпуска' },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-amber-400 mb-2">{item.value}</div>
                <div className="font-semibold mb-1">{item.label}</div>
                <div className="text-sm text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Навигация по выходам */}
      <OutputsNavigation currentId="talents" />

      {/* Источник */}
      <section className="py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500">
            Подготовка кадров во всех лабораториях экосистемы
          </p>
        </div>
      </section>
    </div>
  )
}
