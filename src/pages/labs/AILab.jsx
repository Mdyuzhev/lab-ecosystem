import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Cpu, Sparkles, Code, BookOpen, Lightbulb, Target, Users, Zap, Calculator, ArrowRight, Database } from 'lucide-react'

export default function AILab() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <Link to="/#labs" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span>Назад к лабораториям</span>
          </Link>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Cpu className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Лаборатория ИИ</h1>
              <p className="text-xl text-emerald-400">«Фабрика инструментов»</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <span className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
              РТК: 1 Tech Lead
            </span>
            <span className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
              ВУЗ: 1 Научрук + 3 студента
            </span>
          </div>
        </div>
      </section>

      {/* Миссия */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="glass rounded-2xl p-8 border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-6">
              <Target className="text-emerald-400" size={24} />
              <h2 className="text-2xl font-bold">Миссия</h2>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed">
              Лаборатория ИИ — это центральный узел экосистемы, который исследует возможности
              современных AI-моделей и превращает их в <span className="text-emerald-400 font-semibold">детерминированные,
              переиспользуемые инструменты</span>. Мы не решаем бизнес-задачи напрямую — мы создаём
              модули, которые позволяют решать тысячи подобных задач быстро, бесплатно и без ошибок.
            </p>
          </div>
        </div>
      </section>

      {/* Философия */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Lightbulb className="text-yellow-400" size={24} />
            <h2 className="text-2xl font-bold">Философия: ИИ создаёт инструменты</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Традиционный подход</h3>
              <p className="text-slate-400 mb-4">
                Каждая задача = вызов LLM = оплата токенов = результат с возможными ошибками
              </p>
              <div className="text-sm text-slate-500">
                1000 задач = 1000 вызовов API = линейные затраты
              </div>
            </div>

            <div className="glass rounded-xl p-6 border border-emerald-500/30">
              <h3 className="text-lg font-semibold text-emerald-400 mb-4">Наш подход</h3>
              <p className="text-slate-300 mb-4">
                LLM создаёт модуль = модуль верифицируется = модуль решает задачи детерминированно
              </p>
              <div className="text-sm text-emerald-400">
                1 вызов на создание + бесконечное использование бесплатно
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Направления */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-emerald-400" size={24} />
            <h2 className="text-2xl font-bold">Направления исследований</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Cost Optimization', desc: 'Исследование дешёвых моделей (Qwen, Mistral) для замены дорогих (Claude, GPT-4)', icon: Zap },
              { title: 'Prompt Engineering', desc: 'Библиотека промптов и шаблонов для генерации кода и документации', icon: Code },
              { title: 'Knowledge Distillation', desc: 'Перенос знаний из больших моделей в компактные для edge-устройств', icon: BookOpen },
              { title: 'Synthetic Data', desc: 'Генерация обучающих данных для fine-tuning специализированных моделей', icon: Sparkles },
              { title: 'Verification', desc: 'Методы проверки корректности сгенерированного кода и документов', icon: Target },
              { title: 'Agent Workflows', desc: 'Оркестрация AI-агентов для сложных многошаговых задач', icon: Users },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 hover:border-emerald-500/30 transition-colors"
              >
                <item.icon className="text-emerald-400 mb-4" size={24} />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Выходы */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Что создаёт лаборатория</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: 'Модули', desc: 'Детерминированные библиотеки для типовых задач', value: '50+' },
              { title: 'Промпты', desc: 'Шаблоны для генерации кода и документов', value: '100+' },
              { title: 'Методики', desc: 'Best practices работы с AI', value: '20+' },
              { title: 'Публикации', desc: 'Научные статьи и патенты', value: '5+/год' },
            ].map((item) => (
              <div key={item.title} className="glass rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">{item.value}</div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-sm text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Прототипы инструментов */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">Попробуйте прототипы инструментов</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-8 border border-emerald-500/20">
              <div className="flex items-center gap-4 mb-4">
                <Calculator className="text-emerald-400" size={24} />
                <h3 className="text-lg font-bold">Калькулятор ударных нагрузок</h3>
              </div>
              <p className="text-slate-400 mb-4">
                Детерминированный инструмент — работает мгновенно, без ИИ, без ошибок.
              </p>
              <Link
                to="/tools/impact-calculator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors"
              >
                Открыть калькулятор <ArrowRight size={16} />
              </Link>
            </div>
            <div className="glass rounded-2xl p-8 border border-blue-500/20">
              <div className="flex items-center gap-4 mb-4">
                <Database className="text-blue-400" size={24} />
                <h3 className="text-lg font-bold">Сверка данных</h3>
              </div>
              <p className="text-slate-400 mb-4">
                Загрузите два CSV — получите отчёт с расхождениями. Всё в браузере.
              </p>
              <Link
                to="/tools/data-reconciliation"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors"
              >
                Открыть сверку <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Взаимодействие с другими лабораториями</h2>
          <p className="text-slate-400 mb-8">
            Лаборатория ИИ получает запросы на инструменты от лабораторий ПО и Робототехники,
            создаёт модули и передаёт их для использования в реальных проектах.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/labs/software" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors">
              Лаборатория ПО
            </Link>
            <Link to="/labs/robotics" className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition-colors">
              Робототехника
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
