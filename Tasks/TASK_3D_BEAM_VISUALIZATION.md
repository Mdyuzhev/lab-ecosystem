# Задача: 3D визуализация ударного нагружения балки

> Проект: `E:\Politech\lab-ecosystem`  
> Файл: `src/pages/tools/ImpactCalculator.jsx`  
> Компонент для замены: `StressVisualization`  
> Ветка: `feat/3d-beam-visualization`  
> Оценка: 2-3 часа

---

## Контекст

В проекте есть калькулятор ударных нагрузок (`/tools/impact-calculator`). Расчётная часть работает корректно — **не трогать**. Нужно заменить плоскую 2D визуализацию балки на красивую SVG-визуализацию с 3D-эффектом, анимацией удара, реалистичной кривой прогиба и тепловой картой напряжений.

**Стек:** React 18, Vite, Tailwind CSS, Framer Motion, Lucide React. Деплой — GitHub Pages.

**Текущее состояние:** Компонент `StressVisualization` (~100 строк) внутри файла `ImpactCalculator.jsx` рисует:
- Заделку (hatched div)
- Плоскую полоску-балку с CSS-градиентом
- Ударник (div-блок со стрелкой)
- Метку прогиба и шкалу напряжений

**Целевое состояние:** Полноценная SVG-визуализация с перспективой, реалистичной деформацией и анимациями.

---

## ШАГ 0: Подготовка

```bash
cd E:\Politech\lab-ecosystem
git checkout -b feat/3d-beam-visualization
npm run dev
```

Открой `http://localhost:3000/tools/impact-calculator`, убедись что калькулятор работает.

---

## ШАГ 1: Создать новый компонент BeamVisualization3D

Путь: `src/components/BeamVisualization3D.jsx`

**НЕ редактировать** `StressVisualization` внутри `ImpactCalculator.jsx` — создать новый компонент отдельным файлом и подключить вместо старого.

### 1.1 Общая структура SVG-сцены

```
viewBox="0 0 800 400"
```

Сцена включает (снизу вверх по слоям):

1. **Фон** — тёмная сетка с перспективным эффектом
2. **Тень балки** — размытый эллипс под балкой
3. **Балка** — 3D-параллелепипед из трёх граней (верх, фронт, бок) с тепловой картой напряжений
4. **Кривая прогиба** — реальная форма упругой линии (cubic bezier)
5. **Заделка** — штриховка стены
6. **Ударник** — падающий груз с анимацией
7. **Аннотации** — размеры, метки, значения

### 1.2 Изометрическая балка (3D-эффект)

Балка — это параллелепипед, нарисованный тремя SVG `<polygon>`. Используем простую изометрическую проекцию через skew:

```
Верхняя грань:  4 точки — ромб, виден сверху
Фронтальная:    4 точки — прямоугольник (основная видимая часть)
Боковая (торец): 4 точки — параллелограмм справа
```

**Координаты базовой (недеформированной) балки:**

```javascript
// Параметры изометрии
const ISO_ANGLE = 15 // градусов наклона верхней грани
const BEAM_X = 100   // начало балки (после заделки)
const BEAM_Y = 200   // центральная линия
const BEAM_W = 550   // длина балки в px
const BEAM_H = 30    // высота фронтальной грани
const BEAM_D = 15    // "глубина" (видимая ширина верхней грани)

// Фронтальная грань (основная)
const frontFace = [
  [BEAM_X, BEAM_Y - BEAM_H/2],              // top-left
  [BEAM_X + BEAM_W, BEAM_Y - BEAM_H/2],     // top-right
  [BEAM_X + BEAM_W, BEAM_Y + BEAM_H/2],     // bottom-right
  [BEAM_X, BEAM_Y + BEAM_H/2],              // bottom-left
]

// Верхняя грань (создаёт 3D эффект)
const topFace = [
  [BEAM_X, BEAM_Y - BEAM_H/2],                          // front-left
  [BEAM_X + BEAM_W, BEAM_Y - BEAM_H/2],                 // front-right
  [BEAM_X + BEAM_W + BEAM_D, BEAM_Y - BEAM_H/2 - BEAM_D], // back-right
  [BEAM_X + BEAM_D, BEAM_Y - BEAM_H/2 - BEAM_D],        // back-left
]

// Боковая грань (торец справа)
const sideFace = [
  [BEAM_X + BEAM_W, BEAM_Y - BEAM_H/2],                  // front-top
  [BEAM_X + BEAM_W + BEAM_D, BEAM_Y - BEAM_H/2 - BEAM_D], // back-top
  [BEAM_X + BEAM_W + BEAM_D, BEAM_Y + BEAM_H/2 - BEAM_D], // back-bottom
  [BEAM_X + BEAM_W, BEAM_Y + BEAM_H/2],                   // front-bottom
]
```

