import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Code, Globe, Database, Plug, TestTube, Server, Target, Rocket, FileSearch, Brain, Workflow, Layers } from 'lucide-react'

export default function SoftwareLab() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <Link to="/#labs" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span>Назад к лабораториям</span>
          </Link>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Code className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Лаборатория ПО</h1>
              <p className="text-xl text-blue-400">«Быстрые прототипы»</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <span className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
              РТК: 2 Tech Lead
            </span>
            <span className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
              ВУЗ: 2 Научрука + 6 студентов
            </span>
          </div>
        </div>
      </section>

      {/* Миссия */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="glass rounded-2xl p-8 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-6">
              <Target className="text-blue-400" size={24} />
              <h2 className="text-2xl font-bold">Миссия</h2>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed">
              Лаборатория ПО — это <span className="text-blue-400 font-semibold">точка соприкосновения технологий
              и бизнеса</span>. Мы берём инструменты от ИИ-лаборатории и превращаем их в работающие
              продукты: MVP за 2-4 месяца, SaaS-решения, внутренние инструменты для Ростелекома.
            </p>
          </div>
        </div>
      </section>

      {/* Подход */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Rocket className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold">Подход: от идеи до production</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Discovery', desc: 'Анализ задачи, выбор технологий', duration: '1-2 нед' },
              { step: '2', title: 'Prototype', desc: 'Быстрый прототип с AI-модулями', duration: '2-4 нед' },
              { step: '3', title: 'MVP', desc: 'Работающий продукт для тестирования', duration: '4-8 нед' },
              { step: '4', title: 'Production', desc: 'Масштабирование и поддержка', duration: 'ongoing' },
            ].map((item) => (
              <div key={item.step} className="glass rounded-xl p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 mb-2">{item.desc}</p>
                <span className="text-xs text-blue-400">{item.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Направления */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Code className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold">Направления разработки</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Web Applications', desc: 'React, Next.js, современные SPA и SSR решения', icon: Globe },
              { title: 'API Development', desc: 'REST, GraphQL, микросервисная архитектура', icon: Plug },
              { title: 'Data Pipelines', desc: 'ETL-процессы, обработка данных, аналитика', icon: Database },
              { title: 'Integrations', desc: 'Интеграция с внутренними системами РТК', icon: Server },
              { title: 'Testing & QA', desc: 'Автоматизация тестирования, CI/CD', icon: TestTube },
              { title: 'DevOps', desc: 'Kubernetes, облачная инфраструктура', icon: Server },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 hover:border-blue-500/30 transition-colors"
              >
                <item.icon className="text-blue-400 mb-4" size={24} />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Проекты лаборатории */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <Workflow className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold">Проекты лаборатории</h2>
          </div>
          <p className="text-slate-400 mb-8">
            Каждый проект проходит путь от гипотезы до работающего MVP. Детальные планы развития доступны по ссылкам.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/labs/software/reconciliation"
              className="glass rounded-xl p-6 hover:border-blue-500/30 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileSearch className="text-blue-400" size={20} />
                </div>
                <div>
                  <div className="text-xs text-blue-400 font-medium">Прототип &rarr; MVP</div>
                  <h3 className="font-semibold">Сверка данных</h3>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Платформа сверки данных из разных источников с подключаемыми модулями нормализации и AI-ассистентом.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-300">React</span>
                <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-300">Python</span>
                <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-300">LLM</span>
                <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-300">Plugin Arch</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400 text-sm group-hover:gap-2 transition-all">
                <span>Подробнее</span>
                <ArrowRight size={14} />
              </div>
            </Link>

            <Link
              to="/labs/software/dba-toolkit"
              className="glass rounded-xl p-6 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Database className="text-amber-400" size={20} />
                </div>
                <div>
                  <div className="text-xs text-amber-400 font-medium">Прототип &rarr; MVP</div>
                  <h3 className="font-semibold">DBA Toolkit</h3>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                EXPLAIN Visualizer и ERD Builder — инструменты визуализации и анализа для администраторов баз данных.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-300">SVG</span>
                <span className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-300">PostgreSQL</span>
                <span className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-300">DDL Parser</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400 text-sm group-hover:gap-2 transition-all">
                <span>Подробнее</span>
                <ArrowRight size={14} />
              </div>
            </Link>

            <Link
              to="/labs/software/ai-agents"
              className="glass rounded-xl p-6 hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Brain className="text-emerald-400" size={20} />
                </div>
                <div>
                  <div className="text-xs text-emerald-400 font-medium">Исследование &rarr; Методология</div>
                  <h3 className="font-semibold">AI-агенты для QA</h3>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Автономные агенты для автоматизации тестирования, мониторинга и DevOps-задач.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-300">LLM</span>
                <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-300">MCP</span>
                <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-300">K8s</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm group-hover:gap-2 transition-all">
                <span>Подробнее</span>
                <ArrowRight size={14} />
              </div>
            </Link>

            <Link
              to="/labs/software/product-dev"
              className="glass rounded-xl p-6 hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Layers className="text-cyan-400" size={20} />
                </div>
                <div>
                  <div className="text-xs text-cyan-400 font-medium">Гипотезы &rarr; Эксперименты</div>
                  <h3 className="font-semibold">Развитие продуктов</h3>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Реестр из 40+ гипотез по улучшению Wink, Видеонаблюдения, Умного дома и Ключа с помощью AI и аналитики.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-300">Wink</span>
                <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-300">CV</span>
                <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-300">IoT</span>
                <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-300">AI</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-400 text-sm group-hover:gap-2 transition-all">
                <span>Подробнее</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Выходы */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Что создаёт лаборатория</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: 'MVP', desc: 'Работающие прототипы за 2-4 месяца', value: '10+/год' },
              { title: 'SaaS', desc: 'Масштабируемые облачные решения', value: '3+' },
              { title: 'Инструменты', desc: 'Внутренние системы для РТК', value: '20+' },
              { title: 'Экономия', desc: 'От внедрений в год', value: '20-50M₽' },
            ].map((item) => (
              <div key={item.title} className="glass rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{item.value}</div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-sm text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Взаимодействие с экосистемой</h2>
          <p className="text-slate-400 mb-8">
            Лаборатория ПО использует модули от ИИ-лаборатории и поставляет edge-модели
            для Робототехники. Все продукты проходят через управляющий комитет.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/labs/ai" className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors">
              Лаборатория ИИ
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
