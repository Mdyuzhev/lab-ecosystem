# TASK: Заменить эмодзи на SVG иконки в калькуляторе

## Цель

Заменить все текстовые эмодзи на странице калькулятора ударных нагрузок на красивые SVG иконки из Lucide React для профессионального вида.

## Файл

`src/pages/tools/ImpactCalculator.jsx`

---

## Маппинг эмодзи → Lucide иконки

### Типы элементов

| Текущий эмодзи | Описание | Lucide иконка | Import |
|----------------|----------|---------------|--------|
| 📐 | Консольная балка | `CornerDownRight` или `ArrowDownToLine` | `CornerDownRight` |
| 🔩 | Балка на опорах | `Minus` с кружками или `GripHorizontal` | `GripHorizontal` |
| ▬ | Пластина | `Square` или `RectangleHorizontal` | `RectangleHorizontal` |
| │ | Стержень | `Grip` или `GripVertical` | `GripVertical` |

### Результаты

| Текущий эмодзи | Описание | Lucide иконка | Import |
|----------------|----------|---------------|--------|
| ✅ | Упругая деформация | `CheckCircle` | `CheckCircle` |
| ⚠️ | Пластическая деформация | `AlertTriangle` | `AlertTriangle` |
| ❌ | Разрушение | `XCircle` | `XCircle` |

---

## Код замены

### 1. Добавить импорты

```jsx
import { 
  // Существующие импорты...
  Calculator, Cpu, Zap, Box, Ruler, Layers, Lightbulb, ArrowRight,
  
  // Новые для типов элементов
  CornerDownRight,  // консольная балка
  GripHorizontal,   // балка на опорах  
  RectangleHorizontal, // пластина
  GripVertical,     // стержень
  
  // Для результатов
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react'
```

### 2. Обновить массив типов элементов

**Было:**
```jsx
{[
  { id: 'beam-cantilever', label: 'Консольная балка', icon: '📐' },
  { id: 'beam-supported', label: 'Балка на опорах', icon: '🔩' },
  { id: 'plate', label: 'Пластина', icon: '▬' },
  { id: 'rod', label: 'Стержень', icon: '│' },
].map(type => (
  <button ...>
    <div className="text-2xl mb-2">{type.icon}</div>
    ...
  </button>
))}
```

**Стало:**
```jsx
const elementTypes = [
  { id: 'beam-cantilever', label: 'Консольная балка', Icon: CornerDownRight, color: 'emerald' },
  { id: 'beam-supported', label: 'Балка на опорах', Icon: GripHorizontal, color: 'blue' },
  { id: 'plate', label: 'Пластина', Icon: RectangleHorizontal, color: 'purple' },
  { id: 'rod', label: 'Стержень', Icon: GripVertical, color: 'amber' },
]

// В JSX:
{elementTypes.map(type => (
  <button
    key={type.id}
    onClick={() => setInputs({...inputs, elementType: type.id})}
    className={`p-4 rounded-lg border transition-all ${
      inputs.elementType === type.id 
        ? `border-${type.color}-500 bg-${type.color}-500/10` 
        : 'border-slate-700 hover:border-slate-600'
    }`}
  >
    <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-${type.color}-500/20 flex items-center justify-center`}>
      <type.Icon className={`text-${type.color}-400`} size={24} />
    </div>
    <div className="text-sm">{type.label}</div>
  </button>
))}
```

### 3. Обновить отображение результата (зона работы)

**Было:**
```jsx
<div className="text-6xl mb-4">{results.zoneIcon}</div>
```

**Стало:**
```jsx
// В функции calculate() изменить определение zoneIcon:
let zone, zoneColor, ZoneIcon
if (sigma_dynamic < sigma_t) {
  zone = 'УПРУГАЯ ДЕФОРМАЦИЯ'
  zoneColor = 'emerald'
  ZoneIcon = CheckCircle
} else if (sigma_dynamic < sigma_v) {
  zone = 'ПЛАСТИЧЕСКАЯ ДЕФОРМАЦИЯ'
  zoneColor = 'amber'
  ZoneIcon = AlertTriangle
} else {
  zone = 'РАЗРУШЕНИЕ'
  zoneColor = 'red'
  ZoneIcon = XCircle
}

// В JSX результатов:
<div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-${results.zoneColor}-500/20 flex items-center justify-center`}>
  <results.ZoneIcon className={`text-${results.zoneColor}-400`} size={48} />
</div>
```

### 4. Обновить state results

Изменить структуру results, чтобы хранить компонент иконки:

```jsx
setResults({
  // ...остальные поля...
  zone,
  zoneColor,
  ZoneIcon,  // Компонент иконки вместо строки эмодзи
})
```

---

## Стилизация иконок

Для консистентности использовать:

**В кнопках выбора:**
```jsx
<div className="w-10 h-10 rounded-lg bg-[color]-500/20 flex items-center justify-center">
  <Icon className="text-[color]-400" size={24} />
</div>
```

**В результате:**
```jsx
<div className="w-20 h-20 rounded-full bg-[color]-500/20 flex items-center justify-center">
  <Icon className="text-[color]-400" size={48} />
</div>
```

---

## Дополнительно: кастомные SVG иконки для элементов

Если стандартные Lucide иконки не достаточно наглядны, можно создать кастомные SVG:

```jsx
// Кастомная иконка консольной балки
const BeamCantileverIcon = ({ className, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Заделка */}
    <rect x="2" y="6" width="4" height="12" fill="currentColor" opacity="0.3"/>
    <line x1="2" y1="6" x2="2" y2="18" stroke="currentColor" strokeWidth="2"/>
    {/* Балка */}
    <rect x="6" y="10" width="16" height="4" rx="1" fill="currentColor"/>
    {/* Стрелка нагрузки */}
    <path d="M18 4 L18 9 M16 7 L18 9 L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// Кастомная иконка балки на двух опорах
const BeamSupportedIcon = ({ className, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Балка */}
    <rect x="2" y="10" width="20" height="3" rx="1" fill="currentColor"/>
    {/* Левая опора (треугольник) */}
    <polygon points="4,13 6,18 2,18" fill="currentColor" opacity="0.5"/>
    {/* Правая опора */}
    <polygon points="20,13 22,18 18,18" fill="currentColor" opacity="0.5"/>
    {/* Стрелка нагрузки */}
    <path d="M12 4 L12 9 M10 7 L12 9 L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
```

---

## Проверка

```bash
npm run dev
```

1. Открыть `/tools/impact-calculator`
2. Убедиться что все эмодзи заменены на иконки
3. Проверить что иконки типов элементов отображаются в кнопках
4. Выполнить расчёт и проверить что иконка результата (✓/⚠/✗) отображается корректно
5. Проверить что цвета иконок соответствуют состоянию (emerald/amber/red)

## Коммит

```bash
git add -A
git commit -m "feat(tools): replace emoji with Lucide SVG icons in calculator"
git push
```

---

*Работать автономно. Заменить все эмодзи, проверить отображение.*
