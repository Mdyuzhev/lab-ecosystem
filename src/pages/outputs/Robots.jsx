import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Bot, Server, Eye, Package, Users, ArrowRight } from 'lucide-react'
import OutputsNavigation from '../../components/OutputsNavigation'

export default function Robots() {
  const directions = [
    { icon: Server, title: 'Манипуляторы для дата-центров', desc: 'Замена кабелей, обслуживание серверов, диагностика оборудования' },
    { icon: Eye, title: 'Инспекционные роботы', desc: 'Обход территорий, мониторинг, визуальная диагностика' },
    { icon: Package, title: 'Логистические системы', desc: 'Автоматизация складов, сортировка, перемещение грузов' },
    { icon: Users, title: 'Коллаборативные роботы', desc: 'Безопасная работа рядом с людьми, совместные операции' },
  ]

  const process = ['Концепт', 'CAD', 'Симуляция', 'Прототип', 'Пилот', 'Серия']

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <Link to="/#ecosystem" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span>Назад к экосистеме</span>
          </Link>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Bot className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Роботы и прототипы</h1>
              <p className="text-xl text-purple-400">От идеи до пилота</p>
            </div>
          </div>
        </div>
      </section>

      {/* Описание */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="glass rounded-2xl p-8 border border-purple-500/20">
            <p className="text-lg text-slate-300 leading-relaxed">
              Физические прототипы роботизированных систем для производственных задач Ростелекома и партнёров.
              <span className="text-purple-400 font-semibold"> Полный цикл от концепта до пилотного внедрения</span>
              с использованием ИИ-модулей для интеллектуальных функций.
            </p>
          </div>
        </div>
      </section>

      {/* Направления */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Направления</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {directions.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 hover:border-purple-500/30 transition-colors"
              >
                <item.icon className="text-purple-400 mb-4" size={28} />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Процесс */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Процесс разработки</h2>

          <div className="glass rounded-2xl p-8">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {process.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                    {step}
                  </div>
                  {i < process.length - 1 && (
                    <ArrowRight className="text-purple-400" size={20} />
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
              { value: '3-5', label: 'прототипов в год', desc: 'Полный цикл от идеи до рабочего образца' },
              { value: '2-3', label: 'пилота на производстве', desc: 'Внедрение на реальных объектах РТК' },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">{item.value}</div>
                <div className="font-semibold mb-1">{item.label}</div>
                <div className="text-sm text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Навигация по выходам */}
      <OutputsNavigation currentId="robots" />

      {/* Источник */}
      <section className="py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500">
            Создаётся в{' '}
            <Link to="/labs/robotics" className="text-purple-400 hover:underline">
              Лаборатории Робототехники
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
