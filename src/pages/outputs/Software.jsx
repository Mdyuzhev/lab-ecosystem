import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Briefcase, Cog, Cloud, Plug, BarChart3, ArrowRight } from 'lucide-react'

export default function Software() {
  const productTypes = [
    { icon: Cog, title: 'Внутренние инструменты', desc: 'Автоматизация процессов Ростелекома, dashboards, утилиты' },
    { icon: Cloud, title: 'SaaS-платформы', desc: 'B2B сервисы для рынка, подписочные продукты' },
    { icon: Plug, title: 'API и интеграции', desc: 'Связь между системами, коннекторы, middleware' },
    { icon: BarChart3, title: 'Data-продукты', desc: 'Аналитика, дашборды, ML-пайплайны, BI-решения' },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <Link to="/#ecosystem" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span>Назад к экосистеме</span>
          </Link>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Briefcase className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Программные продукты</h1>
              <p className="text-xl text-blue-400">SaaS и On-premise</p>
            </div>
          </div>
        </div>
      </section>

      {/* Описание */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="glass rounded-2xl p-8 border border-blue-500/20">
            <p className="text-lg text-slate-300 leading-relaxed">
              Production-ready решения для бизнес-задач: от внутренних инструментов до коммерческих SaaS-продуктов.
              <span className="text-blue-400 font-semibold"> Быстрый цикл от идеи до внедрения</span>
              благодаря переиспользованию модулей из ИИ-лаборатории.
            </p>
          </div>
        </div>
      </section>

      {/* Типы продуктов */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Типы продуктов</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {productTypes.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 hover:border-blue-500/30 transition-colors"
              >
                <item.icon className="text-blue-400 mb-4" size={28} />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Цикл разработки */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Цикл разработки</h2>

          <div className="glass rounded-2xl p-8">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {['MVP за 2-4 месяца', 'Пилот', 'Production'].map((step, i) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="px-6 py-3 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                    {step}
                  </div>
                  {i < 2 && (
                    <ArrowRight className="text-blue-400" size={24} />
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
              { value: '5-10', label: 'MVP в год', desc: 'Быстрые прототипы для валидации идей' },
              { value: '20-50', label: 'млн руб. экономии', desc: 'От внедрений и автоматизации процессов' },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{item.value}</div>
                <div className="font-semibold mb-1">{item.label}</div>
                <div className="text-sm text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Связь с лабораторией */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Источник</h2>
          <p className="text-slate-400 mb-8">
            Программные продукты создаются Лабораторией ПО с использованием модулей ИИ-лаборатории.
          </p>
          <Link to="/labs/software" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors inline-block">
            Лаборатория ПО
          </Link>
        </div>
      </section>
    </div>
  )
}
