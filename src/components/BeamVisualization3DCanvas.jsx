import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef, useState, useEffect } from 'react'
import { Eye } from 'lucide-react'

// --- Вспомогательные функции ---

function createSectionShape(sectionType, inputs) {
  const shape = new THREE.Shape()

  if (sectionType === 'rectangular') {
    const w = inputs.width / 2
    const h = inputs.height / 2
    shape.moveTo(-w, -h)
    shape.lineTo(w, -h)
    shape.lineTo(w, h)
    shape.lineTo(-w, h)
    shape.closePath()
  } else if (sectionType === 'circular') {
    const r = inputs.diameter / 2
    shape.absarc(0, 0, r, 0, Math.PI * 2, false)
  } else if (sectionType === 'tube') {
    const R = inputs.outerDiameter / 2
    const r = inputs.innerDiameter / 2
    shape.absarc(0, 0, R, 0, Math.PI * 2, false)
    const hole = new THREE.Path()
    hole.absarc(0, 0, r, 0, Math.PI * 2, true)
    shape.holes.push(hole)
  }

  return shape
}

function applyStressColors(geometry, results, inputs) {
  const positions = geometry.attributes.position
  const count = positions.count
  const colors = new Float32Array(count * 3)

  const isCantilever = inputs.elementType === 'beam-cantilever'
  const isSupported = inputs.elementType === 'beam-supported'

  let minZ = Infinity, maxZ = -Infinity
  for (let i = 0; i < count; i++) {
    const z = positions.getZ(i)
    if (z < minZ) minZ = z
    if (z > maxZ) maxZ = z
  }
  const lengthRange = maxZ - minZ || 1

  const colorMap = {
    emerald: { r: 0.063, g: 0.725, b: 0.506 },
    amber:   { r: 0.961, g: 0.620, b: 0.043 },
    red:     { r: 0.937, g: 0.267, b: 0.267 },
  }
  const baseColor = colorMap[results.zoneColor] || colorMap.emerald

  for (let i = 0; i < count; i++) {
    const z = positions.getZ(i)
    const t = (z - minZ) / lengthRange

    let intensity
    if (isCantilever || inputs.elementType === 'plate' || inputs.elementType === 'rod') {
      intensity = 1.0 - t * 0.7
    } else if (isSupported) {
      intensity = 1.0 - Math.abs(t - 0.5) * 2 * 0.7
    } else {
      intensity = 0.8
    }

    const gray = { r: 0.2, g: 0.255, b: 0.333 }
    colors[i * 3]     = gray.r + (baseColor.r - gray.r) * intensity
    colors[i * 3 + 1] = gray.g + (baseColor.g - gray.g) * intensity
    colors[i * 3 + 2] = gray.b + (baseColor.b - gray.b) * intensity
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
}

function computeDeflectionAtT(t, maxDeflection, inputs) {
  const isCantilever = inputs.elementType === 'beam-cantilever'
  const isSupported = inputs.elementType === 'beam-supported'

  if (isCantilever || inputs.elementType === 'plate' || inputs.elementType === 'rod') {
    return maxDeflection * (3 * t * t - t * t * t) / 2
  } else if (isSupported) {
    return maxDeflection * 4 * t * (1 - t)
  }
  return 0
}

function applyDeflection(geometry, results, inputs, factor) {
  if (!results || results.dynamicDeflection <= 0) return

  const positions = geometry.attributes.position
  const count = positions.count
  const maxDeflection = Math.min(results.dynamicDeflection * 0.01, 0.6) * factor

  let minZ = Infinity, maxZ = -Infinity
  for (let i = 0; i < count; i++) {
    const z = positions.getZ(i)
    if (z < minZ) minZ = z
    if (z > maxZ) maxZ = z
  }
  const lengthRange = maxZ - minZ || 1

  // Сохраняем оригинальные позиции при первом вызове
  if (!geometry.userData.originalY) {
    geometry.userData.originalY = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      geometry.userData.originalY[i] = positions.getY(i)
    }
  }

  for (let i = 0; i < count; i++) {
    const z = positions.getZ(i)
    const t = (z - minZ) / lengthRange
    const deflection = computeDeflectionAtT(t, maxDeflection, inputs)
    positions.setY(i, geometry.userData.originalY[i] - deflection)
  }

  positions.needsUpdate = true
  geometry.computeVertexNormals()
}

// --- 3D компоненты ---

