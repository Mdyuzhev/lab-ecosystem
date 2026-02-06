# Задача: Исправления 3D визуализации балки — адаптивность к настройкам

> Проект: `E:\Politech\lab-ecosystem`  
> Приоритет: Высокий  
> Оценка: 1.5-2 часа  
> Ветка: `feat/threejs-beam` (продолжаем)

---

## Контекст

Three.js визуализация (`src/components/BeamVisualization3DCanvas.jsx`) реализована и работает. Нужно исправить проблемы, которые проявляются при переключении настроек (тип элемента, тип сечения, размеры).

---

## Исправление 1: Камера не адаптируется к размеру балки

**Проблема**: Камера зафиксирована в `position={[3, 2, 3]}`. При длине балки 100мм (1.0 единица сцены) — камера далеко, балка крошечная. При 2000мм (20 единиц) — камера внутри балки.

**Решение**: Вычислять позицию камеры динамически на основе длины балки. Создать компонент `CameraController`:

```jsx
import { useThree } from '@react-three/fiber'

function CameraController({ inputs }) {
  const { camera } = useThree()
  const beamLength = inputs.length * 0.01

  useEffect(() => {
    // Расстояние камеры пропорционально длине балки
    const dist = Math.max(beamLength * 0.8, 2)
    camera.position.set(dist * 0.6, dist * 0.4, dist * 0.6)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [inputs.length, camera])

  return null
}
```

Добавить `<CameraController inputs={inputs} />` внутрь Canvas, рядом с OrbitControls.

Также обновить `minDistance` и `maxDistance` в OrbitControls:

```jsx
<OrbitControls
  minDistance={Math.max(beamLength * 0.3, 1)}
  maxDistance={Math.max(beamLength * 3, 10)}
  ...
/>
```

Для этого вынести `beamLength` в основной компонент и прокинуть.

---

## Исправление 2: gridHelper и ContactShadows не масштабируются

**Проблема**: `gridHelper args={[10, 20, ...]}` и `ContactShadows scale={8}` фиксированы. При короткой балке (100мм) сетка огромная. При длинной (2000мм) — маленькая.

**Решение**: Масштабировать относительно длины балки:

```jsx
const gridSize = Math.max(beamLength * 2, 4)

<gridHelper args={[gridSize, 20, '#1e293b', '#1e293b']} position={[0, -0.8, 0]} />
<ContactShadows position={[0, -0.8, 0]} opacity={0.3} scale={gridSize} blur={2} />
```

---

## Исправление 3: Позиция заделки не учитывает размер сечения

**Проблема**: Заделка (box в Support) позиционирована с `position={[-0.15, 0, -halfLength]}` — смещение -0.15 по X фиксировано. Для больших сечений (D=100мм) заделка не касается балки, для маленьких (D=10мм) — пересекается.

**Решение**: Вычислять ширину заделки и её позицию по X на основе размера сечения:

```jsx
// Ширина/высота заделки
let sectionW = 0.3
if (inputs.sectionType === 'rectangular') {
  sectionW = inputs.width * 0.01
} else if (inputs.sectionType === 'circular') {
  sectionW = inputs.diameter * 0.01
} else if (inputs.sectionType === 'tube') {
  sectionW = inputs.outerDiameter * 0.01
}

const wallThickness = 0.15
const wallWidth = sectionW * 1.4  // чуть шире сечения

// Позиция: вплотную к торцу балки
<mesh position={[-wallThickness / 2, 0, -halfLength]}>
  <boxGeometry args={[wallThickness, supportHeight, wallWidth]} />
  <meshStandardMaterial color="#334155" metalness={0.2} roughness={0.8} />
</mesh>
```

---

## Исправление 4: Ударник может пересекаться с балкой

**Проблема**: Ударник опускается до `targetY = 0.3`. При большом сечении (height=60мм → 0.3 единицы, radius=50мм → 0.25) верхняя грань балки на Y ≈ 0.3, и ударник врезается в балку.

**Решение**: Вычислять targetY динамически:

```jsx
// В Impactor:
let sectionHalf = 0.15  // половина высоты сечения в единицах сцены
if (inputs.sectionType === 'rectangular') {
  sectionHalf = inputs.height * 0.01 / 2
} else if (inputs.sectionType === 'circular') {
  sectionHalf = inputs.diameter * 0.01 / 2
} else if (inputs.sectionType === 'tube') {
  sectionHalf = inputs.outerDiameter * 0.01 / 2
}

const targetY = sectionHalf + 0.15  // чуть выше верхней грани балки
const baseY = sectionHalf + 0.8     // начальная позиция — высоко над балкой
```

---

## Исправление 5: Опоры для балки на опорах не масштабируются

**Проблема**: Треугольные опоры (SimpleSupports) имеют фиксированный размер (0.15, -0.25). При крупной балке опоры мелкие и незаметны.

**Решение**: Масштабировать размер опор пропорционально сечению:

```jsx
if (isSupported) {
  const triScale = Math.max(sectionSize * 0.7, 0.2)
  const triShape = new THREE.Shape()
  triShape.moveTo(0, 0)
  triShape.lineTo(triScale, -triScale * 1.5)
  triShape.lineTo(-triScale, -triScale * 1.5)
  triShape.closePath()

  const triGeo = new THREE.ExtrudeGeometry(triShape, { depth: triScale, bevelEnabled: false })
  triGeo.translate(0, 0, -triScale / 2)

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
```

---

## Исправление 6: Позиция Y пола (gridHelper, ContactShadows)

**Проблема**: Пол на Y = -0.8 фиксированно. При большом сечении балка касается пола, при маленьком — висит высоко.

**Решение**: Вычислять позицию пола:

```jsx
let sectionMaxY = 0.15
if (inputs.sectionType === 'rectangular') {
  sectionMaxY = inputs.height * 0.01 / 2
} else if (inputs.sectionType === 'circular') {
  sectionMaxY = inputs.diameter * 0.01 / 2
} else if (inputs.sectionType === 'tube') {
  sectionMaxY = inputs.outerDiameter * 0.01 / 2
}

const floorY = -(sectionMaxY + 0.4)  // пол ниже балки с зазором
```

Использовать `floorY` для gridHelper и ContactShadows. Прокинуть через общий компонент `SceneSetup`:

```jsx
function SceneSetup({ inputs }) {
  const beamLength = inputs.length * 0.01
  const gridSize = Math.max(beamLength * 2, 4)

  let sectionMaxY = 0.15
  if (inputs.sectionType === 'rectangular') sectionMaxY = inputs.height * 0.01 / 2
  else if (inputs.sectionType === 'circular') sectionMaxY = inputs.diameter * 0.01 / 2
  else if (inputs.sectionType === 'tube') sectionMaxY = inputs.outerDiameter * 0.01 / 2

  const floorY = -(sectionMaxY + 0.4)

  return (
    <>
      <gridHelper args={[gridSize, 20, '#1e293b', '#1e293b']} position={[0, floorY, 0]} />
      <ContactShadows position={[0, floorY, 0]} opacity={0.3} scale={gridSize} blur={2} />
    </>
  )
}
```

---

## Исправление 7: Вспомогательная функция для размеров сечения

Много дублирования при вычислении размеров сечения. Вынести в функцию:

```jsx
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
```

Использовать эту функцию в Support, Impactor, SceneSetup, CameraController.

---

## Порядок выполнения

1. Добавить `getSectionDimensions()` — утилита для всех компонентов
2. Добавить `CameraController` — камера адаптируется к длине
3. Добавить `SceneSetup` — пол и сетка масштабируются
4. Исправить `Support` — заделка и опоры пропорциональны сечению
5. Исправить `Impactor` — позиция Y зависит от размера сечения
6. Протестировать все комбинации (см. чеклист)

---

## Чеклист проверки

Для каждой комбинации нажать "Рассчитать" и проверить визуально:

### Тип элемента × Тип сечения (12 комбинаций):

- [ ] Консольная балка + Прямоугольное — заделка слева, прогиб к правому концу
- [ ] Консольная балка + Круглое — цилиндр, заделка касается торца
- [ ] Консольная балка + Труба — полый цилиндр виден при вращении
- [ ] Балка на опорах + Прямоугольное — две опоры по краям, прогиб в середине
- [ ] Балка на опорах + Круглое — цилиндр на двух опорах
- [ ] Балка на опорах + Труба — полый цилиндр на двух опорах
- [ ] Пластина + Прямоугольное — как консоль, метка "Упрощённая модель"
- [ ] Пластина + Круглое — цилиндр с заделкой
- [ ] Пластина + Труба — полый цилиндр с заделкой
- [ ] Стержень + Прямоугольное — как консоль
- [ ] Стержень + Круглое — тонкий цилиндр
- [ ] Стержень + Труба — тонкая полая труба

### Граничные размеры:

- [ ] Длина 100мм — балка компактная, камера не внутри
- [ ] Длина 2000мм — балка длинная, камера охватывает всю
- [ ] Сечение 10×5мм — тонкая балка, опоры пропорциональны
- [ ] Сечение 100×80мм — толстая балка, ударник не пересекается
- [ ] Труба D50/D40 — стенка тонкая, дырка видна
- [ ] Труба D100/D20 — стенка толстая, дырка маленькая

### Переключение на лету:

- [ ] Переключить сечение rectangular → circular → tube БЕЗ пересчёта — серая балка меняет форму
- [ ] Переключить тип элемента cantilever → supported — опоры меняются
- [ ] Изменить длину с 500 на 1500 — камера и сетка подстроились
- [ ] Рассчитать, потом сменить сечение — визуализация сбросится или корректно обновится

---

## Коммит

```bash
git add -A
git commit -m "fix(viz): adaptive 3D scene scaling for all section types and sizes

- Add getSectionDimensions() utility
- Dynamic camera position based on beam length
- Scale grid, floor, shadows proportionally
- Scale supports and impactor to section size
- Fix wall support alignment with beam end face
- Fix impactor Y position for large cross-sections"

git push origin feat/threejs-beam
```

---

*Не менять логику расчёта. Не менять интерфейс props. Работать только в BeamVisualization3DCanvas.jsx.*
