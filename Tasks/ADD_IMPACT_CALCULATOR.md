# TASK: Создать прототип калькулятора ударных нагрузок

## Цель

Создать интерактивную страницу с работающим прототипом инженерного калькулятора для расчёта поведения конструкции при ударных нагрузках. Это демонстрация того, как выглядят детерминированные инструменты, создаваемые ИИ-лабораторией.

## Страница

**Путь:** `/tools/impact-calculator`
**Файл:** `src/pages/tools/ImpactCalculator.jsx`

---

## Инженерная основа калькулятора

### Энергетический метод для ударных нагрузок

При ударе кинетическая энергия преобразуется в работу деформации элемента. Сравнивая максимальные напряжения с характеристиками материала, определяем зону работы.

### Основные формулы

```
1. Кинетическая энергия удара:
   E = m × v² / 2   [Дж]
   где m — масса ударника [кг], v — скорость [м/с]

2. Статический прогиб балки (консоль, сила на конце):
   δст = P × L³ / (3 × E × I)   [м]
   где P — сила [Н], L — длина [м], E — модуль Юнга [Па], I — момент инерции [м⁴]

3. Момент инерции прямоугольного сечения:
   I = b × h³ / 12   [м⁴]
   где b — ширина [м], h — высота [м]

4. Момент инерции круглого сечения:
   I = π × d⁴ / 64   [м⁴]
   где d — диаметр [м]

5. Момент инерции трубы:
   I = π × (D⁴ - d⁴) / 64   [м⁴]
   где D — внешний диаметр, d — внутренний диаметр

6. Коэффициент динамичности (при ударе с высоты h):
   Kd = 1 + √(1 + 2×h / δст)
   
   При горизонтальном ударе со скоростью v:
   Kd = √(1 + v² × m × L³ / (3 × E × I × δст))
   
   Упрощённо через энергию:
   Kd = √(2 × E_удара / (P_ст × δст))

7. Динамическое напряжение:
   σд = Kd × σст   [Па]
   
   где σст = M / W — статическое напряжение
   M = P × L — изгибающий момент (для консоли)
   W = I / (h/2) — момент сопротивления

8. Определение зоны работы:
   - σд < σт (предел текучести) → УПРУГАЯ деформация ✅
   - σт ≤ σд < σв (предел прочности) → ПЛАСТИЧЕСКАЯ деформация ⚠️
   - σд ≥ σв → РАЗРУШЕНИЕ ❌

9. Запас прочности:
   n = σт / σд — по текучести
   n = σв / σд — по прочности
```

---

## Структура страницы

### 1. Hero-секция

```jsx
<section className="relative py-16 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
  
  <div className="max-w-6xl mx-auto px-6">
    {/* Бейдж */}
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
      <Cpu className="text-emerald-400" size={16} />
      <span className="text-emerald-400 text-sm font-medium">Прототип инструмента</span>
    </div>

    <h1 className="text-4xl md:text-5xl font-bold mb-4">
      Калькулятор <span className="text-emerald-400">ударных нагрузок</span>
    </h1>
    
    <p className="text-xl text-slate-400 max-w-3xl mb-6">
      Определяет поведение конструкции при ударе: останется ли она в зоне упругих 
      деформаций, произойдёт пластическая деформация или разрушение.
    </p>
    
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <Zap className="text-yellow-400" size={16} />
      <span>Детерминированный инструмент — работает мгновенно, без ИИ, без ошибок</span>
    </div>
  </div>
</section>
```

### 2. Калькулятор (основной блок)

Создать React-компонент с состоянием для ввода и расчёта:

```jsx
const [inputs, setInputs] = useState({
  // Тип элемента
  elementType: 'beam-cantilever', // beam-cantilever, beam-supported, plate, rod
  
  // Тип сечения
  sectionType: 'rectangular', // rectangular, circular, tube
  
  // Геометрия (в мм, потом переводим в м)
  length: 500,        // длина, мм
  width: 50,          // ширина (для прямоугольного), мм
  height: 30,         // высота (для прямоугольного), мм
  diameter: 40,       // диаметр (для круглого), мм
  outerDiameter: 50,  // внешний диаметр (для трубы), мм
  innerDiameter: 40,  // внутренний диаметр (для трубы), мм
  
  // Материал
  material: 'steel-45', // предустановленный или custom
  youngModulus: 200,    // ГПа
  yieldStrength: 360,   // МПа (предел текучести)
  ultimateStrength: 600, // МПа (предел прочности)
  
  // Параметры удара
  impactType: 'energy', // energy или mass-velocity
  impactEnergy: 100,    // Дж
  impactMass: 5,        // кг
  impactVelocity: 5,    // м/с
})

const [results, setResults] = useState(null)
```