function BeamMesh({ results, inputs, isAnimating }) {
  const meshRef = useRef()
  const deflectionFactor = useRef(0)
  const prevResults = useRef(null)

  const baseGeometry = useMemo(() => {
    const shape = createSectionShape(inputs.sectionType, inputs)
    const scale = 0.01
    const length = inputs.length * scale

    const extrudeSettings = {
      steps: 64,
      depth: length,
      bevelEnabled: false,
    }

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geo.scale(scale, scale, 1)
    geo.translate(0, 0, -length / 2)

    if (results) {
      applyStressColors(geo, results, inputs)
    }

    return geo
  }, [inputs.sectionType, inputs.length, inputs.width, inputs.height,
      inputs.diameter, inputs.outerDiameter, inputs.innerDiameter, results])

  // Сбрасываем анимацию при новом результате
  useEffect(() => {
    if (results && results !== prevResults.current) {
      deflectionFactor.current = 0
      prevResults.current = results
    }
  }, [results])

  // Анимация прогиба
  useFrame((_, delta) => {
    if (!results || !baseGeometry) return

    if (deflectionFactor.current < 1) {
      deflectionFactor.current = Math.min(deflectionFactor.current + delta * 2, 1)
      applyDeflection(baseGeometry, results, inputs, deflectionFactor.current)
    }
  })

  const material = useMemo(() => {
    if (results) {
      return new THREE.MeshStandardMaterial({
        vertexColors: true,
        metalness: 0.3,
        roughness: 0.6,
        side: THREE.DoubleSide,
      })
    }
    return new THREE.MeshStandardMaterial({
      color: '#475569',
      metalness: 0.4,
      roughness: 0.5,
      side: THREE.DoubleSide,
    })
  }, [results])

  return <mesh ref={meshRef} geometry={baseGeometry} material={material} />
}

function Support({ inputs }) {
  const isCantilever = inputs.elementType === 'beam-cantilever'
  const isSupported = inputs.elementType === 'beam-supported'
  const beamLength = inputs.length * 0.01
  const halfLength = beamLength / 2

  // Определяем размер сечения для масштабирования опоры
  let sectionSize = 0.3
  if (inputs.sectionType === 'rectangular') {
    sectionSize = Math.max(inputs.width, inputs.height) * 0.01
  } else if (inputs.sectionType === 'circular') {
    sectionSize = inputs.diameter * 0.01
  } else if (inputs.sectionType === 'tube') {
    sectionSize = inputs.outerDiameter * 0.01
  }
  const supportHeight = Math.max(sectionSize * 2.5, 1.2)

  if (isCantilever || inputs.elementType === 'plate' || inputs.elementType === 'rod') {
    return (
      <mesh position={[-0.15, 0, -halfLength]}>
        <boxGeometry args={[0.3, supportHeight, 0.15]} />
        <meshStandardMaterial color="#334155" metalness={0.2} roughness={0.8} />
      </mesh>
    )
  }

  if (isSupported) {
    const triShape = new THREE.Shape()
    triShape.moveTo(0, 0)
    triShape.lineTo(0.15, -0.25)
    triShape.lineTo(-0.15, -0.25)
    triShape.closePath()

    const triGeo = new THREE.ExtrudeGeometry(triShape, { depth: 0.15, bevelEnabled: false })
    triGeo.translate(0, 0, -0.075)

    return (
      <group>
        <mesh position={[0, -sectionSize / 2, -halfLength]} geometry={triGeo}>
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, -sectionSize / 2, halfLength]} geometry={triGeo}>
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>
    )
  }

  return null
}

