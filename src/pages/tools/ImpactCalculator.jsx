import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calculator, Cpu, Zap, Box, Ruler, Layers,
  Lightbulb, ArrowRight, ArrowLeft
} from 'lucide-react'

// Предустановленные материалы
const MATERIALS = [
  { id: 'steel-45', name: 'Сталь 45', E: 200, yieldStrength: 360, ultimateStrength: 600 },
  { id: 'steel-3', name: 'Сталь 3', E: 200, yieldStrength: 250, ultimateStrength: 450 },
  { id: 'aluminum-d16', name: 'Д16 (дюраль)', E: 72, yieldStrength: 280, ultimateStrength: 440 },
  { id: 'titanium-vt6', name: 'ВТ6 (титан)', E: 115, yieldStrength: 900, ultimateStrength: 1000 },
  { id: 'custom', name: 'Свой материал', E: null, yieldStrength: null, ultimateStrength: null },
]

// Типы элементов
const ELEMENT_TYPES = [
  { id: 'beam-cantilever', label: 'Консольная балка', icon: '📐' },
  { id: 'beam-supported', label: 'Балка на опорах', icon: '🔩' },
  { id: 'plate', label: 'Пластина', icon: '▬' },
  { id: 'rod', label: 'Стержень', icon: '│' },
]

// Компонент поля ввода
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

