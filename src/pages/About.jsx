import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Target, Lightbulb, Rocket, Users } from 'lucide-react'
import aiFactoryImg from '../pic/KQyV_HVR31gHY0Pbvx0x7.png'

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: Target,
      title: 'Фокус на результат',
      description: 'Каждый проект нацелен на конкретный бизнес-результат с измеримым ROI',
      color: 'emerald'
    },
    {
      icon: Lightbulb,
      title: 'Фабрика инструментов',
      description: 'LLM создаёт детерминированные модули, которые работают быстро и предсказуемо',
      color: 'amber'
    },
    {
      icon: Rocket,
      title: 'Масштабируемость',
      description: 'Платформа легко расширяется — новые лаборатории подключаются как модули',
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Синергия партнёров',
      description: 'Индустриальная экспертиза РТК + научный потенциал Политеха',
      color: 'blue'
    },
  ]

  const colorMap = {
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
  }

  const bgColorMap = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20',
    amber: 'bg-amber-500/10 border-amber-500/20',
    purple: 'bg-purple-500/10 border-purple-500/20',
    blue: 'bg-blue-500/10 border-blue-500/20',
  }

  return (
    <section id="about" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-slate-900" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <span className="text-emerald-400 text-sm font-medium">О проекте</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Новая модель{' '}
            <span className="gradient-text from-emerald-400 to-cyan-400">R&D партнёрства</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Мы создаём экосистему, где искусственный интеллект становится фабрикой инструментов, 
            а не просто исполнителем задач. Один созданный модуль экономит тысячи человеко-часов.
          </p>
        </motion.div>

        {/* Main concept */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-3xl p-8 md:p-12 mb-16"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-6">
                Ключевая идея:{' '}
                <span className="gradient-text from-amber-400 to-orange-400">
                  LLM создаёт инструменты
                </span>
              </h3>
              <p className="text-slate-400 mb-6">
                Мощный ИИ не должен решать типовые задачи — он должен создавать инструменты 
                для их решения. Все расчёты выполняются детерминированно, но эти инструменты 
                человек может создавать годами, а LLM — за часы.
              </p>
              <div className="space-y-4">
                {[
                  'LLM генерирует код модуля за часы вместо недель',
                  'Модули работают детерминированно — без галлюцинаций',
                  'Один модуль переиспользуется всеми лабораториями',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-sm">✓</span>
                    </div>
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* AI Factory illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
              <img
                src={aiFactoryImg}
                alt="ИИ как фабрика инструментов — Claude/GPT создаёт модули для бесконечного использования"
                className="relative w-full rounded-2xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`rounded-2xl p-6 border ${bgColorMap[feature.color]}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[feature.color]} flex items-center justify-center mb-4`}>
                <feature.icon className="text-white" size={24} />
              </div>
              <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
