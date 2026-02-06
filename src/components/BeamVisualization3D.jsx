import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'

const BEAM_X = 100
const BEAM_Y = 200
const BEAM_W = 550
const BEAM_H = 30
const BEAM_D = 15

function getStressColor(intensity, zoneColor) {
  if (zoneColor === 'emerald') {
    const r = Math.round(16 + (52 - 16) * (1 - intensity))
    const g = Math.round(185 + (211 - 185) * (1 - intensity))
    const b = Math.round(129 + (153 - 129) * (1 - intensity))
    return `rgb(${r},${g},${b})`
  } else if (zoneColor === 'amber') {
    const r = Math.round(239 + (251 - 239) * (1 - intensity))
    const g = Math.round(68 + (191 - 68) * (1 - intensity))
    const b = Math.round(68 + (36 - 68) * (1 - intensity))
    return `rgb(${r},${g},${b})`
  } else {
    const r = Math.round(220 + (239 - 220) * (1 - intensity))
    const g = Math.round(38 + (68 - 38) * (1 - intensity))
    const b = Math.round(38 + (68 - 38) * (1 - intensity))
    return `rgb(${r},${g},${b})`
  }
}

function getZoneStroke(zoneColor) {
  if (zoneColor === 'emerald') return '#10b981'
  if (zoneColor === 'amber') return '#f59e0b'
  return '#ef4444'
}

function CrossSection({ sectionType, zoneColor, inputs }) {
  const stroke = zoneColor ? getZoneStroke(zoneColor) : '#64748b'
  const cx = 710, cy = 40

  if (sectionType === 'circular') {
    return (
      <g>
        <circle cx={cx} cy={cy} r={16} fill="none" stroke={stroke} strokeWidth={1.5} />
        <text x={cx} y={cy + 30} textAnchor="middle" fill="#64748b" fontSize="9">
          ⌀{inputs.diameter}
        </text>
      </g>
    )
  }
  if (sectionType === 'tube') {
    return (
      <g>
        <circle cx={cx} cy={cy} r={16} fill="none" stroke={stroke} strokeWidth={1.5} />
        <circle cx={cx} cy={cy} r={10} fill="none" stroke={stroke} strokeWidth={1} strokeDasharray="2 2" />
        <text x={cx} y={cy + 30} textAnchor="middle" fill="#64748b" fontSize="9">
          ⌀{inputs.outerDiameter}/{inputs.innerDiameter}
        </text>
      </g>
    )
  }
  return (
    <g>
      <rect x={cx - 20} y={cy - 12} width={40} height={25} fill="none" stroke={stroke} strokeWidth={1.5} rx={1} />
      <text x={cx} y={cy + 28} textAnchor="middle" fill="#64748b" fontSize="9">
        {inputs.width}×{inputs.height}
      </text>
    </g>
  )
}

function WallSupport() {
  return (
    <g>
      <rect x={60} y={BEAM_Y - 60} width={40} height={120} fill="url(#hatch)" stroke="#475569" strokeWidth={1} />
      <line x1={BEAM_X} y1={BEAM_Y - 60} x2={BEAM_X} y2={BEAM_Y + 60} stroke="#64748b" strokeWidth={2} />
    </g>
  )
}

function SimpleSupports() {
  const triH = 20
  const y0 = BEAM_Y + BEAM_H / 2
  return (
    <g>
      <polygon points={`${BEAM_X},${y0} ${BEAM_X - 12},${y0 + triH} ${BEAM_X + 12},${y0 + triH}`} fill="#475569" stroke="#64748b" strokeWidth={1} />
      <polygon points={`${BEAM_X + BEAM_W},${y0} ${BEAM_X + BEAM_W - 12},${y0 + triH} ${BEAM_X + BEAM_W + 12},${y0 + triH}`} fill="#475569" stroke="#64748b" strokeWidth={1} />
      <line x1={BEAM_X - 18} y1={y0 + triH + 2} x2={BEAM_X + 18} y2={y0 + triH + 2} stroke="#475569" strokeWidth={2} />
      <line x1={BEAM_X + BEAM_W - 18} y1={y0 + triH + 2} x2={BEAM_X + BEAM_W + 18} y2={y0 + triH + 2} stroke="#475569" strokeWidth={2} />
    </g>
  )
}