### 3. Форма ввода параметров

Разделить на секции:

**Секция "Тип элемента":**
```jsx
<div className="glass rounded-xl p-6 mb-6">
  <h3 className="font-semibold mb-4 flex items-center gap-2">
    <Box className="text-purple-400" size={20} />
    Тип элемента
  </h3>
  
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {[
      { id: 'beam-cantilever', label: 'Консольная балка', icon: '📐' },
      { id: 'beam-supported', label: 'Балка на опорах', icon: '🔩' },
      { id: 'plate', label: 'Пластина', icon: '▬' },
      { id: 'rod', label: 'Стержень', icon: '│' },
    ].map(type => (
      <button
        key={type.id}
        onClick={() => setInputs({...inputs, elementType: type.id})}
        className={`p-4 rounded-lg border transition-all ${
          inputs.elementType === type.id 
            ? 'border-emerald-500 bg-emerald-500/10' 
            : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        <div className="text-2xl mb-2">{type.icon}</div>
        <div className="text-sm">{type.label}</div>
      </button>
    ))}
  </div>
</div>
```

**Секция "Геометрия":**
```jsx
<div className="glass rounded-xl p-6 mb-6">
  <h3 className="font-semibold mb-4 flex items-center gap-2">
    <Ruler className="text-blue-400" size={20} />
    Геометрия сечения
  </h3>
  
  {/* Выбор типа сечения */}
  <div className="flex gap-2 mb-4">
    {['rectangular', 'circular', 'tube'].map(type => (
      <button
        key={type}
        onClick={() => setInputs({...inputs, sectionType: type})}
        className={`px-4 py-2 rounded-lg text-sm ${
          inputs.sectionType === type 
            ? 'bg-blue-500 text-white' 
            : 'bg-slate-800 text-slate-400'
        }`}
      >
        {type === 'rectangular' ? 'Прямоугольное' : type === 'circular' ? 'Круглое' : 'Труба'}
      </button>
    ))}
  </div>
  
  {/* Поля ввода в зависимости от типа сечения */}
  <div className="grid md:grid-cols-3 gap-4">
    <InputField label="Длина, мм" value={inputs.length} onChange={...} />
    
    {inputs.sectionType === 'rectangular' && (
      <>
        <InputField label="Ширина, мм" value={inputs.width} onChange={...} />
        <InputField label="Высота, мм" value={inputs.height} onChange={...} />
      </>
    )}
    
    {inputs.sectionType === 'circular' && (
      <InputField label="Диаметр, мм" value={inputs.diameter} onChange={...} />
    )}
    
    {inputs.sectionType === 'tube' && (
      <>
        <InputField label="Внешний ∅, мм" value={inputs.outerDiameter} onChange={...} />
        <InputField label="Внутренний ∅, мм" value={inputs.innerDiameter} onChange={...} />
      </>
    )}
  </div>
