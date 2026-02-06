import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef, useState, useEffect } from 'react'
import { Eye } from 'lucide-react'

// --- Утилиты ---

function getSectionDimensions(inputs) {
  const scale = 0.01
  if (inputs.sectionType === 'rectangular') {
    return {
      width: inputs.width * scale,
      height: inputs.height * scale,
      halfHeight: inputs.height * scale / 2,
      maxDim: Math.max(inputs.width, inputs.height) * scale,
    }
  } else if (inputs.sectionType === 'circular') {
    return {
      width: inputs.diameter * scale,
      height: inputs.diameter * scale,
      halfHeight: inputs.diameter * scale / 2,
      maxDim: inputs.diameter * scale,
    }
  } else {
    return {
      width: inputs.outerDiameter * scale,
      height: inputs.outerDiameter * scale,
      halfHeight: inputs.outerDiameter * scale / 2,
      maxDim: inputs.outerDiameter * scale,
    }
  }
}

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

function CameraController({ inputs }) {
  const { camera } = useThree()
  const beamLength = inputs.length * 0.01
  const sec = getSectionDimensions(inputs)

  useEffect(() => {
    const dist = Math.max(beamLength * 0.8, sec.maxDim * 3, 2)
    camera.position.set(dist * 0.6, dist * 0.4, dist * 0.6)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [inputs.length, inputs.sectionType, inputs.width, inputs.height,
      inputs.diameter, inputs.outerDiameter, camera, beamLength, sec.maxDim])

  return null
}

function SceneSetup({ inputs }) {
  const beamLength = inputs.length * 0.01
  const sec = getSectionDimensions(inputs)
  const gridSize = Math.max(beamLength * 2, sec.maxDim * 4, 4)
  const floorY = -(sec.halfHeight + 0.4)

  return (
    <>
      <gridHelper args={[gridSize, 20, '#1e293b', '#1e293b']} position={[0, floorY, 0]} />
      <ContactShadows position={[0, floorY, 0]} opacity={0.3} scale={gridSize} blur={2} />
    </>
  )
}

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

  useEffect(() => {
    if (results && results !== prevResults.current) {
      deflectionFactor.current = 0
      prevResults.current = results
    }
  }, [results])

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
  const sec = getSectionDimensions(inputs)

  const supportHeight = Math.max(sec.maxDim * 2.5, 1.2)
  const wallThickness = 0.15
  const wallWidth = sec.maxDim * 1.4

  if (isCantilever || inputs.elementType === 'plate' || inputs.elementType === 'rod') {
    return (
      <mesh position={[-wallThickness / 2, 0, -halfLength]}>
        <boxGeometry args={[wallThickness, supportHeight, Math.max(wallWidth, 0.3)]} />
        <meshStandardMaterial color="#334155" metalness={0.2} roughness={0.8} />
      </mesh>
    )
  }

  if (isSupported) {
    const triScale = Math.max(sec.maxDim * 0.7, 0.2)
    const triShape = new THREE.Shape()
    triShape.moveTo(0, 0)
    triShape.lineTo(triScale, -triScale * 1.5)
    triShape.lineTo(-triScale, -triScale * 1.5)
    triShape.closePath()

    const triGeo = new THREE.ExtrudeGeometry(triShape, { depth: triScale, bevelEnabled: false })
    triGeo.translate(0, 0, -triScale / 2)

    return (
      <group>
        <mesh position={[0, -sec.halfHeight, -halfLength]} geometry={triGeo}>
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, -sec.halfHeight, halfLength]} geometry={triGeo}>
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
  const sec = getSectionDimensions(inputs)

  const impactZ = isCantilever || inputs.elementType === 'plate' || inputs.elementType === 'rod'
    ? halfLength : 0

  const targetY = sec.halfHeight + 0.15
  const baseY = sec.halfHeight + 0.8
  const posY = useRef(baseY)

  useEffect(() => {
    posY.current = baseY
  }, [baseY])

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
  const sec = getSectionDimensions(inputs)
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
          position: new THREE.Vector3(0, sec.halfHeight + 0.15, impactZ),
          life: 1.0,
        }
      })
    }
    if (!isAnimating) {
      initialized.current = false
      particles.current = []
    }
  }, [isAnimating, impactZ, sec.halfHeight])

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
  const beamLength = inputs.length * 0.01

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

          <CameraController inputs={inputs} />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={Math.max(beamLength * 0.3, 1)}
            maxDistance={Math.max(beamLength * 3, 10)}
            autoRotate={!results}
            autoRotateSpeed={0.5}
          />

          <SceneSetup inputs={inputs} />

          <BeamMesh results={results} inputs={inputs} isAnimating={isAnimating} />
          <Support inputs={inputs} />
          <Impactor results={results} inputs={inputs} isAnimating={isAnimating} />
          <ImpactParticles results={results} inputs={inputs} isAnimating={isAnimating} />
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