### 1.3 Тепловая карта напряжений на фронтальной грани

Напряжение при ударе в консольной балке максимально у заделки и линейно убывает к свободному концу. Используем SVG `<linearGradient>` с динамическими стопами:

```jsx
<defs>
  <linearGradient id="stressGradient" x1="0" y1="0" x2="1" y2="0">
    {/* Максимум напряжений у заделки */}
    <stop offset="0%" stopColor={getStressColor(1.0)} />
    <stop offset="30%" stopColor={getStressColor(0.7)} />
    <stop offset="60%" stopColor={getStressColor(0.4)} />
    <stop offset="100%" stopColor={getStressColor(0.1)} />
  </linearGradient>
</defs>
```

Функция `getStressColor(ratio)` должна учитывать `results.zoneColor`:
- `emerald` зона: зелёный → бирюзовый градиент (безопасно)
- `amber` зона: жёлтый → оранжевый → красноватый (опасно)
- `red` зона: оранжевый → красный → тёмно-красный (разрушение)

```javascript
function getStressColor(intensity, zoneColor) {
  // intensity: 0..1, где 1 = максимум у заделки
  if (zoneColor === 'emerald') {
    // Безопасная зона — от мягкого зелёного к бирюзовому
    const r = Math.round(16 + (52 - 16) * (1 - intensity))
    const g = Math.round(185 + (211 - 185) * (1 - intensity))
    const b = Math.round(129 + (153 - 129) * (1 - intensity))
    return `rgb(${r},${g},${b})`
  } else if (zoneColor === 'amber') {
    // Пластика — от красного у заделки к жёлтому на конце
    const r = Math.round(239 + (251 - 239) * (1 - intensity))
    const g = Math.round(68 + (191 - 68) * (1 - intensity))
    const b = Math.round(68 + (36 - 68) * (1 - intensity))
    return `rgb(${r},${g},${b})`
  } else {
    // Разрушение — красный → тёмно-красный
    const r = Math.round(220 + (239 - 220) * (1 - intensity))
    const g = Math.round(38 + (68 - 38) * (1 - intensity))
    const b = Math.round(38 + (68 - 38) * (1 - intensity))
    return `rgb(${r},${g},${b})`
  }
}
```

### 1.4 Кривая прогиба (реалистичная упругая линия)

При ударе на свободном конце консольной балки, форма упругой линии:

```
y(x) = (P / 6EI) * x² * (3L - x)
```

Но для визуализации достаточно кубической кривой Безье, апроксимирующей эту форму:

```jsx
// Масштабированный прогиб для визуализации (ограничен 60px максимум)
const maxVisualDeflection = Math.min(results.dynamicDeflection * 2, 60)

// Путь верхнего края деформированной балки
const deflectedTopPath = `
  M ${BEAM_X} ${BEAM_Y - BEAM_H/2}
  C ${BEAM_X + BEAM_W * 0.4} ${BEAM_Y - BEAM_H/2 + maxVisualDeflection * 0.15}
    ${BEAM_X + BEAM_W * 0.7} ${BEAM_Y - BEAM_H/2 + maxVisualDeflection * 0.55}
    ${BEAM_X + BEAM_W} ${BEAM_Y - BEAM_H/2 + maxVisualDeflection}
`

// Путь нижнего края (параллельная кривая)
const deflectedBottomPath = `
  L ${BEAM_X + BEAM_W} ${BEAM_Y + BEAM_H/2 + maxVisualDeflection}
  C ${BEAM_X + BEAM_W * 0.7} ${BEAM_Y + BEAM_H/2 + maxVisualDeflection * 0.55}
    ${BEAM_X + BEAM_W * 0.4} ${BEAM_Y + BEAM_H/2 + maxVisualDeflection * 0.15}
    ${BEAM_X} ${BEAM_Y + BEAM_H/2}
  Z
