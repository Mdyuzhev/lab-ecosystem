# TASK: Добавить визуализацию напряжений в калькулятор ударных нагрузок

## Цель

Добавить интерактивную SVG-визуализацию на страницу калькулятора, которая показывает схему нагружения и распределение напряжений с градиентом как в FEA-анализе.

## Файл для редактирования

`src/pages/tools/ImpactCalculator.jsx`

---

## Что добавить

### 1. Компонент визуализации StressVisualization

Создать SVG-компонент, который показывает:

- Консольную балку (закреплённый конец слева)
- Ударник/груз сверху
- Градиентную заливку балки по напряжениям (зелёный → жёлтый → красный)
- Деформированную форму балки (изгиб)

```jsx
function StressVisualization({ results, inputs }) {
  // Если нет результатов — показываем статичную схему
  // Если есть — показываем деформацию и градиент напряжений
  
  const maxDeflection = results?.dynamicDeflection || 0
  const stressRatio = results ? results.dynamicStress / results.ultimateStrength : 0
  
  // Цвет в зависимости от напряжения
  const getStressColor = (ratio) => {
    if (ratio < 0.6) return '#10b981' // emerald - безопасно
    if (ratio < 0.8) return '#f59e0b' // amber - внимание
    if (ratio < 1.0) return '#f97316' // orange - опасно
    return '#ef4444' // red - разрушение
  }

  return (
    <div className="glass rounded-2xl p-6 mb-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Eye className="text-purple-400" size={20} />
        Визуализация нагружения
      </h3>
      
      <svg viewBox="0 0 500 200" className="w-full h-48">
        <defs>
          {/* Градиент напряжений вдоль балки */}
          <linearGradient id="stressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" /> {/* Максимум у заделки */}
            <stop offset="30%" stopColor="#f97316" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" /> {/* Минимум на конце */}
          </linearGradient>
          
          {/* Градиент для безопасной балки */}
          <linearGradient id="safeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          
          {/* Паттерн штриховки для заделки */}
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8">
            <path d="M0,8 L8,0" stroke="#475569" strokeWidth="1.5"/>
          </pattern>
        </defs>
        
        {/* Фон */}
        <rect x="0" y="0" width="500" height="200" fill="#0f172a" rx="8"/>
        
        {/* Сетка (опционально) */}
        {[50, 100, 150].map(y => (
          <line key={y} x1="60" y1={y} x2="480" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4"/>
        ))}
        
        {/* Заделка (стена слева) */}
        <rect x="20" y="60" width="40" height="80" fill="url(#hatch)" stroke="#475569" strokeWidth="2"/>
        <rect x="55" y="60" width="8" height="80" fill="#334155"/>
        
        {/* Балка — с деформацией если есть результаты */}
        {results ? (
          <path
            d={`M 63 100 
                Q ${63 + 200} ${100 + maxDeflection * 2} 
                  ${63 + 380} ${100 + maxDeflection * 3}`}
            stroke="url(#stressGradient)"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <rect x="63" y="90" width="380" height="20" fill="url(#safeGradient)" rx="2"/>
        )}
        
        {/* Ударник */}
        <g transform={results ? "translate(0, 10)" : ""}>
          {/* Стрелка силы */}
          <line x1="420" y1="30" x2="420" y2="70" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrowhead)"/>
          <polygon points="420,75 415,65 425,65" fill="#f59e0b"/>
          
          {/* Груз */}
          <rect x="400" y="10" width="40" height="25" fill="#64748b" rx="3"/>
          <text x="420" y="27" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
            {inputs.impactType === 'energy' ? `${inputs.impactEnergy}Дж` : `${inputs.impactMass}кг`}
          </text>
        </g>
        
        {/* Размерные линии */}
        <g stroke="#64748b" strokeWidth="1" fill="#64748b" fontSize="10">
          {/* Длина */}
          <line x1="63" y1="160" x2="443" y2="160"/>
          <line x1="63" y1="155" x2="63" y2="165"/>
          <line x1="443" y1="155" x2="443" y2="165"/>
          <text x="253" y="175" textAnchor="middle">L = {inputs.length} мм</text>
        </g>
        
        {/* Легенда напряжений */}
        {results && (
          <g>
            <rect x="350" y="130" width="120" height="20" rx="3">
              <defs>
                <linearGradient id="legendGradient">
                  <stop offset="0%" stopColor="#10b981"/>
                  <stop offset="50%" stopColor="#f59e0b"/>
                  <stop offset="100%" stopColor="#ef4444"/>
                </linearGradient>
              </defs>
            </rect>
            <rect x="350" y="130" width="120" height="15" fill="url(#legendGradient)" rx="2"/>
            <text x="350" y="158" fill="#64748b" fontSize="8">0</text>
            <text x="470" y="158" fill="#64748b" fontSize="8" textAnchor="end">σmax</text>
          </g>
        )}
        
        {/* Индикатор результата */}
        {results && (
          <g>
            <circle 
              cx="450" 
              cy="50" 
              r="20" 
              fill={results.zoneColor === 'emerald' ? '#10b981' : results.zoneColor === 'amber' ? '#f59e0b' : '#ef4444'}
              opacity="0.2"
            />
            <text 
              x="450" 
              y="55" 
              textAnchor="middle" 
              fontSize="24"
            >
              {results.zoneIcon}
            </text>
          </g>
        )}
      </svg>
      
      {/* Подпись */}
      <div className="flex justify-between text-xs text-slate-500 mt-2">
        <span>Заделка</span>
        <span>Схема: консольная балка с ударной нагрузкой</span>
        <span>Свободный конец</span>
      </div>
    </div>
  )
}
```

