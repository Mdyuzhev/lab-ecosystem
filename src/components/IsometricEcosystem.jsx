import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Brain, Code, Cog, Building2, GraduationCap, Users, TrendingUp } from 'lucide-react'

const labs = [
  {
    id: 'ai',
    title: 'Лаборатория ИИ',
    subtitle: '«Фабрика инструментов»',
    color: 'emerald',
    colorHex: '#10B981',
    colorLight: '#34D399',
    colorDark: '#059669',
    team: { rt: '1 Tech Lead', uni: '1 Научрук + 3 студента' },
    output: 'Модули, библиотеки, методики',
    revenue: '5-15 млн₽/год',
    icon: Brain,
    height: 90,
    baseX: 120,
    baseY: 280,
  },
  {
    id: 'software',
    title: 'Лаборатория ПО',
    subtitle: '«Быстрые прототипы»',
    color: 'blue',
    colorHex: '#3B82F6',
    colorLight: '#60A5FA',
    colorDark: '#2563EB',
    team: { rt: '2 Tech Lead', uni: '2 Научрука + 6 студентов' },
    output: 'MVP за 2-4 мес, production решения',
    revenue: '20-50 млн₽/год',
    icon: Code,
    height: 110,
    baseX: 350,
    baseY: 280,
  },
  {
    id: 'robotics',
    title: 'Лаб. Робототехники',
    subtitle: '«Железо + интеллект»',
    color: 'purple',
    colorHex: '#8B5CF6',
    colorLight: '#A78BFA',
    colorDark: '#7C3AED',
    team: { rt: '1 Tech Lead + 1 инженер', uni: '1 Научрук + 4 студента' },
    output: 'Прототипы роботов',
    revenue: '10-30 млн₽/год',
    icon: Cog,
    height: 100,
    baseX: 580,
    baseY: 280,
  },
]

// Изометрические координаты здания
function getIsoBuildingPoints(baseX, baseY, width = 100, height = 100) {
  const w = width / 2
  const h = height
  const d = 50 // глубина (изометрическая)

  // Верхняя грань (ромб)
  const top = [
    [baseX, baseY - h],
    [baseX + w, baseY - h + d/2],
    [baseX, baseY - h + d],
    [baseX - w, baseY - h + d/2],
  ]

  // Левая грань
  const left = [
    [baseX - w, baseY - h + d/2],
    [baseX, baseY - h + d],
    [baseX, baseY + d],
    [baseX - w, baseY + d/2],
  ]

  // Правая грань
  const right = [
    [baseX, baseY - h + d],
    [baseX + w, baseY - h + d/2],
    [baseX + w, baseY + d/2],
    [baseX, baseY + d],
  ]

  return { top, left, right }
}

function IsometricBuilding({ lab, isActive, onHover, onLeave, index, isInView }) {
  const { top, left, right } = getIsoBuildingPoints(lab.baseX, lab.baseY, 100, lab.height)
  const Icon = lab.icon

  const toPath = (points) => points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ' Z'

  return (
    <motion.g
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ cursor: 'pointer' }}
    >
      {/* Тень */}
      <ellipse
        cx={lab.baseX}
        cy={lab.baseY + 60}
        rx={60}
        ry={25}
        fill="rgba(0,0,0,0.3)"
        filter="url(#shadow)"
      />

      {/* Здание */}
      <motion.g
        animate={{
          y: isActive ? -10 : 0,
          filter: isActive ? 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))' : 'none'
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Левая грань (тёмная) */}
        <path
          d={toPath(left)}
          fill={lab.colorDark}
          stroke={lab.colorHex}
          strokeWidth="1"
          opacity={isActive === false ? 0.5 : 1}
        />

        {/* Правая грань (средняя) */}
        <path
          d={toPath(right)}
          fill={lab.colorHex}
          stroke={lab.colorLight}
          strokeWidth="1"
          opacity={isActive === false ? 0.5 : 1}
        />

        {/* Верхняя грань (светлая) */}
        <path
          d={toPath(top)}
          fill={lab.colorLight}
          stroke={lab.colorHex}
          strokeWidth="1"
          opacity={isActive === false ? 0.5 : 1}
        />

        {/* Иконка на верхней грани */}
        <foreignObject
          x={lab.baseX - 15}
          y={lab.baseY - lab.height - 5}
          width="30"
          height="30"
        >
          <div className="flex items-center justify-center w-full h-full">
            <Icon className="w-5 h-5 text-slate-900" />
          </div>
        </foreignObject>
      </motion.g>

      {/* Метка выручки */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
      >
        <rect
          x={lab.baseX + 55}
          y={lab.baseY - lab.height - 20}
          width="85"
          height="24"
          rx="12"
          fill="rgba(34, 197, 94, 0.2)"
          stroke="#22C55E"
          strokeWidth="1"
        />
        <text
          x={lab.baseX + 97}
          y={lab.baseY - lab.height - 4}
          textAnchor="middle"
          fill="#22C55E"
          fontSize="11"
          fontWeight="600"
        >
          {lab.revenue.split('/')[0]}
        </text>
      </motion.g>
    </motion.g>
  )
}