`
```

Вместо `<polygon>` для фронтальной грани используем `<path>` объединяющий верхнюю и нижнюю кривые. Это даёт **реалистичный изгиб** вместо простого поворота.

**Верхняя грань** деформированной балки — тоже через path, смещая задние точки параллельно фронтальным.

### 1.5 Анимация деформации

Использовать Framer Motion для плавного перехода от прямой балки к изогнутой:

```jsx
import { motion } from 'framer-motion'

// motion.path с animate на d (путь)
<motion.path
  d={results ? deflectedPath : straightPath}
  fill="url(#stressGradient)"
  initial={false}
  animate={{ d: results ? deflectedPath : straightPath }}
  transition={{ type: "spring", stiffness: 80, damping: 15 }}
/>
```

**ВАЖНО:** Framer Motion поддерживает анимацию SVG `d` атрибута, но пути должны иметь одинаковое количество команд и контрольных точек. Прямая балка = та же Безье с нулевым прогибом.

### 1.6 Ударник с анимацией падения

```jsx
// Группа ударника
<motion.g
  animate={{
    y: isAnimating ? [−60, 0, −10, 0] : results ? 0 : −60
  }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 10,
    duration: 0.6
  }}
>
  {/* Корпус — прямоугольник с закруглёнными углами */}
  <rect x={impactX - 20} y={impactY - 45} width={40} height={35}
        rx={4} fill="#475569" stroke="#64748b" />
  
  {/* Подпись энергии */}
  <text x={impactX} y={impactY - 24}
        textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
    {inputs.impactType === 'energy' ? `${inputs.impactEnergy}J` : `${inputs.impactMass}kg`}
  </text>
  
  {/* Стрелка вниз */}
  <line x1={impactX} y1={impactY - 10} x2={impactX} y2={impactY}
        stroke="#f59e0b" strokeWidth={2} />
  <polygon points={`${impactX-5},${impactY-4} ${impactX+5},${impactY-4} ${impactX},${impactY+4}`}
           fill="#f59e0b" />
</motion.g>
```

### 1.7 Частицы при ударе

При `isAnimating === true` — вспышка частиц в точке удара:

```jsx
{isAnimating && (
  <g>
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2
      return (
        <motion.circle
          key={i}
          cx={impactX}
          cy={impactY}
          r={2}
          fill="#fbbf24"
          initial={{ opacity: 1, cx: impactX, cy: impactY }}
          animate={{
            cx: impactX + Math.cos(angle) * 30,
            cy: impactY + Math.sin(angle) * 30,
            opacity: 0,
            r: 0
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )
    })}
  </g>
)}
```

### 1.8 Заделка (стена)

```jsx
<defs>
  <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse"
           patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#475569" strokeWidth="2" />
  </pattern>
</defs>

{/* Стена заделки */}
<rect x={60} y={BEAM_Y - 60} width={40} height={120}
      fill="url(#hatch)" stroke="#475569" strokeWidth="1" />

{/* Торец заделки — граница крепления */}
<line x1={BEAM_X} y1={BEAM_Y - 60} x2={BEAM_X} y2={BEAM_Y + 60}
      stroke="#64748b" strokeWidth="2" />
```

### 1.9 Аннотации размеров

```jsx
{/* Линия длины с стрелками */}
<g className="text-slate-500">
  <line x1={BEAM_X} y1={BEAM_Y + 60} x2={BEAM_X + BEAM_W} y2={BEAM_Y + 60}
        stroke="#64748b" strokeWidth={1} strokeDasharray="4 4" />
  <text x={BEAM_X + BEAM_W / 2} y={BEAM_Y + 78}
        textAnchor="middle" fill="#94a3b8" fontSize="12">
    L = {inputs.length} мм
  </text>
</g>

{/* Метка прогиба (при наличии результатов) */}
{results && (
  <g>
    <line x1={BEAM_X + BEAM_W + 20} y1={BEAM_Y}
          x2={BEAM_X + BEAM_W + 20} y2={BEAM_Y + maxVisualDeflection}
          stroke={zoneStrokeColor} strokeWidth={1} strokeDasharray="3 3" />
    <text x={BEAM_X + BEAM_W + 30} y={BEAM_Y + maxVisualDeflection / 2 + 4}
          fill={zoneStrokeColor} fontSize="12" fontWeight="bold">
      δ = {results.dynamicDeflection.toFixed(1)} мм
    </text>
  </g>
)}
```

