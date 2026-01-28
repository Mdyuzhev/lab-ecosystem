import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, Shield, BookOpen, Lock, Scale, Check } from 'lucide-react'
import OutputsNavigation from '../../components/OutputsNavigation'

export default function IP() {
  const ipTypes = [
    { icon: Shield, title: 'Патенты на изобретения', desc: 'Конструкции роботов, алгоритмы, технические решения' },
    { icon: FileText, title: 'Свидетельства на ПО', desc: 'Официальная регистрация программных продуктов' },
    { icon: BookOpen, title: 'Научные публикации', desc: 'Scopus, ВАК, международные конференции' },
    { icon: Lock, title: 'Trade secrets', desc: 'Внутренние методики, know-how, документация' },
  ]

  const rights = [
    'Совместное владение РТК + ВУЗ',
    'Условия определяет Управляющий комитет',
    'Роялти при коммерциализации',
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <Link to="/#ecosystem" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span>Назад к экосистеме</span>
          </Link>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
              <FileText className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Интеллектуальная собственность</h1>
              <p className="text-xl text-cyan-400">Патенты и публикации</p>
            </div>
          </div>
        </div>
      </section>

      {/* Описание */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="glass rounded-2xl p-8 border border-cyan-500/20">
            <p className="text-lg text-slate-300 leading-relaxed">
              Результаты исследований оформляются как патенты, научные публикации и know-how
              <span className="text-cyan-400 font-semibold"> для защиты и монетизации.</span>
              Это создаёт долгосрочную ценность и защищает инвестиции в R&D.
            </p>
          </div>
        </div>
      </section>

      {/* Типы IP */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Типы интеллектуальной собственности</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {ipTypes.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 hover:border-cyan-500/30 transition-colors"
              >
                <item.icon className="text-cyan-400 mb-4" size={28} />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Распределение прав */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Распределение прав</h2>

          <div className="glass rounded-2xl p-8 border border-cyan-500/30">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="text-cyan-400" size={24} />
              <h3 className="text-xl font-semibold">Модель совладения</h3>
            </div>
            <ul className="space-y-4">
              {rights.map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-300">
                  <Check className="text-cyan-400 flex-shrink-0" size={20} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Метрики */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Метрики</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { value: '3-5', label: 'патентов/год', desc: 'Защита ключевых технологий' },
              { value: '10+', label: 'публикаций/год', desc: 'Научные статьи и конференции' },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">{item.value}</div>
                <div className="font-semibold mb-1">{item.label}</div>
                <div className="text-sm text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Навигация по выходам */}
      <OutputsNavigation currentId="ip" />

      {/* Источник */}
      <section className="py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500">
            IP создаётся во всех лабораториях экосистемы
          </p>
        </div>
      </section>
    </div>
  )
}
