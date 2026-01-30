import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Bot, Eye, Cpu, Cog, Box, Gamepad2, Target, Wrench, FileText } from 'lucide-react'

export default function RoboticsLab() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <Link to="/#labs" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span>Назад к лабораториям</span>
          </Link>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Bot className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Лаборатория Робототехники</h1>
              <p className="text-xl text-purple-400">«Железо + интеллект»</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <span className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
              РТК: 1 Tech Lead + 1 инженер
            </span>
            <span className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
              ВУЗ: 1 Научрук + 4 студента
            </span>
          </div>
        </div>
      </section>

      {/* Миссия */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="glass rounded-2xl p-8 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-6">
              <Target className="text-purple-400" size={24} />
              <h2 className="text-2xl font-bold">Миссия</h2>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed">
              Лаборатория Робототехники создаёт <span className="text-purple-400 font-semibold">прототипы
              интеллектуальных роботов</span> для производственных задач Ростелекома. Мы объединяем
              механику, электронику и AI-модели в единые решения для автоматизации физических процессов.
            </p>
          </div>
        </div>
      </section>

      {/* Подход */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Wrench className="text-purple-400" size={24} />
            <h2 className="text-2xl font-bold">Подход: от идеи до железа</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Hardware</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  3D-печать компонентов и корпусов
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Манипуляторы и актуаторы
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Сенсорные системы (LiDAR, камеры, IMU)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Edge-вычислители (Jetson, Raspberry Pi)
                </li>
              </ul>
            </div>

            <div className="glass rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Software</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  ROS 2 для управления роботами
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Computer Vision (YOLO, OpenCV)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Edge AI модели от ИИ-лаборатории
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Симуляция в Gazebo/Isaac Sim
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Направления */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Bot className="text-purple-400" size={24} />
            <h2 className="text-2xl font-bold">Направления разработки</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Манипуляторы', desc: 'Робо-руки для сборки и обслуживания оборудования', icon: Wrench },
              { title: 'Computer Vision', desc: 'Системы визуального контроля и распознавания', icon: Eye },
              { title: 'Edge AI', desc: 'Оптимизация моделей для встраиваемых систем', icon: Cpu },
              { title: 'Сенсорика', desc: 'Интеграция датчиков и систем навигации', icon: Cog },
              { title: 'CAD/CAM', desc: 'Проектирование и изготовление компонентов', icon: Box },
              { title: 'Симуляция', desc: 'Виртуальное тестирование до физического прототипа', icon: Gamepad2 },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 hover:border-purple-500/30 transition-colors"
              >
                <item.icon className="text-purple-400 mb-4" size={24} />
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
              { title: 'Прототипы', desc: 'Работающие роботы-демонстраторы', value: '3+/год' },
              { title: 'Edge-модели', desc: 'AI для встраиваемых систем', value: '10+' },
              { title: 'CAD-библиотеки', desc: 'Готовые компоненты для сборки', value: '100+' },
              { title: 'Патенты', desc: 'Защита интеллектуальной собственности', value: '2+/год' },
            ].map((item) => (
              <div key={item.title} className="glass rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{item.value}</div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-sm text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Кейс ВКР */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="glass rounded-2xl p-8 border border-purple-500/20">
            <div className="flex items-center gap-4 mb-4">
              <FileText className="text-purple-400" size={24} />
              <h2 className="text-xl font-bold">Реальный пример применения</h2>
            </div>
            <p className="text-slate-400 mb-4">
              Смотрите, как ИИ-инструменты могли бы ускорить разработку боевого робота
              в 5-10 раз на примере реальной ВКР студента Политеха.
            </p>
            <Link
              to="/labs/robotics/case-vkr"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              Смотреть кейс <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Взаимодействие с экосистемой</h2>
          <p className="text-slate-400 mb-8">
            Лаборатория Робототехники получает edge-модели от ИИ-лаборатории и софт от
            лаборатории ПО, создавая комплексные решения для автоматизации.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/labs/ai" className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors">
              Лаборатория ИИ
            </Link>
            <Link to="/labs/software" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors">
              Лаборатория ПО
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
