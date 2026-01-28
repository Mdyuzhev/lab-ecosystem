import { Link } from 'react-router-dom'
import { Wrench, Bot, Briefcase, GraduationCap, FileText } from 'lucide-react'

const allOutputs = [
  { id: 'modules', title: 'Модули', desc: 'OSS + Premium', path: '/outputs/modules', icon: Wrench, color: 'emerald' },
  { id: 'robots', title: 'Роботы', desc: 'Прототипы', path: '/outputs/robots', icon: Bot, color: 'purple' },
  { id: 'software', title: 'ПО', desc: 'SaaS', path: '/outputs/software', icon: Briefcase, color: 'blue' },
  { id: 'talents', title: 'Кадры', desc: '→ РТК', path: '/outputs/talents', icon: GraduationCap, color: 'amber' },
  { id: 'ip', title: 'IP', desc: 'Патенты', path: '/outputs/ip', icon: FileText, color: 'cyan' },
]

export default function OutputsNavigation({ currentId }) {
  const otherOutputs = allOutputs.filter(o => o.id !== currentId)

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Другие выходы экосистемы</h2>
        <p className="text-slate-400 mb-8">
          Исследуйте все направления, которые создаёт платформа
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {otherOutputs.map((output) => (
            <Link
              key={output.id}
              to={output.path}
              className="glass rounded-xl p-4 hover:scale-105 transition-all group"
            >
              <output.icon className="mx-auto mb-2 text-slate-400 group-hover:text-white transition-colors" size={24} />
              <div className="font-semibold">{output.title}</div>
              <div className="text-xs text-slate-500">{output.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