// Компонент карточки результата
function ResultCard({ label, value, unit, color }) {
  const colorClasses = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
  }

  return (
    <div className="glass rounded-xl p-4 text-center">
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${colorClasses[color] || 'text-white'}`}>
        {value} <span className="text-sm font-normal text-slate-500">{unit}</span>
      </div>
    </div>
  )
}

export default function ImpactCalculator() {
  const [inputs, setInputs] = useState({
    // Тип элемента
    elementType: 'beam-cantilever',

    // Тип сечения
    sectionType: 'rectangular',

    // Геометрия (в мм)
    length: 500,
    width: 50,
    height: 30,
    diameter: 40,
    outerDiameter: 50,
    innerDiameter: 40,

    // Материал
    material: 'steel-45',
    youngModulus: 200,
    yieldStrength: 360,
    ultimateStrength: 600,

    // Параметры удара
    impactType: 'energy',
    impactEnergy: 100,
    impactMass: 5,
    impactVelocity: 5,
  })

  const [results, setResults] = useState(null)

  // Выбор материала
  const selectMaterial = (mat) => {
    if (mat.id === 'custom') {
      setInputs({ ...inputs, material: 'custom' })
    } else {
      setInputs({
        ...inputs,
        material: mat.id,
        youngModulus: mat.E,
        yieldStrength: mat.yieldStrength,
        ultimateStrength: mat.ultimateStrength,
      })
    }
  }

  // Обновление поля
  const updateInput = (field, value) => {
    setInputs({ ...inputs, [field]: value })
  }

  // Функция расчёта
  const calculate = () => {
    // Переводим единицы: мм → м, ГПа → Па, МПа → Па
    const L = inputs.length / 1000
    const E = inputs.youngModulus * 1e9
    const sigma_t = inputs.yieldStrength * 1e6
    const sigma_v = inputs.ultimateStrength * 1e6

    // Момент инерции сечения
    let I, W, h_max
    if (inputs.sectionType === 'rectangular') {
      const b = inputs.width / 1000
      const h = inputs.height / 1000
      I = (b * Math.pow(h, 3)) / 12
      h_max = h / 2
      W = I / h_max
    } else if (inputs.sectionType === 'circular') {
      const d = inputs.diameter / 1000
      I = (Math.PI * Math.pow(d, 4)) / 64
      h_max = d / 2
      W = I / h_max
    } else {
      // tube
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

    // Коэффициент для разных типов элементов
    let stiffnessCoeff = 3 // консольная балка
    if (inputs.elementType === 'beam-supported') {
      stiffnessCoeff = 48 // балка на двух опорах, сила посередине
    } else if (inputs.elementType === 'plate' || inputs.elementType === 'rod') {
      stiffnessCoeff = 3 // упрощённо как консоль
    }

    // Статическая жёсткость
    const k = (stiffnessCoeff * E * I) / Math.pow(L, 3)

    // Из энергетического баланса: E = k*δ²/2 → δ = √(2E/k)
    const delta_dynamic = Math.sqrt((2 * E_impact) / k)

    // Динамическая сила
    const P_dynamic = k * delta_dynamic

    // Статический прогиб при той же силе
    const delta_static = P_dynamic * Math.pow(L, 3) / (stiffnessCoeff * E * I)

    // Коэффициент динамичности
    const K_d = delta_dynamic / delta_static || 1

    // Изгибающий момент
    let M
    if (inputs.elementType === 'beam-cantilever') {
      M = P_dynamic * L // на заделке
    } else if (inputs.elementType === 'beam-supported') {
      M = P_dynamic * L / 4 // в середине пролёта
    } else {
      M = P_dynamic * L
    }

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
      dynamicDeflection: delta_dynamic * 1000,
      dynamicForce: P_dynamic,
      dynamicCoefficient: K_d,
      bendingMoment: M,
      dynamicStress: sigma_dynamic / 1e6,
      yieldStrength: sigma_t / 1e6,
      ultimateStrength: sigma_v / 1e6,
      safetyYield: safety_yield,
      safetyUltimate: safety_ultimate,
      zone,
      zoneColor,
      zoneIcon,
    })
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <Link to="/labs/ai" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span>Назад к Лаборатории ИИ</span>
          </Link>

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

      {/* Калькулятор */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">

          {/* Тип элемента */}
          <div className="glass rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Box className="text-purple-400" size={20} />
              Тип элемента
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ELEMENT_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => updateInput('elementType', type.id)}
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

          {/* Геометрия */}
          <div className="glass rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Ruler className="text-blue-400" size={20} />
              Геометрия сечения
            </h3>

            <div className="flex gap-2 mb-4">
              {['rectangular', 'circular', 'tube'].map(type => (
                <button
                  key={type}
                  onClick={() => updateInput('sectionType', type)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    inputs.sectionType === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {type === 'rectangular' ? 'Прямоугольное' : type === 'circular' ? 'Круглое' : 'Труба'}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <InputField
                label="Длина, мм"
                value={inputs.length}
                onChange={(v) => updateInput('length', v)}
              />

              {inputs.sectionType === 'rectangular' && (
                <>
                  <InputField
                    label="Ширина, мм"
                    value={inputs.width}
                    onChange={(v) => updateInput('width', v)}
                  />
                  <InputField
                    label="Высота, мм"
                    value={inputs.height}
                    onChange={(v) => updateInput('height', v)}
                  />
                </>
              )}

              {inputs.sectionType === 'circular' && (
                <InputField
                  label="Диаметр, мм"
                  value={inputs.diameter}
                  onChange={(v) => updateInput('diameter', v)}
                />
              )}

              {inputs.sectionType === 'tube' && (
                <>
                  <InputField
                    label="Внешний диаметр, мм"
                    value={inputs.outerDiameter}
                    onChange={(v) => updateInput('outerDiameter', v)}
                  />
                  <InputField
                    label="Внутренний диаметр, мм"
                    value={inputs.innerDiameter}
                    onChange={(v) => updateInput('innerDiameter', v)}
                  />
                </>
              )}
            </div>
          </div>

          {/* Материал */}
          <div className="glass rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Layers className="text-amber-400" size={20} />
              Материал
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
              {MATERIALS.map(mat => (
                <button
                  key={mat.id}
                  onClick={() => selectMaterial(mat)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    inputs.material === mat.id
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="text-sm font-medium">{mat.name}</div>
                  {mat.E && <div className="text-xs text-slate-500">E={mat.E} ГПа</div>}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <InputField
                label="Модуль Юнга, ГПа"
                value={inputs.youngModulus}
                onChange={(v) => updateInput('youngModulus', v)}
              />
              <InputField
                label="Предел текучести, МПа"
                value={inputs.yieldStrength}
                onChange={(v) => updateInput('yieldStrength', v)}
              />
              <InputField
                label="Предел прочности, МПа"
                value={inputs.ultimateStrength}
                onChange={(v) => updateInput('ultimateStrength', v)}
              />
            </div>
          </div>

          {/* Параметры удара */}
          <div className="glass rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="text-red-400" size={20} />
              Параметры удара
            </h3>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => updateInput('impactType', 'energy')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  inputs.impactType === 'energy'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Энергия удара
              </button>
              <button
                onClick={() => updateInput('impactType', 'mass-velocity')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  inputs.impactType === 'mass-velocity'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Масса и скорость
              </button>
            </div>

            {inputs.impactType === 'energy' ? (
              <div className="max-w-xs">
                <InputField
                  label="Энергия удара, Дж"
                  value={inputs.impactEnergy}
                  onChange={(v) => updateInput('impactEnergy', v)}
                />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 max-w-lg">
                <InputField
                  label="Масса ударника, кг"
                  value={inputs.impactMass}
                  onChange={(v) => updateInput('impactMass', v)}
                />
                <InputField
                  label="Скорость удара, м/с"
                  value={inputs.impactVelocity}
                  onChange={(v) => updateInput('impactVelocity', v)}
                />
              </div>
            )}
          </div>

          {/* Кнопка расчёта */}
          <button
            onClick={calculate}
            className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calculator size={20} />
            Рассчитать
          </button>

          {/* Результаты */}
          {results && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Главный результат */}
              <div className={`glass rounded-2xl p-8 mb-6 border-2 ${
                results.zoneColor === 'emerald' ? 'border-emerald-500/50 bg-emerald-500/10' :
                results.zoneColor === 'amber' ? 'border-amber-500/50 bg-amber-500/10' :
                'border-red-500/50 bg-red-500/10'
              }`}>
                <div className="text-center">
                  <div className="text-6xl mb-4">{results.zoneIcon}</div>
                  <div className={`text-3xl font-bold mb-2 ${
                    results.zoneColor === 'emerald' ? 'text-emerald-400' :
                    results.zoneColor === 'amber' ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
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
                    className={`absolute top-0 bottom-0 w-1 ${
                      results.zoneColor === 'emerald' ? 'bg-emerald-400' :
                      results.zoneColor === 'amber' ? 'bg-amber-400' :
                      'bg-red-400'
                    }`}
                    style={{ left: `${Math.min((results.dynamicStress / results.ultimateStrength) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>0</span>
                  <span>σт = {results.yieldStrength} МПа</span>
                  <span>σв = {results.ultimateStrength} МПа</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Подвал с объяснением */}
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
                  Ограничения: калькулятор даёт оценку для типовых случаев нагружения.
                  Для сложных конструкций и критически важных применений используйте FEA-анализ (ANSYS, SolidWorks Simulation).
                </p>
              </div>
            </div>
          </div>

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
    </div>
  )
}
