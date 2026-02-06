# Задача: Замена SVG визуализации балки на Three.js (React Three Fiber)

> Проект: `E:\Politech\lab-ecosystem`  
> Приоритет: Высокий  
> Оценка: 3-4 часа  
> Ветка: `feat/threejs-beam`

---

## Проблема

Текущая визуализация в `src/components/BeamVisualization3D.jsx` использует SVG с псевдо-3D эффектом (три грани параллелепипеда через path + градиенты). Для прямоугольного сечения терпимо, но для **круглого и трубного** сечений выглядит криво — SVG не может корректно отрисовать цилиндрическую геометрию в перспективе. Каждый новый тип сечения требует ручного расчёта проекции.

## Решение

Заменить SVG-визуализацию на полноценный 3D-рендер через **React Three Fiber** (R3F). Three.js берёт контур сечения (Shape), выдавливает его на длину балки (ExtrudeGeometry), и сам считает грани, нормали, перспективу. Цветовая карта напряжений — через vertex colors. Деформация — модификация Y-координат вершин.

---

## ШАГ 0: Подготовка

```bash
cd E:\Politech\lab-ecosystem
git checkout -b feat/threejs-beam
npm install @react-three/fiber @react-three/drei three
npm run dev
```

Убедиться что dev-сервер стартует без ошибок.

---

## ШАГ 1: Создать новый компонент `BeamVisualization3DCanvas.jsx`

Путь: `src/components/BeamVisualization3DCanvas.jsx`

### 1.1 Интерфейс компонента (НЕ МЕНЯТЬ)

Новый компонент должен принимать **точно те же props**, что и текущий:

```jsx
export default function BeamVisualization3DCanvas({ results, inputs, isAnimating })
```

Где `inputs` содержит:
- `elementType`: `'beam-cantilever'` | `'beam-supported'` | `'plate'` | `'rod'`
- `sectionType`: `'rectangular'` | `'circular'` | `'tube'`
- `length`: число (мм)
- `width`, `height`: для rectangular (мм)
- `diameter`: для circular (мм)
- `outerDiameter`, `innerDiameter`: для tube (мм)
- `impactType`: `'energy'` | `'mass-velocity'`
- `impactEnergy`, `impactMass`, `impactVelocity`: параметры удара

Где `results` (может быть null до расчёта) содержит:
- `dynamicDeflection`: прогиб в мм
- `dynamicStress`: напряжение в МПа
- `yieldStrength`: предел текучести в МПа
- `ultimateStrength`: предел прочности в МПа
- `zoneColor`: `'emerald'` | `'amber'` | `'red'`
- `ZoneIcon`: React компонент иконки
- `zone`: строка описания зоны
- `safetyYield`, `safetyUltimate`, `bendingMoment`, `dynamicForce` и др.

### 1.2 Структура компонента

```jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef, useEffect } from 'react'
import { Eye } from 'lucide-react'

// Вспомогательная: создать Shape (контур) сечения
function createSectionShape(sectionType, inputs) { ... }

// Вспомогательная: vertex colors по распределению напряжений
function applyStressColors(geometry, results, inputs) { ... }

// Вспомогательная: деформация (прогиб) вершин
function applyDeflection(geometry, results, inputs) { ... }

// 3D-компонент балки внутри Canvas
function BeamMesh({ results, inputs, isAnimating }) { ... }

// 3D-компонент опоры (заделка или простые опоры)
function Support({ inputs }) { ... }

// 3D-компонент ударника
function Impactor({ results, inputs, isAnimating }) { ... }

// Основной экспортируемый компонент с Canvas
export default function BeamVisualization3DCanvas({ results, inputs, isAnimating }) { ... }
```

### 1.3 Создание контура сечения — `createSectionShape`

Это ключевая функция. Для каждого типа сечения создаём `THREE.Shape`:

```javascript
function createSectionShape(sectionType, inputs) {
  const shape = new THREE.Shape()

  if (sectionType === 'rectangular') {
    // Прямоугольник с центром в (0,0)
    const w = inputs.width / 2   // половина ширины (мм → условные единицы, масштаб ниже)
    const h = inputs.height / 2  // половина высоты
    shape.moveTo(-w, -h)
    shape.lineTo(w, -h)
    shape.lineTo(w, h)
    shape.lineTo(-w, h)
    shape.closePath()

  } else if (sectionType === 'circular') {
    // Круг
    const r = inputs.diameter / 2
    shape.absarc(0, 0, r, 0, Math.PI * 2, false)

  } else if (sectionType === 'tube') {
    // Внешний круг
    const R = inputs.outerDiameter / 2
    const r = inputs.innerDiameter / 2
    shape.absarc(0, 0, R, 0, Math.PI * 2, false)
    // Внутренний круг (hole)
    const hole = new THREE.Path()
    hole.absarc(0, 0, r, 0, Math.PI * 2, true) // true = по часовой = дырка
    shape.holes.push(hole)
  }

  return shape
}
```