### 1.10 Шкала напряжений (легенда)

Горизонтальная градиентная полоска внизу SVG:

```jsx
<defs>
  <linearGradient id="legendGradient">
    <stop offset="0%" stopColor="#10b981" />
    <stop offset="50%" stopColor="#f59e0b" />
    <stop offset="100%" stopColor="#ef4444" />
  </linearGradient>
</defs>

<rect x={BEAM_X} y={370} width={200} height={8} rx={4}
      fill="url(#legendGradient)" />
<text x={BEAM_X} y={390} fill="#64748b" fontSize="10">0</text>
<text x={BEAM_X + 100} y={390} fill="#64748b" fontSize="10" textAnchor="middle">σт</text>
<text x={BEAM_X + 200} y={390} fill="#64748b" fontSize="10" textAnchor="end">σв</text>
```

---

## ШАГ 2: Поддержка разных типов элементов

Текущий код поддерживает 4 типа: консоль, балка на опорах, пластина, стержень. Визуализация должна адаптироваться.

### 2.1 Консольная балка (beam-cantilever) — основной режим
- Заделка слева, свободный конец справа
- Удар на свободном конце
- Прогиб увеличивается от заделки к концу (описано выше)

### 2.2 Балка на опорах (beam-supported)
- Две треугольные опоры по краям (вместо заделки)
- Удар в середине
- Прогиб максимален в центре

```jsx
// Опоры — треугольники
<polygon points={`${BEAM_X},${BEAM_Y + BEAM_H/2} ${BEAM_X - 10},${BEAM_Y + BEAM_H/2 + 20} ${BEAM_X + 10},${BEAM_Y + BEAM_H/2 + 20}`}
         fill="#475569" stroke="#64748b" />
// Аналогично правая опора
```

### 2.3 Для пластины и стержня

Пока использовать визуализацию консольной балки — это ограничение текущей версии. Добавить текстовую метку "Упрощённая модель" для этих типов.

---

## ШАГ 3: Визуализация сечения (мини-вставка)

В правом верхнем углу SVG — маленькая схема поперечного сечения (80×80px), которая отображает текущий `sectionType`:

```jsx
// Прямоугольное сечение
<rect x={690} y={20} width={40} height={25} fill="none"
      stroke={zoneStrokeColor} strokeWidth={1.5} />

// Круглое сечение
<circle cx={710} cy={35} r={16} fill="none"
        stroke={zoneStrokeColor} strokeWidth={1.5} />

// Труба — два концентрических круга
<circle cx={710} cy={35} r={16} fill="none" stroke={zoneStrokeColor} strokeWidth={1.5} />
<circle cx={710} cy={35} r={10} fill="none" stroke={zoneStrokeColor} strokeWidth={1} strokeDasharray="2 2" />
```

С подписью размеров рядом (мелким шрифтом).

---

## ШАГ 4: Интеграция

В `ImpactCalculator.jsx`:

```jsx
// Добавить импорт
import BeamVisualization3D from '../../components/BeamVisualization3D'

// Заменить в секции визуализации:
// БЫЛО:
// <StressVisualization results={results} inputs={inputs} isAnimating={isAnimating} />

// СТАЛО:
<BeamVisualization3D results={results} inputs={inputs} isAnimating={isAnimating} />
```

Старый компонент `StressVisualization` **не удалять**, просто оставить неиспользованным — может пригодиться для мобильной версии как fallback.

---

## ШАГ 5: Адаптивность

SVG автоматически масштабируется через `viewBox`, но контролировать через:

```jsx
<svg
  viewBox="0 0 800 400"
  className="w-full h-auto"
  style={{ maxHeight: '450px' }}
  preserveAspectRatio="xMidYMid meet"
>
```