function Impactor({ results, inputs, isAnimating }) {
  const ref = useRef()
  const beamLength = inputs.length * 0.01
  const halfLength = beamLength / 2
  const isCantilever = inputs.elementType === 'beam-cantilever'

  const impactZ = isCantilever || inputs.elementType === 'plate' || inputs.elementType === 'rod'
    ? halfLength : 0

  const baseY = 0.8
  const targetY = 0.3
  const posY = useRef(baseY)

  useFrame((_, delta) => {
    if (!ref.current) return
    const target = results ? targetY : baseY
    posY.current = THREE.MathUtils.lerp(posY.current, target, delta * 4)
    ref.current.position.y = posY.current
  })

  return (
    <group position={[0, baseY, impactZ]} ref={ref}>
      <mesh>
        <boxGeometry args={[0.3, 0.25, 0.3]} />
        <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

function ImpactParticles({ results, inputs, isAnimating }) {
  const groupRef = useRef()
  const particles = useRef([])
  const initialized = useRef(false)

  const beamLength = inputs.length * 0.01
  const halfLength = beamLength / 2
  const isCantilever = inputs.elementType === 'beam-cantilever'
  const impactZ = isCantilever || inputs.elementType === 'plate' || inputs.elementType === 'rod'
    ? halfLength : 0

  useEffect(() => {
    if (isAnimating && !initialized.current) {
      initialized.current = true
      particles.current = Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2
        return {
          velocity: new THREE.Vector3(
            Math.cos(angle) * (1.5 + Math.random()),
            1.5 + Math.random() * 2,
            Math.sin(angle) * (1.5 + Math.random())
          ),
          position: new THREE.Vector3(0, 0.3, impactZ),
          life: 1.0,
        }
      })
    }
    if (!isAnimating) {
      initialized.current = false
      particles.current = []
    }
  }, [isAnimating, impactZ])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const children = groupRef.current.children
    particles.current.forEach((p, i) => {
      if (p.life <= 0) return
      p.life -= delta * 2
      p.velocity.y -= delta * 5
      p.position.addScaledVector(p.velocity, delta)
      if (children[i]) {
        children[i].position.copy(p.position)
        children[i].scale.setScalar(Math.max(p.life, 0))
        children[i].visible = p.life > 0
      }
    })
  })

  if (!isAnimating || particles.current.length === 0) return null

  return (
    <group ref={groupRef}>
      {particles.current.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// --- Главный компонент ---

export default function BeamVisualization3DCanvas({ results, inputs, isAnimating }) {
  const zoneColor = results?.zoneColor || 'emerald'

  const sectionName = inputs.sectionType === 'rectangular' ? 'Прямоугольное'
    : inputs.sectionType === 'circular' ? 'Круглое' : 'Трубное'

  const zoneStrokeColor = zoneColor === 'emerald' ? '#10b981'
    : zoneColor === 'amber' ? '#f59e0b' : '#ef4444'

  const isSimplified = inputs.elementType === 'plate' || inputs.elementType === 'rod'

  return (
    <div className="glass rounded-2xl p-6 mb-6 overflow-hidden">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Eye className="text-purple-400" size={20} />
        Визуализация нагружения
        {isSimplified && (
          <span className="ml-2 text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">Упрощённая модель</span>
        )}
      </h3>

      <div className="bg-slate-950 rounded-xl overflow-hidden relative h-[300px] md:h-[450px]">
        <Canvas
          camera={{ position: [3, 2, 3], fov: 45, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: '#0f172a' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-3, 2, -3]} intensity={0.3} />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1.5}
            maxDistance={10}
            autoRotate={!results}
            autoRotateSpeed={0.5}
          />

          <ContactShadows position={[0, -0.8, 0]} opacity={0.3} scale={8} blur={2} />

          <BeamMesh results={results} inputs={inputs} isAnimating={isAnimating} />
          <Support inputs={inputs} />
          <Impactor results={results} inputs={inputs} isAnimating={isAnimating} />
          <ImpactParticles results={results} inputs={inputs} isAnimating={isAnimating} />

          <gridHelper args={[10, 20, '#1e293b', '#1e293b']} position={[0, -0.8, 0]} />
        </Canvas>

        {results && (
          <div className="absolute top-4 right-4 glass rounded-lg px-3 py-2">
            <span className="text-xs text-slate-400">Прогиб: </span>
            <span className="text-sm font-bold" style={{ color: zoneStrokeColor }}>
              {results.dynamicDeflection.toFixed(1)} мм
            </span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 text-xs text-slate-500">
          L = {inputs.length} мм &bull; {sectionName} сечение
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <div className="w-24 h-2 rounded" style={{
            background: 'linear-gradient(90deg, #10b981, #f59e0b, #ef4444)'
          }} />
          <span className="text-xs text-slate-500">&sigma;</span>
        </div>

        <div className="absolute top-4 left-4 text-xs text-slate-600">
          Вращение &bull; Scroll — зум
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-slate-600 rounded-sm" />
          {inputs.elementType === 'beam-cantilever' || isSimplified ? 'Заделка' : 'Опоры'}
        </span>
        <span>
          {inputs.elementType === 'beam-cantilever' && 'Консольная балка'}
          {inputs.elementType === 'beam-supported' && 'Балка на опорах'}
          {inputs.elementType === 'plate' && 'Пластина (упрощ.)'}
          {inputs.elementType === 'rod' && 'Стержень (упрощ.)'}
          {' \u2022 L = '}{inputs.length} мм &bull; {sectionName} сечение
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-amber-500 rounded-full" /> Удар
        </span>
      </div>
    </div>
  )
}