// Эллипс торца для круглого/трубного сечения (изометрическая проекция)
// Центр эллипса: середина правого торца, rx ~ BEAM_D*0.7, ry ~ BEAM_H*0.7
// Поворот ~-13° для имитации изометрии
function EndCapEllipse({ cx, cy, hasResults, fillId, stroke, isInner }) {
  const rx = isInner ? BEAM_D * 0.35 : BEAM_D * 0.7
  const ry = isInner ? BEAM_H * 0.5 : BEAM_H * 0.75
  return (
    <ellipse
      cx={cx} cy={cy}
      rx={rx} ry={ry}
      fill={isInner ? '#0f172a' : (hasResults ? fillId : '#334155')}
      stroke={stroke}
      strokeWidth={isInner ? 0.8 : 0.5}
      transform={`rotate(-13 ${cx} ${cy})`}
    />
  )
}

export default function BeamVisualization3D({ results, inputs, isAnimating }) {
  const zoneColor = results?.zoneColor || 'emerald'
  const zoneStroke = getZoneStroke(zoneColor)
  const isCantilever = inputs.elementType === 'beam-cantilever'
  const isSupported = inputs.elementType === 'beam-supported'
  const isSimplified = inputs.elementType === 'plate' || inputs.elementType === 'rod'
  const isCircular = inputs.sectionType === 'circular'
  const isTube = inputs.sectionType === 'tube'
  const isRound = isCircular || isTube

  const maxVisualDeflection = results ? Math.min(results.dynamicDeflection * 2, 60) : 0

  // --- Front face paths (same for all sections — cylinder front = rectangle) ---
  const straightFrontPath = `
    M ${BEAM_X} ${BEAM_Y - BEAM_H / 2}
    C ${BEAM_X + BEAM_W * 0.4} ${BEAM_Y - BEAM_H / 2}
      ${BEAM_X + BEAM_W * 0.7} ${BEAM_Y - BEAM_H / 2}
      ${BEAM_X + BEAM_W} ${BEAM_Y - BEAM_H / 2}
    L ${BEAM_X + BEAM_W} ${BEAM_Y + BEAM_H / 2}
    C ${BEAM_X + BEAM_W * 0.7} ${BEAM_Y + BEAM_H / 2}
      ${BEAM_X + BEAM_W * 0.4} ${BEAM_Y + BEAM_H / 2}
      ${BEAM_X} ${BEAM_Y + BEAM_H / 2}
    Z`

  let deflectedFrontPath = straightFrontPath
  if (results && maxVisualDeflection > 0) {
    const d = maxVisualDeflection
    if (isCantilever || isSimplified) {
      deflectedFrontPath = `
        M ${BEAM_X} ${BEAM_Y - BEAM_H / 2}
        C ${BEAM_X + BEAM_W * 0.4} ${BEAM_Y - BEAM_H / 2 + d * 0.15}
          ${BEAM_X + BEAM_W * 0.7} ${BEAM_Y - BEAM_H / 2 + d * 0.55}
          ${BEAM_X + BEAM_W} ${BEAM_Y - BEAM_H / 2 + d}
        L ${BEAM_X + BEAM_W} ${BEAM_Y + BEAM_H / 2 + d}
        C ${BEAM_X + BEAM_W * 0.7} ${BEAM_Y + BEAM_H / 2 + d * 0.55}
          ${BEAM_X + BEAM_W * 0.4} ${BEAM_Y + BEAM_H / 2 + d * 0.15}
          ${BEAM_X} ${BEAM_Y + BEAM_H / 2}
        Z`
    } else if (isSupported) {
      deflectedFrontPath = `
        M ${BEAM_X} ${BEAM_Y - BEAM_H / 2}
        C ${BEAM_X + BEAM_W * 0.25} ${BEAM_Y - BEAM_H / 2 + d * 0.6}
          ${BEAM_X + BEAM_W * 0.75} ${BEAM_Y - BEAM_H / 2 + d * 0.6}
          ${BEAM_X + BEAM_W} ${BEAM_Y - BEAM_H / 2}
        L ${BEAM_X + BEAM_W} ${BEAM_Y + BEAM_H / 2}
        C ${BEAM_X + BEAM_W * 0.75} ${BEAM_Y + BEAM_H / 2 + d * 0.6}
          ${BEAM_X + BEAM_W * 0.25} ${BEAM_Y + BEAM_H / 2 + d * 0.6}
          ${BEAM_X} ${BEAM_Y + BEAM_H / 2}
        Z`
    }
  }

  // --- Top face paths ---
  const straightTopPath = isRound
    // Для цилиндра — верхняя грань с дугообразным краем (выпуклость)
    ? `M ${BEAM_X} ${BEAM_Y - BEAM_H / 2}
       C ${BEAM_X + BEAM_W * 0.4} ${BEAM_Y - BEAM_H / 2}
         ${BEAM_X + BEAM_W * 0.7} ${BEAM_Y - BEAM_H / 2}
         ${BEAM_X + BEAM_W} ${BEAM_Y - BEAM_H / 2}
       L ${BEAM_X + BEAM_W + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D}
       C ${BEAM_X + BEAM_W * 0.7 + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D + 3}
         ${BEAM_X + BEAM_W * 0.4 + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D + 3}
         ${BEAM_X + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D}
       Z`
    // Прямоугольная — плоская верхняя грань
    : `M ${BEAM_X} ${BEAM_Y - BEAM_H / 2}
       C ${BEAM_X + BEAM_W * 0.4} ${BEAM_Y - BEAM_H / 2}
         ${BEAM_X + BEAM_W * 0.7} ${BEAM_Y - BEAM_H / 2}
         ${BEAM_X + BEAM_W} ${BEAM_Y - BEAM_H / 2}
       L ${BEAM_X + BEAM_W + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D}
       C ${BEAM_X + BEAM_W * 0.7 + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D}
         ${BEAM_X + BEAM_W * 0.4 + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D}
         ${BEAM_X + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D}
       Z`

  let deflectedTopPath = straightTopPath
  if (results && maxVisualDeflection > 0) {
    const d = maxVisualDeflection
    const bulge = isRound ? 3 : 0
    if (isCantilever || isSimplified) {
      deflectedTopPath = `
        M ${BEAM_X} ${BEAM_Y - BEAM_H / 2}
        C ${BEAM_X + BEAM_W * 0.4} ${BEAM_Y - BEAM_H / 2 + d * 0.15}
          ${BEAM_X + BEAM_W * 0.7} ${BEAM_Y - BEAM_H / 2 + d * 0.55}
          ${BEAM_X + BEAM_W} ${BEAM_Y - BEAM_H / 2 + d}
        L ${BEAM_X + BEAM_W + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D + d}
        C ${BEAM_X + BEAM_W * 0.7 + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D + d * 0.55 + bulge}
          ${BEAM_X + BEAM_W * 0.4 + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D + d * 0.15 + bulge}
          ${BEAM_X + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D}
        Z`
    } else if (isSupported) {
      deflectedTopPath = `
        M ${BEAM_X} ${BEAM_Y - BEAM_H / 2}
        C ${BEAM_X + BEAM_W * 0.25} ${BEAM_Y - BEAM_H / 2 + d * 0.6}
          ${BEAM_X + BEAM_W * 0.75} ${BEAM_Y - BEAM_H / 2 + d * 0.6}
          ${BEAM_X + BEAM_W} ${BEAM_Y - BEAM_H / 2}
        L ${BEAM_X + BEAM_W + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D}
        C ${BEAM_X + BEAM_W * 0.75 + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D + d * 0.6 + bulge}
          ${BEAM_X + BEAM_W * 0.25 + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D + d * 0.6 + bulge}
          ${BEAM_X + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D}
        Z`
    }
  }

  // --- Side face (end cap) ---
  const endDeflection = results && maxVisualDeflection > 0
    ? (isCantilever || isSimplified ? maxVisualDeflection : 0) : 0

  // Прямоугольное сечение — параллелограмм
  const straightSidePath = `
    M ${BEAM_X + BEAM_W} ${BEAM_Y - BEAM_H / 2}
    L ${BEAM_X + BEAM_W + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D}
    L ${BEAM_X + BEAM_W + BEAM_D} ${BEAM_Y + BEAM_H / 2 - BEAM_D}
    L ${BEAM_X + BEAM_W} ${BEAM_Y + BEAM_H / 2}
    Z`
  const deflectedSidePath = `
    M ${BEAM_X + BEAM_W} ${BEAM_Y - BEAM_H / 2 + endDeflection}
    L ${BEAM_X + BEAM_W + BEAM_D} ${BEAM_Y - BEAM_H / 2 - BEAM_D + endDeflection}
    L ${BEAM_X + BEAM_W + BEAM_D} ${BEAM_Y + BEAM_H / 2 - BEAM_D + endDeflection}
    L ${BEAM_X + BEAM_W} ${BEAM_Y + BEAM_H / 2 + endDeflection}
    Z`

  // Центр эллиптического торца
  const endCapCx = BEAM_X + BEAM_W + BEAM_D / 2
  const endCapCy = BEAM_Y - BEAM_D / 2 + endDeflection

  // Ударник
  const impactX = isCantilever || isSimplified ? BEAM_X + BEAM_W : BEAM_X + BEAM_W / 2
  const impactBaseY = BEAM_Y - BEAM_H / 2 - BEAM_D
  const impactDeflection = results && maxVisualDeflection > 0
    ? (isCantilever || isSimplified ? maxVisualDeflection : maxVisualDeflection * 0.6) : 0

  const springTransition = { type: 'spring', stiffness: 80, damping: 15 }

  return (
    <div className="glass rounded-2xl p-6 mb-6 overflow-hidden">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Eye className="text-purple-400" size={20} />
        Визуализация нагружения
        {isSimplified && (
          <span className="ml-2 text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">Упрощённая модель</span>
        )}
      </h3>

      <div className="bg-slate-950 rounded-xl overflow-hidden">
        <svg viewBox="0 0 800 400" className="w-full h-auto" style={{ maxHeight: '450px' }} preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#475569" strokeWidth="2" />
            </pattern>

            <linearGradient id="stressGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={getStressColor(1.0, zoneColor)} />
              <stop offset="30%" stopColor={getStressColor(0.7, zoneColor)} />
              <stop offset="60%" stopColor={getStressColor(0.4, zoneColor)} />
              <stop offset="100%" stopColor={getStressColor(0.1, zoneColor)} />
            </linearGradient>

            <linearGradient id="stressGradientTop" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={getStressColor(0.8, zoneColor)} />
              <stop offset="100%" stopColor={getStressColor(0.05, zoneColor)} />
            </linearGradient>

            <linearGradient id="stressGradientSide" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={getStressColor(0.3, zoneColor)} />
              <stop offset="100%" stopColor={getStressColor(0.15, zoneColor)} />
            </linearGradient>

            {/* Цилиндрический градиент: подсветка гребня */}
            <linearGradient id="cylinderTopHighlight" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>

            {/* Цилиндрический градиент на фронте: блик по центру */}
            <linearGradient id="cylinderFrontHighlight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="55%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
            </linearGradient>

            {/* Радиальный градиент для эллиптического торца */}
            <radialGradient id="endCapGradient">
              <stop offset="0%" stopColor={getStressColor(0.15, zoneColor)} />
              <stop offset="70%" stopColor={getStressColor(0.25, zoneColor)} />
              <stop offset="100%" stopColor={getStressColor(0.35, zoneColor)} />
            </radialGradient>

            <linearGradient id="legendGradient">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>

            <filter id="shadowBlur"><feGaussianBlur stdDeviation="6" /></filter>
            <filter id="beamGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Фоновая сетка */}
          {Array.from({ length: 10 }).map((_, i) => {
            const y = 350 - i * (5 + i * 2)
            return <line key={`grid-${i}`} x1={0} y1={y} x2={800} y2={y} stroke="#1e293b" strokeWidth={0.5} opacity={0.3 + i * 0.05} />
          })}

          {/* Тень */}
          <ellipse cx={BEAM_X + BEAM_W / 2} cy={BEAM_Y + 70} rx={BEAM_W / 2 + 20} ry={isRound ? 6 : 8} fill="rgba(0,0,0,0.3)" filter="url(#shadowBlur)" />

          {/* Опоры */}
          {(isCantilever || isSimplified) && <WallSupport />}
          {isSupported && <SimpleSupports />}

          {/* 3D Балка */}
          <g filter={results ? 'url(#beamGlow)' : undefined} key={inputs.sectionType}>

            {/* Боковая грань / торец */}
            {isRound ? (
              // Эллиптический торец для круглого/трубного сечения
              <motion.g
                initial={false}
                animate={{ y: endDeflection }}
                transition={springTransition}
              >
                <EndCapEllipse
                  cx={endCapCx} cy={BEAM_Y - BEAM_D / 2}
                  hasResults={!!results}
                  fillId={results ? 'url(#endCapGradient)' : '#334155'}
                  stroke="#64748b"
                />
                {isTube && (
                  <EndCapEllipse
                    cx={endCapCx} cy={BEAM_Y - BEAM_D / 2}
                    hasResults={!!results}
                    fillId="#0f172a"
                    stroke="#475569"
                    isInner
                  />
                )}
              </motion.g>
            ) : (
              // Параллелограмм для прямоугольного сечения
              <motion.path
                d={results ? deflectedSidePath : straightSidePath}
                fill={results ? 'url(#stressGradientSide)' : '#334155'}
                stroke="#475569" strokeWidth={0.5}
                initial={false}
                animate={{ d: results ? deflectedSidePath : straightSidePath }}
                transition={springTransition}
              />
            )}

            {/* Фронтальная грань */}
            <motion.path
              d={results ? deflectedFrontPath : straightFrontPath}
              fill={results ? 'url(#stressGradient)' : '#475569'}
              stroke="#64748b" strokeWidth={0.5}
              initial={false}
              animate={{ d: results ? deflectedFrontPath : straightFrontPath }}
              transition={springTransition}
            />

            {/* Блик по центру фронтальной грани (цилиндр) */}
            {isRound && (
              <motion.path
                d={results ? deflectedFrontPath : straightFrontPath}
                fill="url(#cylinderFrontHighlight)"
                stroke="none"
                initial={false}
                animate={{ d: results ? deflectedFrontPath : straightFrontPath }}
                transition={springTransition}
              />
            )}

            {/* Верхняя грань */}
            <motion.path
              d={results ? deflectedTopPath : straightTopPath}
              fill={results ? 'url(#stressGradientTop)' : '#3b4a5e'}
              stroke="#64748b" strokeWidth={0.5}
              initial={false}
              animate={{ d: results ? deflectedTopPath : straightTopPath }}
              transition={springTransition}
            />

            {/* Блик на верхней грани (цилиндр) */}
            {isRound && (
              <motion.path
                d={results ? deflectedTopPath : straightTopPath}
                fill="url(#cylinderTopHighlight)"
                stroke="none"
                initial={false}
                animate={{ d: results ? deflectedTopPath : straightTopPath }}
                transition={springTransition}
              />
            )}
          </g>

          {/* Ударник */}
          <motion.g
            animate={{ y: isAnimating ? [-60, impactDeflection, impactDeflection - 10, impactDeflection] : results ? impactDeflection : -60 }}
            transition={isAnimating ? { type: 'spring', stiffness: 300, damping: 10, duration: 0.6 } : springTransition}
          >
            <rect x={impactX - 20} y={impactBaseY - 50} width={40} height={35} rx={4} fill="#475569" stroke="#64748b" strokeWidth={1} />
            <text x={impactX} y={impactBaseY - 29} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
              {inputs.impactType === 'energy' ? `${inputs.impactEnergy}J` : `${inputs.impactMass}kg`}
            </text>
            <line x1={impactX} y1={impactBaseY - 15} x2={impactX} y2={impactBaseY - 4} stroke="#f59e0b" strokeWidth={2} />
            <polygon points={`${impactX - 5},${impactBaseY - 8} ${impactX + 5},${impactBaseY - 8} ${impactX},${impactBaseY}`} fill="#f59e0b" />
          </motion.g>

          {/* Частицы */}
          {isAnimating && (
            <g>
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2
                return (
                  <motion.circle key={`p-${i}`} cx={impactX} cy={BEAM_Y - BEAM_H / 2 + impactDeflection} r={2} fill="#fbbf24"
                    initial={{ opacity: 1, cx: impactX, cy: BEAM_Y - BEAM_H / 2 + impactDeflection }}
                    animate={{ cx: impactX + Math.cos(angle) * 30, cy: BEAM_Y - BEAM_H / 2 + impactDeflection + Math.sin(angle) * 30, opacity: 0, r: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                )
              })}
            </g>
          )}

          {/* Длина */}
          <g>
            <line x1={BEAM_X} y1={BEAM_Y + 60} x2={BEAM_X + BEAM_W} y2={BEAM_Y + 60} stroke="#64748b" strokeWidth={1} strokeDasharray="4 4" />
            <line x1={BEAM_X} y1={BEAM_Y + 55} x2={BEAM_X} y2={BEAM_Y + 65} stroke="#64748b" strokeWidth={1} />
            <line x1={BEAM_X + BEAM_W} y1={BEAM_Y + 55} x2={BEAM_X + BEAM_W} y2={BEAM_Y + 65} stroke="#64748b" strokeWidth={1} />
            <text x={BEAM_X + BEAM_W / 2} y={BEAM_Y + 78} textAnchor="middle" fill="#94a3b8" fontSize="12">L = {inputs.length} мм</text>
          </g>

          {/* Прогиб */}
          {results && maxVisualDeflection > 0 && (
            <g>
              {isCantilever || isSimplified ? (
                <>
                  <line x1={BEAM_X + BEAM_W + 25} y1={BEAM_Y} x2={BEAM_X + BEAM_W + 25} y2={BEAM_Y + maxVisualDeflection} stroke={zoneStroke} strokeWidth={1} strokeDasharray="3 3" />
                  <line x1={BEAM_X + BEAM_W + 20} y1={BEAM_Y} x2={BEAM_X + BEAM_W + 30} y2={BEAM_Y} stroke={zoneStroke} strokeWidth={1} />
                  <line x1={BEAM_X + BEAM_W + 20} y1={BEAM_Y + maxVisualDeflection} x2={BEAM_X + BEAM_W + 30} y2={BEAM_Y + maxVisualDeflection} stroke={zoneStroke} strokeWidth={1} />
                  <text x={BEAM_X + BEAM_W + 38} y={BEAM_Y + maxVisualDeflection / 2 + 4} fill={zoneStroke} fontSize="12" fontWeight="bold">δ = {results.dynamicDeflection.toFixed(1)} мм</text>
                </>
              ) : (
                <>
                  <line x1={BEAM_X + BEAM_W / 2 + 25} y1={BEAM_Y} x2={BEAM_X + BEAM_W / 2 + 25} y2={BEAM_Y + maxVisualDeflection * 0.6} stroke={zoneStroke} strokeWidth={1} strokeDasharray="3 3" />
                  <text x={BEAM_X + BEAM_W / 2 + 38} y={BEAM_Y + maxVisualDeflection * 0.3 + 4} fill={zoneStroke} fontSize="12" fontWeight="bold">δ = {results.dynamicDeflection.toFixed(1)} мм</text>
                </>
              )}
            </g>
          )}

          {/* Мини сечение */}
          <g>
            <text x={710} y={12} textAnchor="middle" fill="#475569" fontSize="9">Сечение</text>
            <CrossSection sectionType={inputs.sectionType} zoneColor={results?.zoneColor} inputs={inputs} />
          </g>

          {/* Легенда */}
          <rect x={BEAM_X} y={370} width={200} height={8} rx={4} fill="url(#legendGradient)" />
          <text x={BEAM_X} y={392} fill="#64748b" fontSize="10">0</text>
          <text x={BEAM_X + 100} y={392} fill="#64748b" fontSize="10" textAnchor="middle">σт</text>
          <text x={BEAM_X + 200} y={392} fill="#64748b" fontSize="10" textAnchor="end">σв</text>

          {/* Индикатор зоны */}
          {results && results.ZoneIcon && (
            <g>
              <circle cx={760} cy={370} r={14}
                fill={zoneColor === 'emerald' ? 'rgba(16,185,129,0.15)' : zoneColor === 'amber' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'}
                stroke={zoneStroke} strokeWidth={1} />
              <text x={760} y={375} textAnchor="middle" fill={zoneStroke} fontSize="14">
                {zoneColor === 'emerald' ? '✓' : zoneColor === 'amber' ? '!' : '✕'}
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="flex justify-between items-center mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-slate-600 rounded-sm" />
          {isCantilever || isSimplified ? 'Заделка' : 'Опоры'}
        </span>
        <span>
          {inputs.elementType === 'beam-cantilever' && 'Консольная балка'}
          {inputs.elementType === 'beam-supported' && 'Балка на опорах'}
          {inputs.elementType === 'plate' && 'Пластина (упрощ.)'}
          {inputs.elementType === 'rod' && 'Стержень (упрощ.)'}
          {' • L = '}{inputs.length} мм
          {isRound && ` • ${isCircular ? 'Круглое' : 'Трубное'} сечение`}
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-amber-500 rounded-full" /> Удар
        </span>
      </div>
    </div>
  )
}