### 2. Альтернативный вариант — анимированная визуализация

Более продвинутая версия с CSS-анимациями:

```jsx
function AnimatedStressVisualization({ results, inputs }) {
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    if (results) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [results])

  return (
    <div className="glass rounded-2xl p-6 mb-6 overflow-hidden">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Eye className="text-purple-400" size={20} />
        Визуализация нагружения
      </h3>
      
      <div className="relative h-48 bg-slate-950 rounded-xl overflow-hidden">
        {/* Фоновая сетка */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}/>
        
        {/* Заделка */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-24 bg-slate-700 rounded-r-sm"
             style={{ background: 'repeating-linear-gradient(45deg, #334155, #334155 4px, #475569 4px, #475569 8px)' }}/>
        
        {/* Балка */}
        <div 
          className={`absolute left-12 top-1/2 h-5 rounded-r transition-all duration-500 ${isAnimating ? 'animate-pulse' : ''}`}
          style={{
            width: '75%',
            transform: results 
              ? `translateY(-50%) perspective(500px) rotateX(${Math.min(results.dynamicDeflection / 2, 15)}deg)` 
              : 'translateY(-50%)',
            background: results 
              ? `linear-gradient(90deg, 
                  ${results.zoneColor === 'emerald' ? '#10b981' : results.zoneColor === 'amber' ? '#f59e0b' : '#ef4444'} 0%, 
                  ${results.zoneColor === 'emerald' ? '#34d399' : results.zoneColor === 'amber' ? '#fbbf24' : '#f87171'} 100%)`
              : 'linear-gradient(90deg, #10b981, #34d399)',
            boxShadow: results 
              ? `0 ${Math.min(results.dynamicDeflection, 20)}px ${Math.min(results.dynamicDeflection * 2, 40)}px -10px ${
                  results.zoneColor === 'emerald' ? 'rgba(16, 185, 129, 0.5)' : 
                  results.zoneColor === 'amber' ? 'rgba(245, 158, 11, 0.5)' : 
                  'rgba(239, 68, 68, 0.5)'
                }`
              : '0 4px 20px -10px rgba(16, 185, 129, 0.5)'
          }}
        />
        
        {/* Ударник */}
        <div 
          className={`absolute right-16 transition-all duration-300 ${isAnimating ? 'top-1/3' : 'top-8'}`}
          style={{ transform: 'translateX(50%)' }}
        >
          <div className="w-10 h-10 bg-slate-600 rounded flex items-center justify-center text-xs text-white font-bold">
            {inputs.impactType === 'energy' ? `${inputs.impactEnergy}J` : `${inputs.impactMass}kg`}
          </div>
          <div className="w-0.5 h-8 bg-amber-500 mx-auto"/>
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-amber-500 mx-auto"/>
        </div>
        
        {/* Индикатор прогиба */}
        {results && (
          <div className="absolute bottom-4 right-4 glass rounded-lg px-3 py-1">
            <span className="text-xs text-slate-400">Прогиб: </span>
            <span className={`text-sm font-bold text-${results.zoneColor}-400`}>
              {results.dynamicDeflection.toFixed(1)} мм
            </span>
          </div>
        )}
        
        {/* Градиентная шкала напряжений */}
        {results && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="w-24 h-3 rounded" style={{
              background: 'linear-gradient(90deg, #10b981, #f59e0b, #ef4444)'
            }}/>
            <span className="text-xs text-slate-500">σ</span>
          </div>
        )}
      </div>
      
      {/* Подписи */}
      <div className="flex justify-between items-center mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-slate-600 rounded-sm"/> Заделка
        </span>
        <span>Консольная балка • L = {inputs.length} мм</span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-amber-500 rounded-full"/> Удар
        </span>
      </div>
    </div>
  )
}
```