### 1.4 Геометрия балки — `BeamMesh`

```javascript
function BeamMesh({ results, inputs, isAnimating }) {
  const meshRef = useRef()

  const geometry = useMemo(() => {
    const shape = createSectionShape(inputs.sectionType, inputs)

    // Масштаб: переводим мм в условные единицы сцены (1 единица = 10 мм)
    const scale = 0.01
    const length = inputs.length * scale  // длина по оси Z

    const extrudeSettings = {
      steps: 64,            // число сегментов по длине — важно для vertex colors и деформации
      depth: length,
      bevelEnabled: false,
    }

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)

    // Масштабируем shape (сечение) — оно задано в мм, приводим к единицам сцены
    geo.scale(scale, scale, 1)

    // Центрируем по длине
    geo.translate(0, 0, -length / 2)

    // Применяем vertex colors если есть результаты
    if (results) {
      applyStressColors(geo, results, inputs)
      applyDeflection(geo, results, inputs)
    }

    return geo
  }, [inputs.sectionType, inputs.length, inputs.width, inputs.height,
      inputs.diameter, inputs.outerDiameter, inputs.innerDiameter, results])

  // Материал: если есть результаты — vertexColors, иначе однотонный
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
      color: '#475569',    // slate-600 — нейтральная балка до расчёта
      metalness: 0.4,
      roughness: 0.5,
      side: THREE.DoubleSide,
    })
  }, [results])

  return <mesh ref={meshRef} geometry={geometry} material={material} />
}
```

### 1.5 Раскраска напряжений — `applyStressColors`

Распределение напряжений по длине балки:

```javascript
function applyStressColors(geometry, results, inputs) {
  const positions = geometry.attributes.position
  const count = positions.count
  const colors = new Float32Array(count * 3)

  const isCantilever = inputs.elementType === 'beam-cantilever'
  const isSupported = inputs.elementType === 'beam-supported'

  // Находим min/max Z для нормализации позиции по длине
  let minZ = Infinity, maxZ = -Infinity
  for (let i = 0; i < count; i++) {
    const z = positions.getZ(i)
    if (z < minZ) minZ = z
    if (z > maxZ) maxZ = z
  }
  const lengthRange = maxZ - minZ || 1

  // Цвета зон
  const colorMap = {
    emerald: { r: 0.063, g: 0.725, b: 0.506 },  // #10b981
    amber:   { r: 0.961, g: 0.620, b: 0.043 },   // #f59e0b
    red:     { r: 0.937, g: 0.267, b: 0.267 },    // #ef4444
  }
  const baseColor = colorMap[results.zoneColor] || colorMap.emerald

  for (let i = 0; i < count; i++) {
    const z = positions.getZ(i)
    const t = (z - minZ) / lengthRange  // 0 = заделка, 1 = свободный конец

    // Интенсивность напряжения вдоль балки
    let intensity
    if (isCantilever || inputs.elementType === 'plate' || inputs.elementType === 'rod') {
      // Консоль: max у заделки (t=0), min у свободного конца (t=1)
      intensity = 1.0 - t * 0.7
    } else if (isSupported) {
      // На опорах: max в середине (t=0.5), min у краёв
      intensity = 1.0 - Math.abs(t - 0.5) * 2 * 0.7
    } else {
      intensity = 0.8
    }

    // Интерполяция: от серого (#334155) к цвету зоны
    const gray = { r: 0.2, g: 0.255, b: 0.333 }
    colors[i * 3]     = gray.r + (baseColor.r - gray.r) * intensity
    colors[i * 3 + 1] = gray.g + (baseColor.g - gray.g) * intensity
    colors[i * 3 + 2] = gray.b + (baseColor.b - gray.b) * intensity
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
}
```

### 1.6 Деформация (прогиб) — `applyDeflection`

Модификация Y-координат вершин по формуле упругой линии:

```javascript
function applyDeflection(geometry, results, inputs) {
  if (!results || results.dynamicDeflection <= 0) return

  const positions = geometry.attributes.position
  const count = positions.count

  // Масштабированный прогиб (визуально заметный, но не чрезмерный)
  const maxDeflection = Math.min(results.dynamicDeflection * 0.01, 0.6)

  let minZ = Infinity, maxZ = -Infinity
  for (let i = 0; i < count; i++) {
    const z = positions.getZ(i)
    if (z < minZ) minZ = z
    if (z > maxZ) maxZ = z
  }
  const lengthRange = maxZ - minZ || 1

  const isCantilever = inputs.elementType === 'beam-cantilever'
  const isSupported = inputs.elementType === 'beam-supported'

  for (let i = 0; i < count; i++) {
    const z = positions.getZ(i)
    const t = (z - minZ) / lengthRange

    let deflection = 0
    if (isCantilever || inputs.elementType === 'plate' || inputs.elementType === 'rod') {
      // y(x) = δ * (3*(x/L)^2 - (x/L)^3) / 2 — упругая линия консоли
      deflection = maxDeflection * (3 * t * t - t * t * t) / 2
    } else if (isSupported) {
      // Параболическая аппроксимация: max в середине
      deflection = maxDeflection * 4 * t * (1 - t)
    }

    positions.setY(i, positions.getY(i) - deflection)
  }

  positions.needsUpdate = true
}
```

### 1.7 Опора — `Support`

```javascript
function Support({ inputs }) {
  const isCantilever = inputs.elementType === 'beam-cantilever'
  const isSupported = inputs.elementType === 'beam-supported'
  const beamLength = inputs.length * 0.01
  const halfLength = beamLength / 2

  if (isCantilever || inputs.elementType === 'plate' || inputs.elementType === 'rod') {
    // Заделка — прямоугольный блок с штриховой текстурой (или просто тёмный блок)
    return (
      <mesh position={[-0.15, 0, -halfLength]}>
        <boxGeometry args={[0.3, 1.2, 0.15]} />
        <meshStandardMaterial color="#334155" metalness={0.2} roughness={0.8} />
      </mesh>
    )
  }

  if (isSupported) {
    // Две треугольные опоры (призмы)
    const triShape = new THREE.Shape()
    triShape.moveTo(0, 0)
    triShape.lineTo(0.15, -0.25)
    triShape.lineTo(-0.15, -0.25)
    triShape.closePath()

    const triGeo = new THREE.ExtrudeGeometry(triShape, { depth: 0.15, bevelEnabled: false })
    triGeo.translate(0, 0, -0.075)

    return (
      <group>
        <mesh position={[0, -0.2, -halfLength]} geometry={triGeo}>
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, -0.2, halfLength]} geometry={triGeo}>
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>
    )
  }

  return null
}
```

### 1.8 Ударник — `Impactor`

```javascript
function Impactor({ results, inputs, isAnimating }) {
  const ref = useRef()
  const beamLength = inputs.length * 0.01
  const halfLength = beamLength / 2
  const isCantilever = inputs.elementType === 'beam-cantilever'

  // Позиция удара: конец для консоли, середина для балки на опорах
  const impactZ = isCantilever || inputs.elementType === 'plate' || inputs.elementType === 'rod'
    ? halfLength : 0

  // Высота над балкой
  const baseY = 0.8
  const impactY = results ? 0.3 : baseY

  // Метка энергии/массы
  const label = inputs.impactType === 'energy'
    ? `${inputs.impactEnergy}J`
    : `${inputs.impactMass}kg`

  return (
    <group position={[0, impactY, impactZ]} ref={ref}>
      {/* Тело ударника */}
      <mesh>
        <boxGeometry args={[0.3, 0.25, 0.3]} />
        <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Стрелка вниз */}
      <mesh position={[0, -0.2, 0]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}
```

### 1.9 Главный компонент с Canvas