function DataFlowParticle({ path, color, duration, delay }) {
  return (
    <circle r="4" fill={color} opacity="0.9">
      <animateMotion
        dur={`${duration}s`}
        repeatCount="indefinite"
        begin={`${delay}s`}
        path={path}
      />
    </circle>
  )
}

function AnimatedFlows({ activeLab }) {
  const flows = [
    // ИИ → ПО (данные/инструменты)
    { path: 'M170,250 Q260,220 300,250', color: '#06B6D4', from: 'ai', to: 'software' },
    // ИИ → Робототехника
    { path: 'M170,260 Q350,180 530,260', color: '#06B6D4', from: 'ai', to: 'robotics' },
    // ПО → ИИ (запросы)
    { path: 'M300,270 Q260,300 170,270', color: '#F59E0B', from: 'software', to: 'ai' },
    // Робототехника → ИИ (запросы)
    { path: 'M530,280 Q350,350 170,280', color: '#F59E0B', from: 'robotics', to: 'ai' },
    // ПО → Робототехника (edge-модели)
    { path: 'M400,260 Q490,230 530,260', color: '#06B6D4', from: 'software', to: 'robotics' },
  ]

  return (
    <g>
      {/* Линии путей */}
      {flows.map((flow, i) => (
        <path
          key={i}
          d={flow.path}
          fill="none"
          stroke={flow.color}
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity={
            activeLab === null ? 0.4 :
            (activeLab === flow.from || activeLab === flow.to) ? 0.8 : 0.15
          }
          style={{ transition: 'opacity 0.3s' }}
        />
      ))}

      {/* Анимированные частицы */}
      {flows.map((flow, i) => (
        <g key={`particles-${i}`} opacity={
          activeLab === null ? 1 :
          (activeLab === flow.from || activeLab === flow.to) ? 1 : 0.2
        }>
          <DataFlowParticle
            path={flow.path}
            color={flow.color}
            duration={2.5 + i * 0.3}
            delay={i * 0.5}
          />
          <DataFlowParticle
            path={flow.path}
            color={flow.color}
            duration={2.5 + i * 0.3}
            delay={i * 0.5 + 1.2}
          />
        </g>
      ))}

      {/* ROI стрелки вверх */}
      {labs.map((lab, i) => (
        <g key={`roi-${i}`} opacity={activeLab === null || activeLab === lab.id ? 1 : 0.3}>
          <path
            d={`M${lab.baseX},${lab.baseY - lab.height - 30} L${lab.baseX},${lab.baseY - lab.height - 70}`}
            stroke="#22C55E"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <polygon
            points={`${lab.baseX},${lab.baseY - lab.height - 75} ${lab.baseX - 5},${lab.baseY - lab.height - 65} ${lab.baseX + 5},${lab.baseY - lab.height - 65}`}
            fill="#22C55E"
          >
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2s"
              repeatCount="indefinite"
            />
          </polygon>
        </g>
      ))}
    </g>
  )
}

function SteeringCommittee({ isInView }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: -30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      {/* Платформа комитета */}
      <rect
        x="200"
        y="50"
        width="300"
        height="60"
        rx="10"
        fill="rgba(251, 191, 36, 0.1)"
        stroke="#F59E0B"
        strokeWidth="2"
      />

      <text x="350" y="75" textAnchor="middle" fill="#FCD34D" fontSize="14" fontWeight="600">
        Управляющий комитет
      </text>

      {/* Бейджи */}
      <rect x="250" y="88" width="80" height="18" rx="9" fill="rgba(59, 130, 246, 0.2)" />
      <text x="290" y="101" textAnchor="middle" fill="#60A5FA" fontSize="10" fontWeight="500">
        РТ 70%
      </text>

      <rect x="340" y="88" width="80" height="18" rx="9" fill="rgba(139, 92, 246, 0.2)" />
      <text x="380" y="101" textAnchor="middle" fill="#A78BFA" fontSize="10" fontWeight="500">
        Политех 30%
      </text>

      {/* Пунктирные линии к зданиям */}
      {labs.map((lab, i) => (
        <path
          key={i}
          d={`M${350},110 Q${lab.baseX},160 ${lab.baseX},${lab.baseY - lab.height - 30}`}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity="0.4"
        />
      ))}
    </motion.g>
  )
}