На мобильных (`<640px`) аннотации могут быть слишком мелкими. Добавить `@media` или Tailwind класс для увеличения `fontSize` на маленьких экранах (через CSS transform на SVG text, не через viewBox).

---

## ШАГ 6: Финальная полировка

### 6.1 Glow-эффект на балке

SVG filter для свечения вокруг балки:

```jsx
<defs>
  <filter id="beamGlow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="4" result="blur" />
    <feComposite in="SourceGraphic" in2="blur" operator="over" />
  </filter>
</defs>
```

Применить через `filter="url(#beamGlow)"` на группе балки. Цвет свечения зависит от `zoneColor`.

### 6.2 Тень под балкой

Размытый эллипс, имитирующий тень на "полу":

```jsx
<ellipse cx={BEAM_X + BEAM_W / 2} cy={BEAM_Y + 70}
         rx={BEAM_W / 2 + 20} ry={8}
         fill="rgba(0,0,0,0.3)" filter="url(#shadowBlur)" />
```

### 6.3 Фоновая сетка с перспективой

Горизонтальные линии с уменьшающимся расстоянием к горизонту:

```jsx
{Array.from({ length: 10 }).map((_, i) => {
  const y = 350 - i * (5 + i * 2) // нелинейное расстояние = перспектива
  return (
    <line key={i} x1={0} y1={y} x2={800} y2={y}
          stroke="#1e293b" strokeWidth={0.5} opacity={0.3 + i * 0.05} />
  )
})}
```

---

## ШАГ 7: Проверка

```bash
npm run build
npm run preview
```

### Чеклист:

- [ ] Балка отображается в 3D-перспективе (три грани видны)
- [ ] Тепловая карта напряжений меняет цвет в зависимости от зоны (emerald/amber/red)
- [ ] При нажатии "Рассчитать" — плавная анимация изгиба балки
- [ ] Кривая прогиба реалистична (больше у свободного конца, ноль у заделки)
- [ ] Ударник анимированно падает с пружинным эффектом
- [ ] Частицы-искры при ударе
- [ ] Аннотации читаемые: L, δ, тип сечения
- [ ] Шкала напряжений внизу
- [ ] Работает для всех 4 типов элементов
- [ ] Работает для всех 3 типов сечений (показ мини-схемы)
- [ ] SVG масштабируется на разных экранах без обрезки
- [ ] Нет ошибок в консоли
- [ ] Build проходит без warnings
- [ ] Расчётная часть НЕ изменена (проверить что числа те же)

---

## ШАГ 8: Коммит и push

```bash
git add -A
git commit -m "feat(viz): 3D beam visualization for impact calculator

- Replace flat 2D beam with SVG isometric 3D beam (three faces)
- Add stress heatmap gradient based on zone (elastic/plastic/fracture)
- Realistic deflection curve using cubic Bezier approximation
- Animated impactor with spring physics and spark particles
- Cross-section mini-diagram (rectangular/circular/tube)
- Dimension annotations (length, deflection)
- Glow and shadow effects for depth
- Responsive SVG with viewBox scaling"

git push origin feat/3d-beam-visualization
```

---

## Ограничения

- **НЕ менять** расчётную логику в `calculate()` 
- **НЕ менять** компоненты `InputField`, `ResultCard`, и UI ввода/вывода
- **НЕ добавлять** Three.js, Canvas, или другие тяжёлые библиотеки — только SVG + Framer Motion
- **НЕ менять** роутинг, навигацию, другие страницы
- Новые npm-зависимости **не нужны** — всё реализуется на имеющемся стеке
- Бандл не должен вырасти более чем на 3KB gzip

---

## Визуальный референс

Ориентироваться на стиль инженерных симуляторов:
- ANSYS Mechanical — stress contour plots (тепловые карты напряжений)
- Beam Calculator apps — схемы с кривыми прогиба и аннотациями
- Ключевое: **инженерная точность + современная эстетика** (dark theme, glow effects, плавные анимации)

Итоговая визуализация должна выглядеть так, чтобы преподаватель сопромата сказал: "Вот это да, покажите студентам".

---

*Работать автономно. Сначала создать BeamVisualization3D.jsx, потом интегрировать. Проверять визуально после каждого крупного шага.*