```jsx
export default function BeamVisualization3DCanvas({ results, inputs, isAnimating }) {
  const zoneColor = results?.zoneColor || 'emerald'

  // Подписи (HTML overlay)
  const deflectionText = results ? `δ = ${results.dynamicDeflection.toFixed(1)} мм` : ''
  const lengthText = `L = ${inputs.length} мм`
  const sectionName = inputs.sectionType === 'rectangular' ? 'Прямоугольное'
    : inputs.sectionType === 'circular' ? 'Круглое' : 'Трубное'

  const zoneStrokeColor = zoneColor === 'emerald' ? '#10b981'
    : zoneColor === 'amber' ? '#f59e0b' : '#ef4444'

  return (
    <div className="glass rounded-2xl p-6 mb-6 overflow-hidden">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Eye className="text-purple-400" size={20} />
        Визуализация нагружения
      </h3>

      {/* 3D Canvas */}
      <div className="bg-slate-950 rounded-xl overflow-hidden relative" style={{ height: '450px' }}>
        <Canvas
          camera={{ position: [3, 2, 3], fov: 45, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: '#0f172a' }}
        >
          {/* Освещение */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-3, 2, -3]} intensity={0.3} />

          {/* Управление камерой */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1.5}
            maxDistance={10}
            autoRotate={!results}
            autoRotateSpeed={0.5}
          />

          {/* Тень на "полу" */}
          <ContactShadows position={[0, -0.8, 0]} opacity={0.3} scale={8} blur={2} />

          {/* Балка */}
          <BeamMesh results={results} inputs={inputs} isAnimating={isAnimating} />

          {/* Опоры */}
          <Support inputs={inputs} />

          {/* Ударник */}
          <Impactor results={results} inputs={inputs} isAnimating={isAnimating} />

          {/* Сетка на полу (необязательно, но красиво) */}
          <gridHelper args={[10, 20, '#1e293b', '#1e293b']} position={[0, -0.8, 0]} />
        </Canvas>

        {/* HTML overlays поверх Canvas */}
        {results && (
          <div className="absolute top-4 right-4 glass rounded-lg px-3 py-2">
            <span className="text-xs text-slate-400">Прогиб: </span>
            <span className="text-sm font-bold" style={{ color: zoneStrokeColor }}>
              {results.dynamicDeflection.toFixed(1)} мм
            </span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 text-xs text-slate-500">
          {lengthText} • {sectionName} сечение
        </div>

        {/* Легенда */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <div className="w-24 h-2 rounded" style={{
            background: 'linear-gradient(90deg, #10b981, #f59e0b, #ef4444)'
          }} />
          <span className="text-xs text-slate-500">σ</span>
        </div>

        {/* Подсказка управления */}
        <div className="absolute top-4 left-4 text-xs text-slate-600">
          🖱 Вращение • Scroll — зум
        </div>
      </div>

      {/* Подписи */}
      <div className="flex justify-between items-center mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-slate-600 rounded-sm" />
          {inputs.elementType === 'beam-cantilever' || inputs.elementType === 'plate' || inputs.elementType === 'rod' ? 'Заделка' : 'Опоры'}
        </span>
        <span>
          {inputs.elementType === 'beam-cantilever' && 'Консольная балка'}
          {inputs.elementType === 'beam-supported' && 'Балка на опорах'}
          {inputs.elementType === 'plate' && 'Пластина (упрощ.)'}
          {inputs.elementType === 'rod' && 'Стержень (упрощ.)'}
          {' • L = '}{inputs.length} мм • {sectionName} сечение
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-amber-500 rounded-full" /> Удар
        </span>
      </div>
    </div>
  )
}
```

---

## ШАГ 2: Подключить новый компонент в ImpactCalculator

Файл: `src/pages/tools/ImpactCalculator.jsx`

### 2.1 Заменить импорт

```diff
- import BeamVisualization3D from '../../components/BeamVisualization3D'
+ import BeamVisualization3DCanvas from '../../components/BeamVisualization3DCanvas'
```

### 2.2 Заменить использование (строка ~после кнопки "Рассчитать")

```diff
  <div className="mt-8">
-   <BeamVisualization3D results={results} inputs={inputs} isAnimating={isAnimating} />
+   <BeamVisualization3DCanvas results={results} inputs={inputs} isAnimating={isAnimating} />
  </div>
```

### 2.3 НЕ удалять `BeamVisualization3D.jsx` — оставить для отката.

---

## ШАГ 3: Тонкая настройка 3D-сцены

После того как базовая версия заработает, настроить:

### 3.1 Масштаб сцены

Все размеры в inputs — в миллиметрах. Конвертация: `value * 0.01` даёт единицы сцены где 1 = 100мм. Подобрать масштаб так, чтобы балка L=500мм занимала примерно 60-70% ширины viewport.

### 3.2 Камера

Начальная позиция камеры должна показывать балку под углом ~30° сверху-сбоку, чтобы было видно и сечение торца, и длину, и деформацию. Примерно: `position={[3, 2, 3]}`, `fov: 45`.

### 3.3 Анимация прогиба