function Participants({ isInView }) {
  const rtTeam = [
    { role: 'Tech Lead', count: 4 },
    { role: 'Инженер', count: 1 },
  ]

  const uniTeam = [
    { role: 'Научрук', count: 4 },
    { role: 'Студент', count: 13 },
  ]

  return (
    <>
      {/* Левая сторона - РТ */}
      <motion.g
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <rect x="20" y="180" width="70" height="150" rx="8" fill="rgba(59, 130, 246, 0.1)" stroke="#3B82F6" strokeWidth="1" />
        <foreignObject x="20" y="185" width="70" height="20">
          <div className="flex items-center justify-center gap-1">
            <Building2 className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] text-blue-400 font-medium">Ростелеком</span>
          </div>
        </foreignObject>

        {rtTeam.map((member, i) => (
          <g key={i}>
            <circle cx="40" cy={220 + i * 40} r="12" fill="#3B82F6" opacity="0.3" />
            <foreignObject x="28" y={208 + i * 40} width="24" height="24">
              <div className="flex items-center justify-center w-full h-full">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
            </foreignObject>
            <text x="55" y={224 + i * 40} fill="#60A5FA" fontSize="9" fontWeight="500">
              ×{member.count}
            </text>
            <text x="40" y={240 + i * 40} textAnchor="middle" fill="#94A3B8" fontSize="8">
              {member.role}
            </text>
          </g>
        ))}

        {/* Линии к зданиям */}
        <path d="M90,230 Q115,250 120,250" stroke="#3B82F6" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
      </motion.g>

      {/* Правая сторона - Вуз */}
      <motion.g
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <rect x="610" y="180" width="70" height="150" rx="8" fill="rgba(139, 92, 246, 0.1)" stroke="#8B5CF6" strokeWidth="1" />
        <foreignObject x="610" y="185" width="70" height="20">
          <div className="flex items-center justify-center gap-1">
            <GraduationCap className="w-3 h-3 text-purple-400" />
            <span className="text-[10px] text-purple-400 font-medium">Политех</span>
          </div>
        </foreignObject>

        {uniTeam.map((member, i) => (
          <g key={i}>
            <circle cx="660" cy={220 + i * 40} r="12" fill="#8B5CF6" opacity="0.3" />
            <foreignObject x="648" y={208 + i * 40} width="24" height="24">
              <div className="flex items-center justify-center w-full h-full">
                <Users className="w-4 h-4 text-purple-400" />
              </div>
            </foreignObject>
            <text x="635" y={224 + i * 40} textAnchor="end" fill="#A78BFA" fontSize="9" fontWeight="500">
              ×{member.count}
            </text>
            <text x="660" y={240 + i * 40} textAnchor="middle" fill="#94A3B8" fontSize="8">
              {member.role}
            </text>
          </g>
        ))}

        {/* Линии к зданиям */}
        <path d="M610,250 Q590,260 580,260" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
      </motion.g>
    </>
  )
}

function DetailPanel({ lab, position }) {
  if (!lab) return null

  const Icon = lab.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute z-10 w-72 glass rounded-xl p-4 border-2"
      style={{
        left: position.x,
        top: position.y,
        borderColor: lab.colorHex,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${lab.colorHex}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: lab.colorHex }} />
        </div>
        <div>
          <h4 className="font-bold text-white">{lab.title}</h4>
          <p className="text-xs" style={{ color: lab.colorLight }}>{lab.subtitle}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">От РТ:</span>
          <span className="text-blue-400">{lab.team.rt}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">От вуза:</span>
          <span className="text-purple-400">{lab.team.uni}</span>
        </div>
        <div className="pt-2 border-t border-slate-700">
          <span className="text-slate-400 text-xs">Выходы:</span>
          <p className="text-white text-sm">{lab.output}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between">
        <span className="text-slate-400 text-sm">ROI / выручка:</span>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-bold">{lab.revenue}</span>
        </div>
      </div>
    </motion.div>
  )
}