### 3. Где разместить визуализацию

Добавить компонент ПЕРЕД блоком результатов, после формы ввода:

```jsx
{/* Форма ввода */}
...

{/* Кнопка расчёта */}
<button onClick={calculate}>Рассчитать</button>

{/* ВИЗУАЛИЗАЦИЯ — новый блок */}
<StressVisualization results={results} inputs={inputs} />

{/* Результаты */}
{results && (
  <div className="mt-8">
    ...
  </div>
)}
```

### 4. Импорты

Добавить в импорты:

```jsx
import { Eye } from 'lucide-react'
```

И если используется анимация:

```jsx
import { useState, useEffect } from 'react'
```

---

## Дополнительные улучшения

### Анимация при расчёте

Добавить плавную анимацию удара при нажатии "Рассчитать":

```jsx
const [isCalculating, setIsCalculating] = useState(false)

const calculate = () => {
  setIsCalculating(true)
  
  // Задержка для анимации
  setTimeout(() => {
    // ... существующий код расчёта ...
    setIsCalculating(false)
  }, 500)
}
```

### Подсветка зон на балке

Для более наглядного отображения распределения напряжений можно разбить балку на сегменты с разными цветами:

```jsx
{/* Сегментированная балка */}
{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
  const segmentStress = 1 - (i / 8) // Напряжение убывает от заделки
  const hue = segmentStress < 0.5 ? 120 : segmentStress < 0.8 ? 60 : 0 // green -> yellow -> red
  return (
    <rect
      key={i}
      x={63 + i * 47.5}
      y={90}
      width={47.5}
      height={20}
      fill={`hsl(${hue}, 70%, 50%)`}
      opacity={0.8 + segmentStress * 0.2}
    />
  )
})}
```

---

## Проверка

```bash
npm run dev
```

1. Открыть `/tools/impact-calculator`
2. Должна отображаться схема балки с заделкой и ударником
3. При нажатии "Рассчитать" балка должна "прогнуться"
4. Цвет балки должен меняться в зависимости от напряжений (зелёный → жёлтый → красный)
5. Должна отображаться шкала напряжений

## Коммит

```bash
git add -A
git commit -m "feat(tools): add stress visualization to impact calculator"
git push
```

---

*Работать автономно. Выбрать один из вариантов визуализации (SVG или CSS) и интегрировать в калькулятор.*
