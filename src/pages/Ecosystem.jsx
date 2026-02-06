import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Package, Wrench, Bot, Briefcase, GraduationCap, FileText } from 'lucide-react'
import IsometricEcosystem from '../components/IsometricEcosystem'

function EcosystemOutputs() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-6 pb-20"
    >
      <div className="bg-gradient-to-r from-emerald-500/10 to-yellow-500/10 rounded-2xl p-6 border border-emerald-500/20">
        <h4 className="text-center text-emerald-400 font-semibold mb-6 flex items-center justify-center gap-2">
          <Package className="w-5 h-5" /> Выходы экосистемы
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: Wrench, title: 'Модули', desc: 'OSS + Premium', color: 'emerald', path: '/outputs/modules' },
            { icon: Bot, title: 'Роботы', desc: 'Прототипы', color: 'purple', path: '/outputs/robots' },
            { icon: Briefcase, title: 'ПО', desc: 'SaaS', color: 'blue', path: '/outputs/software' },
            { icon: GraduationCap, title: 'Кадры', desc: '→ РТК', color: 'amber', path: '/outputs/talents' },
            { icon: FileText, title: 'IP', desc: 'Патенты', color: 'cyan', path: '/outputs/ip' },
          ].map((item) => (
            <Link key={item.title} to={item.path}>
              <div className="glass rounded-xl p-4 text-center hover:border-emerald-500/30 transition-all cursor-pointer hover:scale-105">
                <item.icon className={`w-6 h-6 mx-auto mb-2 text-${item.color}-400`} />
                <div className="font-semibold text-sm">{item.title}</div>
                <div className="text-xs text-yellow-400">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Ecosystem() {
  return (
    <>
      <IsometricEcosystem />
      <EcosystemOutputs />
    </>
  )
}
