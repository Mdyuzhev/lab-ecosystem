import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Building, GraduationCap, Mail, Linkedin, Scale, UsersRound } from 'lucide-react'

export default function Team() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const committeeMembers = [
    {
      role: 'Председатель комитета',
      title: 'Директор по инновациям',
      org: 'Ростелеком',
      color: 'blue',
      icon: Building
    },
    {
      role: 'Член комитета',
      title: 'Руководитель R&D',
      org: 'Ростелеком',
      color: 'blue',
      icon: Building
    },
    {
      role: 'Член комитета',
      title: 'Представитель бизнеса',
      org: 'Ростелеком',
      color: 'blue',
      icon: Building
    },
    {
      role: 'Член комитета',
      title: 'Проректор по науке',
      org: 'СПбПУ Политех',
      color: 'purple',
      icon: GraduationCap
    },
    {
      role: 'Член комитета',
      title: 'Директор института',
      org: 'СПбПУ Политех',
      color: 'purple',
      icon: GraduationCap
    },
  ]

  const labTeams = [
    {
      lab: 'Лаборатория ИИ',
      color: 'emerald',
      members: [
        { role: 'Tech Lead', org: 'РТК', count: 1 },
        { role: 'Научный руководитель', org: 'ВУЗ', count: 1 },
        { role: 'Исследователи', org: 'Студенты', count: 3 },
      ]
    },
    {
      lab: 'Лаборатория ПО',
      color: 'blue',
      members: [
        { role: 'Tech Lead', org: 'РТК', count: 2 },
        { role: 'Научные руководители', org: 'ВУЗ', count: 2 },
        { role: 'Разработчики', org: 'Студенты', count: 6 },
      ]
    },
    {
      lab: 'Лаборатория Робототехники',
      color: 'purple',
      members: [
        { role: 'Tech Lead + Инженер', org: 'РТК', count: 2 },
        { role: 'Научный руководитель', org: 'ВУЗ', count: 1 },
        { role: 'Инженеры', org: 'Студенты', count: 4 },
      ]
    },
  ]

  const colorMap = {
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <section id="team" className="relative py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      {/* Background glow */}
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Users className="text-purple-400" size={16} />
            <span className="text-purple-400 text-sm font-medium">Команда</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Люди, которые{' '}
            <span className="gradient-text from-purple-400 to-pink-400">создают будущее</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Структура команды: управляющий комитет координирует работу, 
            а специализированные команды реализуют проекты
          </p>
        </motion.div>

        {/* Committee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <Scale className="w-6 h-6 text-amber-400" /> Управляющий комитет
          </h3>
          
          <div className="grid md:grid-cols-5 gap-4">
            {committeeMembers.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className={`glass rounded-xl p-4 text-center border ${
                  member.color === 'blue' ? 'border-blue-500/20' : 'border-purple-500/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  member.color === 'blue' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                }`}>
                  <member.icon className={member.color === 'blue' ? 'text-blue-400' : 'text-purple-400'} size={24} />
                </div>
                <div className="text-sm font-semibold mb-1">{member.title}</div>
                <div className={`text-xs ${member.color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>
                  {member.org}
                </div>
                <div className="text-xs text-slate-500 mt-2">{member.role}</div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-slate-400">Ростелеком (70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm text-slate-400">Политех (30%)</span>
            </div>
          </div>
        </motion.div>

        {/* Lab Teams */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <UsersRound className="w-6 h-6 text-emerald-400" /> Команды лабораторий
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {labTeams.map((team, i) => (
              <div
                key={i}
                className={`glass rounded-2xl p-6 border border-${team.color}-500/20`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[team.color]} flex items-center justify-center`}>
                    <Users className="text-white" size={20} />
                  </div>
                  <h4 className="font-semibold">{team.lab}</h4>
                </div>

                <div className="space-y-3">
                  {team.members.map((member, j) => (
                    <div key={j} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                      <div>
                        <div className="text-sm">{member.role}</div>
                        <div className="text-xs text-slate-500">{member.org}</div>
                      </div>
                      <div className={`text-lg font-bold text-${team.color}-400`}>
                        {member.count}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                  <span className="text-sm text-slate-400">Всего в команде</span>
                  <span className="text-xl font-bold">
                    {team.members.reduce((acc, m) => acc + m.count, 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Total summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 glass rounded-2xl p-8 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-4xl font-bold gradient-text from-emerald-400 to-cyan-400">24+</div>
              <div className="text-slate-400">Человек в команде</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text from-blue-400 to-purple-400">3</div>
              <div className="text-slate-400">Лаборатории</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text from-purple-400 to-pink-400">5</div>
              <div className="text-slate-400">Членов комитета</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text from-amber-400 to-orange-400">2</div>
              <div className="text-slate-400">Организации</div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Хотите стать частью проекта?</h3>
          <p className="text-slate-400 mb-6">Мы открыты для талантливых специалистов и новых партнёров</p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-semibold flex items-center gap-2"
            >
              <Mail size={18} />
              Связаться с нами
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/10"
            >
              <Linkedin size={18} />
              LinkedIn
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