</div>
```

**Секция "Материал":**
```jsx
<div className="glass rounded-xl p-6 mb-6">
  <h3 className="font-semibold mb-4 flex items-center gap-2">
    <Layers className="text-amber-400" size={20} />
    Материал
  </h3>
  
  {/* Предустановленные материалы */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
    {[
      { id: 'steel-45', name: 'Сталь 45', E: 200, σт: 360, σв: 600 },
      { id: 'steel-3', name: 'Сталь 3', E: 200, σт: 250, σв: 450 },
      { id: 'aluminum-d16', name: 'Д16 (дюраль)', E: 72, σт: 280, σв: 440 },
      { id: 'titanium-vt6', name: 'ВТ6 (титан)', E: 115, σт: 900, σв: 1000 },
      { id: 'custom', name: 'Свой материал', E: null, σт: null, σв: null },
    ].map(mat => (
      <button
        key={mat.id}
        onClick={() => selectMaterial(mat)}
        className={`p-3 rounded-lg border text-left ${...}`}
      >
        <div className="text-sm font-medium">{mat.name}</div>
        {mat.E && <div className="text-xs text-slate-500">E={mat.E} ГПа</div>}
      </button>
    ))}
  </div>
  
  {/* Поля для ручного ввода */}
  <div className="grid md:grid-cols-3 gap-4">
    <InputField label="Модуль Юнга, ГПа" value={inputs.youngModulus} onChange={...} />
    <InputField label="Предел текучести σт, МПа" value={inputs.yieldStrength} onChange={...} />
    <InputField label="Предел прочности σв, МПа" value={inputs.ultimateStrength} onChange={...} />
  </div>
</div>
```

**Секция "Параметры удара":**
```jsx
<div className="glass rounded-xl p-6 mb-6">
  <h3 className="font-semibold mb-4 flex items-center gap-2">
    <Zap className="text-red-400" size={20} />
    Параметры удара
  </h3>
  
  {/* Способ задания */}
  <div className="flex gap-2 mb-4">
    <button onClick={() => setInputs({...inputs, impactType: 'energy'})} className={...}>
      Энергия удара
    </button>
    <button onClick={() => setInputs({...inputs, impactType: 'mass-velocity'})} className={...}>
      Масса × Скорость
    </button>
  </div>
  
  {inputs.impactType === 'energy' ? (
    <InputField label="Энергия удара, Дж" value={inputs.impactEnergy} onChange={...} />
  ) : (
    <div className="grid md:grid-cols-2 gap-4">
      <InputField label="Масса ударника, кг" value={inputs.impactMass} onChange={...} />
      <InputField label="Скорость удара, м/с" value={inputs.impactVelocity} onChange={...} />
    </div>
  )}
</div>
```

**Кнопка расчёта:**
```jsx
<button
  onClick={calculate}
  className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-lg transition-colors flex items-center justify-center gap-2"
>
  <Calculator size={20} />
  Рассчитать
</button>
```

### 4. Функция расчёта

```jsx
const calculate = () => {
  // Переводим единицы: мм → м, ГПа → Па, МПа → Па
  const L = inputs.length / 1000          // м
  const E = inputs.youngModulus * 1e9     // Па
  const sigma_t = inputs.yieldStrength * 1e6   // Па
  const sigma_v = inputs.ultimateStrength * 1e6 // Па
  
  // Момент инерции сечения
  let I, W, h_max
  if (inputs.sectionType === 'rectangular') {
    const b = inputs.width / 1000   // м
    const h = inputs.height / 1000  // м
    I = (b * Math.pow(h, 3)) / 12
    h_max = h / 2
    W = I / h_max
  } else if (inputs.sectionType === 'circular') {
    const d = inputs.diameter / 1000
    I = (Math.PI * Math.pow(d, 4)) / 64
    h_max = d / 2
    W = I / h_max
  } else { // tube
    const D = inputs.outerDiameter / 1000
    const d = inputs.innerDiameter / 1000
    I = (Math.PI * (Math.pow(D, 4) - Math.pow(d, 4))) / 64
    h_max = D / 2
    W = I / h_max
  }
  
  // Энергия удара
  let E_impact
  if (inputs.impactType === 'energy') {
    E_impact = inputs.impactEnergy
  } else {
    E_impact = 0.5 * inputs.impactMass * Math.pow(inputs.impactVelocity, 2)
  }
  
  // Статическая жёсткость (для консольной балки)
  // P = δ × 3EI / L³  →  жёсткость k = 3EI / L³
  const k = (3 * E * I) / Math.pow(L, 3)
  
  // Из энергетического баланса: E = P×δ/2 = k×δ²/2
  // δ = √(2E/k)
  const delta_dynamic = Math.sqrt((2 * E_impact) / k)
  
  // Динамическая сила
  const P_dynamic = k * delta_dynamic
  
  // Статический прогиб при той же силе
  const delta_static = P_dynamic * Math.pow(L, 3) / (3 * E * I)
  
  // Коэффициент динамичности
  const K_d = delta_dynamic / delta_static || 1
  
  // Изгибающий момент (для консоли — на заделке)
  const M = P_dynamic * L
  
  // Динамическое напряжение
  const sigma_dynamic = M / W
  
  // Запас прочности
  const safety_yield = sigma_t / sigma_dynamic
  const safety_ultimate = sigma_v / sigma_dynamic
  
  // Определение зоны
  let zone, zoneColor, zoneIcon
  if (sigma_dynamic < sigma_t) {
    zone = 'УПРУГАЯ ДЕФОРМАЦИЯ'
    zoneColor = 'emerald'
    zoneIcon = '✅'
  } else if (sigma_dynamic < sigma_v) {
    zone = 'ПЛАСТИЧЕСКАЯ ДЕФОРМАЦИЯ'
    zoneColor = 'amber'
    zoneIcon = '⚠️'
  } else {
    zone = 'РАЗРУШЕНИЕ'
    zoneColor = 'red'
    zoneIcon = '❌'
  }
  
  setResults({
    impactEnergy: E_impact,
    momentOfInertia: I,
    sectionModulus: W,
    stiffness: k,
    dynamicDeflection: delta_dynamic * 1000, // обратно в мм
    dynamicForce: P_dynamic,
    dynamicCoefficient: K_d,
    bendingMoment: M,
    dynamicStress: sigma_dynamic / 1e6, // в МПа
    yieldStrength: sigma_t / 1e6,
    ultimateStrength: sigma_v / 1e6,
    safetyYield: safety_yield,
    safetyUltimate: safety_ultimate,
    zone,
    zoneColor,
    zoneIcon,
  })
}
```

### 5. Блок результатов

```jsx
{results && (
  <div className="mt-8">
    {/* Главный результат — зона работы */}
    <div className={`glass rounded-2xl p-8 mb-6 border-2 border-${results.zoneColor}-500/50 bg-${results.zoneColor}-500/10`}>
      <div className="text-center">
        <div className="text-6xl mb-4">{results.zoneIcon}</div>
        <div className={`text-3xl font-bold text-${results.zoneColor}-400 mb-2`}>
          {results.zone}
        </div>
        <p className="text-slate-400">
          {results.zone === 'УПРУГАЯ ДЕФОРМАЦИЯ' && 'Конструкция выдержит удар и вернётся к исходной форме'}
          {results.zone === 'ПЛАСТИЧЕСКАЯ ДЕФОРМАЦИЯ' && 'Конструкция деформируется, но не разрушится'}
          {results.zone === 'РАЗРУШЕНИЕ' && 'Конструкция разрушится при данном ударе'}
        </p>
      </div>
    </div>
    
    {/* Детальные результаты */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <ResultCard 
        label="Динамическое напряжение" 
        value={results.dynamicStress.toFixed(1)} 
        unit="МПа"
        color="blue"
      />
      <ResultCard 
        label="Предел текучести" 
        value={results.yieldStrength.toFixed(0)} 
        unit="МПа"
        color="amber"
      />
      <ResultCard 
        label="Запас по текучести" 
        value={results.safetyYield.toFixed(2)} 
        unit=""
        color={results.safetyYield >= 1 ? 'emerald' : 'red'}
      />
      <ResultCard 
        label="Прогиб при ударе" 
        value={results.dynamicDeflection.toFixed(2)} 
        unit="мм"
        color="purple"
      />
    </div>
    
    {/* Диаграмма напряжений */}
    <div className="glass rounded-xl p-6">
      <h4 className="font-semibold mb-4">Диаграмма напряжений</h4>
      <div className="relative h-8 bg-slate-800 rounded-full overflow-hidden">
        {/* Зона упругости */}
        <div 
          className="absolute left-0 top-0 bottom-0 bg-emerald-500/30"
          style={{ width: `${(results.yieldStrength / results.ultimateStrength) * 100}%` }}
        />
        {/* Зона пластичности */}
        <div 
          className="absolute top-0 bottom-0 bg-amber-500/30"
          style={{ 
            left: `${(results.yieldStrength / results.ultimateStrength) * 100}%`,
            width: `${100 - (results.yieldStrength / results.ultimateStrength) * 100}%`
          }}
        />
        {/* Маркер текущего напряжения */}
        <div 
          className={`absolute top-0 bottom-0 w-1 bg-${results.zoneColor}-400`}
          style={{ left: `${Math.min((results.dynamicStress / results.ultimateStrength) * 100, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500 mt-2">
        <span>0</span>
        <span>σт = {results.yieldStrength} МПа</span>
        <span>σв = {results.ultimateStrength} МПа</span>
      </div>
    </div>
  </div>
)}
```

### 6. Подвал с объяснением

```jsx
<section className="py-16 bg-slate-900/50 mt-16">
  <div className="max-w-6xl mx-auto px-6">
    <div className="glass rounded-2xl p-8 border border-slate-700">
      <div className="flex items-start gap-4">
        <Lightbulb className="text-yellow-400 flex-shrink-0 mt-1" size={24} />
        <div>
          <h3 className="font-semibold mb-2">Как это работает?</h3>
          <p className="text-slate-400 mb-4">
            Калькулятор использует энергетический метод из сопромата: энергия удара 
            преобразуется в работу деформации элемента. Сравнивая максимальные напряжения 
            с пределом текучести и пределом прочности материала, определяем зону работы.
          </p>
          <p className="text-slate-400 mb-4">
            Это <span className="text-emerald-400 font-semibold">детерминированный инструмент</span> — 
            он не использует ИИ для расчётов, только проверенные инженерные формулы. 
            ИИ был использован один раз — для создания этого калькулятора.
          </p>
          <p className="text-sm text-slate-500">
            ⚠️ Ограничения: калькулятор даёт оценку для типовых случаев нагружения. 
            Для сложных конструкций и критически важных применений используйте FEA-анализ (ANSYS, SolidWorks Simulation).
          </p>
        </div>
      </div>
    </div>
    
    {/* Ссылка на ИИ-лабораторию */}
    <div className="text-center mt-8">
      <p className="text-slate-500 mb-4">
        Этот инструмент создан Лабораторией ИИ как демонстрация детерминированных модулей
      </p>
      <Link to="/labs/ai" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300">
        Узнать больше о Лаборатории ИИ <ArrowRight size={16} />
      </Link>
    </div>
  </div>
</section>
```

---

## Компонент InputField

Создать переиспользуемый компонент:

```jsx
function InputField({ label, value, onChange, unit }) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:outline-none"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}
```

## Компонент ResultCard

```jsx
function ResultCard({ label, value, unit, color }) {
  return (
    <div className="glass rounded-xl p-4 text-center">
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className={`text-2xl font-bold text-${color}-400`}>
        {value} <span className="text-sm font-normal text-slate-500">{unit}</span>
      </div>
    </div>
  )
}
```

---

## Роутинг

Добавить в `App.jsx`:

```jsx
import ImpactCalculator from './pages/tools/ImpactCalculator'

// В Routes:
<Route path="/tools/impact-calculator" element={<ImpactCalculator />} />
```

## Ссылка с главной

Добавить ссылку на калькулятор на странице Лаборатории ИИ (`/labs/ai`):

```jsx
<section className="py-16">
  <div className="max-w-6xl mx-auto px-6">
    <div className="glass rounded-2xl p-8 border border-emerald-500/20">
      <div className="flex items-center gap-4 mb-4">
        <Calculator className="text-emerald-400" size={24} />
        <h2 className="text-xl font-bold">Попробуйте прототип инструмента</h2>
      </div>
      <p className="text-slate-400 mb-4">
        Калькулятор ударных нагрузок — пример детерминированного инструмента, 
        который работает мгновенно, без ИИ, без ошибок.
      </p>
      <Link 
        to="/tools/impact-calculator" 
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors"
      >
        Открыть калькулятор <ArrowRight size={16} />
      </Link>
    </div>
  </div>
</section>
```

---

## Импорты

```jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calculator, Cpu, Zap, Box, Ruler, Layers, 
  Lightbulb, ArrowRight, CheckCircle 
} from 'lucide-react'
```

---

## Проверка

```bash
npm run dev
```

1. Открыть `/tools/impact-calculator`
2. Выбрать тип элемента (консольная балка)
3. Задать геометрию (500×50×30 мм)
4. Выбрать материал (Сталь 45)
5. Ввести энергию удара (100 Дж)
6. Нажать "Рассчитать"
7. Проверить что результат отображается корректно
8. Попробовать разные комбинации — убедиться что зоны меняются

## Коммит

```bash
git add -A
git commit -m "feat(tools): add impact load calculator prototype"
git push
```

---

*Работать автономно. Создать полностью рабочий калькулятор с расчётами и визуализацией результатов.*