При первом расчёте (когда `results` из `null` становится объектом) — анимировать деформацию. Использовать `useFrame` из R3F для плавной интерполяции позиций вершин от прямой балки к деформированной за ~0.5 секунды. Ключевая идея: хранить в `useRef` текущий коэффициент деформации (0→1), в `useFrame` плавно увеличивать, на каждом кадре пересчитывать позиции вершин.

### 3.4 Анимация ударника

При `isAnimating === true` — ударник падает сверху к точке удара (Y от 0.8 до 0.3) с эффектом пружины. Использовать `useFrame` + `THREE.MathUtils.lerp`.

### 3.5 Частицы при ударе

При `isAnimating` — создать группу из 8-12 маленьких сфер (`sphereGeometry args={[0.02]}`) с `emissive: '#fbbf24'`, которые разлетаются от точки удара и затухают. Анимация через `useFrame`.

---

## ШАГ 4: Адаптивность

Canvas R3F автоматически занимает размер контейнера. Контейнер задан через `style={{ height: '450px' }}`. На мобильных (`<768px`) уменьшить до `height: '300px'`. Использовать Tailwind responsive: `className="h-[300px] md:h-[450px]"`.

OrbitControls на тачскринах работают из коробки (pinch to zoom, drag to rotate).

---

## ШАГ 5: Проверка

```bash
npm run build
npm run preview
```

### Чеклист:

- [ ] Прямоугольное сечение отображается как 3D параллелепипед
- [ ] Круглое сечение — как полноценный цилиндр
- [ ] Трубное сечение — как полый цилиндр (видна труба при вращении)
- [ ] Цветовая карта напряжений корректно ложится на поверхность
- [ ] Деформация (прогиб) визуально соответствует типу балки
- [ ] Консоль прогибается к свободному концу
- [ ] Балка на опорах прогибается посередине
- [ ] Ударник расположен в правильном месте (конец / середина)
- [ ] Камера вращается мышью / тачпадом
- [ ] Зум работает
- [ ] Работает без results (серая балка до расчёта)
- [ ] После расчёта — анимация удара и деформации
- [ ] Нет ошибок в консоли
- [ ] Build проходит без ошибок
- [ ] GitHub Pages деплой работает (проверить через `npm run build`)
- [ ] Производительность ≥ 30fps на среднем устройстве

---

## ШАГ 6: Коммит

```bash
git add -A
git commit -m "feat(viz): replace SVG beam with Three.js 3D visualization

- Add React Three Fiber + drei for 3D rendering
- ExtrudeGeometry from section Shape for all profiles
- Vertex colors for stress distribution along beam
- Deflection via vertex displacement
- OrbitControls for interactive rotation/zoom
- Animated impact and deformation
- Support for rectangular, circular, tube cross-sections
- Keep old SVG component as BeamVisualization3D (backup)"

git push origin feat/threejs-beam
```

---

## Ограничения

- **НЕ менять** логику расчёта в `ImpactCalculator.jsx` — только подключение визуализации
- **НЕ менять** интерфейс props (`results`, `inputs`, `isAnimating`)
- **НЕ удалять** старый `BeamVisualization3D.jsx`
- **НЕ добавлять** GSAP или другие анимационные библиотеки — только `useFrame` из R3F
- Допустимые новые зависимости: `@react-three/fiber`, `@react-three/drei`, `three`
- Бандл: +150-180KB gzip допустимо

---

## Важные нюансы Three.js

1. **ExtrudeGeometry + Shape.holes** — для трубного сечения дырка задаётся через `shape.holes.push(holePath)`. Path дырки должен идти **по часовой стрелке** (`absarc(..., true)`) чтобы Three.js корректно вычислил нормали.

2. **vertexColors** — `MeshStandardMaterial({ vertexColors: true })` включает чтение цвета из `geometry.attributes.color`. Атрибут должен быть `BufferAttribute(Float32Array, 3)` — RGB от 0 до 1.

3. **geometry.translate** — вызывать ПОСЛЕ `scale`, иначе смещение масштабируется.

4. **steps в ExtrudeGeometry** — чем больше, тем плавнее деформация и цветовая карта, но тяжелее. 64 — хороший баланс. Для мобильных можно снизить до 32.

5. **OrbitControls из @react-three/drei** — не из `three/examples`. Drei-версия работает декларативно как React компонент.

6. **ContactShadows** — простая мягкая тень на "полу", визуально заземляет объект. Не требует настройки shadowMap.

---

*Работать автономно. Приоритет: сначала добиться корректного отображения трёх типов сечений (rectangular, circular, tube) без деформации. Затем добавить vertex colors. Затем деформацию. Затем анимации. Инкрементально.*