function Legend() {
  const items = [
    { color: '#06B6D4', label: 'Данные/инструменты' },
    { color: '#F59E0B', label: 'Запросы/задачи' },
    { color: '#22C55E', label: 'ROI/выручка' },
  ]

  return (
    <div className="flex justify-center gap-6 mt-8">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-sm text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function MobileCards() {
  return (
    <div className="md:hidden space-y-4">
      {/* Управляющий комитет */}
      <div className="glass rounded-xl p-4 border-2 border-amber-500/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="font-bold text-amber-400">Управляющий комитет</h4>
            <p className="text-xs text-slate-400">70/30 • Решения и приоритеты</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-400">РТ 70%</span>
          <span className="px-2 py-1 text-xs rounded bg-purple-500/20 text-purple-400">Политех 30%</span>
        </div>
      </div>

      {/* Лаборатории */}
      {labs.map((lab) => {
        const Icon = lab.icon
        return (
          <motion.div
            key={lab.id}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-xl p-4 border"
            style={{ borderColor: `${lab.colorHex}40` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${lab.colorHex}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: lab.colorHex }} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">{lab.title}</h4>
                <p className="text-xs" style={{ color: lab.colorLight }}>{lab.subtitle}</p>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold text-sm">{lab.revenue}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">РТ: </span>
                <span className="text-blue-400">{lab.team.rt}</span>
              </div>
              <div>
                <span className="text-slate-500">Вуз: </span>
                <span className="text-purple-400">{lab.team.uni}</span>
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Потоки */}
      <div className="glass rounded-xl p-4">
        <h4 className="text-center text-sm font-semibold mb-3 text-slate-300">Потоки между лабораториями</h4>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800">
            <span className="text-emerald-400">ИИ</span>
            <span className="text-cyan-400">→</span>
            <span className="text-blue-400">ПО/Роботы</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800">
            <span className="text-blue-400">ПО</span>
            <span className="text-amber-400">→</span>
            <span className="text-emerald-400">ИИ</span>
          </div>
        </div>
      </div>

      <Legend />
    </div>
  )
}

export default function IsometricEcosystem() {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeLab, setActiveLab] = useState(null)
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 })

  const handleHover = (lab, event) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const x = Math.min(event.clientX - rect.left + 20, rect.width - 300)
      const y = event.clientY - rect.top - 100
      setPanelPosition({ x, y })
    }
    setActiveLab(lab.id)
  }

  return (
    <section id="ecosystem" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Фон */}
      <div className="absolute inset-0 bg-slate-900" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      {/* Изометрическая сетка на фоне */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            repeating-linear-gradient(30deg, #fff 0, #fff 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(-30deg, #fff 0, #fff 1px, transparent 1px, transparent 40px)
          `,
        }}
      />

      {/* Свечение */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6" ref={containerRef}>
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <span className="text-amber-400 text-sm font-medium">Экосистема</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Экосистема R&D{' '}
            <span className="gradient-text from-amber-400 to-orange-400">лабораторий</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Политех × Ростелеком
          </p>
        </motion.div>

        {/* Изометрическая сцена - только десктоп */}
        <div className="hidden md:block relative">
          <svg
            viewBox="0 0 700 400"
            className="w-full max-w-4xl mx-auto"
            style={{ minHeight: '400px' }}
          >
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
                <feOffset dx="0" dy="5" result="offsetblur" />
                <feFlood floodColor="rgba(0,0,0,0.5)" />
                <feComposite in2="offsetblur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Участники по бокам */}
            <Participants isInView={isInView} />

            {/* Управляющий комитет */}
            <SteeringCommittee isInView={isInView} />

            {/* Анимированные потоки */}
            <AnimatedFlows activeLab={activeLab} />

            {/* Здания */}
            {labs.map((lab, index) => (
              <IsometricBuilding
                key={lab.id}
                lab={lab}
                index={index}
                isActive={activeLab === null ? null : activeLab === lab.id}
                isInView={isInView}
                onHover={(e) => handleHover(lab, e)}
                onLeave={() => setActiveLab(null)}
              />
            ))}
          </svg>

          {/* Панель деталей */}
          <AnimatePresence>
            {activeLab && (
              <DetailPanel
                lab={labs.find(l => l.id === activeLab)}
                position={panelPosition}
              />
            )}
          </AnimatePresence>

          <Legend />
        </div>

        {/* Мобильная версия - карточки */}
        <MobileCards />
      </div>
    </section>
  )
}
