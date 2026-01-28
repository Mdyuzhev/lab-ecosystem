import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Wrench, Code, FileJson, Cog, Zap, Check, Lock, Unlock } from 'lucide-react'
import OutputsNavigation from '../../components/OutputsNavigation'

export default function Modules() {
  const moduleTypes = [
    { icon: FileJson, title: 'Парсеры и валидаторы', desc: 'JSON Schema, OpenAPI, XML — проверка и преобразование данных' },
    { icon: Code, title: 'Генераторы кода', desc: 'Тесты, документация, API-клиенты из спецификаций' },
    { icon: Cog, title: 'Трансформеры данных', desc: 'ETL, форматирование, нормализация, конвертация' },
    { icon: Zap, title: 'Расчётные модули', desc: 'Формулы, алгоритмы, оптимизация, статистика' },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <Link to="/#ecosystem" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span>Назад к экосистеме</span>
          </Link>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Wrench className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Библиотека модулей</h1>
              <p className="text-xl text-emerald-400">OSS + Premium</p>
            </div>
          </div>
        </div>
      </section>

      {/* Описание */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="glass rounded-2xl p-8 border border-emerald-500/20">
            <p className="text-lg text-slate-300 leading-relaxed">
              Детерминированные, переиспользуемые модули, созданные ИИ-лабораторией.
              <span className="text-emerald-400 font-semibold"> Один раз разработано — бесконечно используется.</span>
              Каждый модуль проходит верификацию и работает без ошибок, в отличие от прямых вызовов LLM.
            </p>
          </div>
        </div>
      </section>

      {/* Типы модулей */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Типы модулей</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {moduleTypes.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 hover:border-emerald-500/30 transition-colors"
              >
                <item.icon className="text-emerald-400 mb-4" size={28} />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Модель распространения */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Модель распространения</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-xl p-6 border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Unlock className="text-emerald-400" size={24} />
                <h3 className="text-xl font-semibold text-emerald-400">Open Source</h3>
              </div>
              <p className="text-slate-300 mb-4">Базовые модули с MIT лицензией</p>
              <ul className="space-y-2">
                {['Парсеры стандартных форматов', 'Валидаторы общего назначения', 'Утилиты и хелперы'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-400">
                    <Check className="text-emerald-400" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-yellow-400" size={24} />
                <h3 className="text-xl font-semibold text-yellow-400">Premium</h3>
              </div>
              <p className="text-slate-300 mb-4">Специализированные модули для телекома, по подписке</p>
              <ul className="space-y-2">
                {['Интеграция с системами РТК', 'Специфичные протоколы', 'Приоритетная поддержка'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-400">
                    <Check className="text-yellow-400" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Метрики */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Метрики</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { value: '50+', label: 'модулей в год', desc: 'Новые модули по запросам команд' },
              { value: '9000', label: 'операций/сек', desc: 'Производительность модулей' },
              { value: '0', label: 'ошибок после верификации', desc: 'Детерминированная работа' },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">{item.value}</div>
                <div className="font-semibold mb-1">{item.label}</div>
                <div className="text-sm text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Навигация по выходам */}
      <OutputsNavigation currentId="modules" />

      {/* Источник */}
      <section className="py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500">
            Создаётся в{' '}
            <Link to="/labs/ai" className="text-emerald-400 hover:underline">
              Лаборатории ИИ
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
