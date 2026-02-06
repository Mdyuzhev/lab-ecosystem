import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Database, Zap, Search, XCircle, ArrowRight,
  AlertTriangle, Info, ChevronDown, Copy, Check,
} from 'lucide-react'
import ERDDiagram from '../../components/ERDDiagram'
import { parseDDL } from '../../utils/ddlParser'
import { demoEcommerce, demoTelecom, demoHR } from '../../data/erdDemos'

function StatCard({ label, value, color }) {
  const colors = {
    purple: 'text-purple-400',
    slate: 'text-slate-300',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
  }
  return (
    <div className="glass rounded-xl p-4 text-center">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${colors[color] || 'text-white'}`}>{value}</div>
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-white transition-colors"
      title="Копировать"
    >
      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
    </button>
  )
}

function WarningSection({ title, icon, color, warnings }) {
  const [open, setOpen] = useState(true)
  if (warnings.length === 0) return null

  const borderColor = {
    red: 'border-red-500/30',
    amber: 'border-amber-500/30',
    blue: 'border-blue-500/30',
  }
  const bgColor = {
    red: 'bg-red-500/5',
    amber: 'bg-amber-500/5',
    blue: 'bg-blue-500/5',
  }
  const textColor = {
    red: 'text-red-400',
    amber: 'text-amber-400',
    blue: 'text-blue-400',
  }

  return (
    <div className={`rounded-xl border ${borderColor[color]} ${bgColor[color]} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className={`font-medium text-sm ${textColor[color]}`}>
            {title} ({warnings.length})
          </span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-3 space-y-2">
          {warnings.map((w, i) => (
            <div key={i} className="text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-slate-500 mt-0.5">&#8226;</span>
                <div className="flex-1">
                  <span>{w.message}</span>
                  {w.suggestion && (
                    <div className="mt-1 flex items-center gap-2">
                      <code className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-purple-300">
                        {w.suggestion}
                      </code>
                      <CopyButton text={w.suggestion} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ERDBuilder() {
  const [ddlInput, setDDLInput] = useState('')
  const [schema, setSchema] = useState(null)
  const [selectedTable, setSelectedTable] = useState(null)
  const [hoveredTable, setHoveredTable] = useState(null)
  const [error, setError] = useState(null)

  function handleBuild() {
    try {
      setError(null)
      setSelectedTable(null)
      setHoveredTable(null)
      const result = parseDDL(ddlInput)
      if (Object.keys(result.tables).length === 0) {
        setError('Не найдено ни одного CREATE TABLE в DDL.')
        setSchema(null)
        return
      }
      setSchema(result)
    } catch (e) {
      setError(e.message)
      setSchema(null)
    }
  }

  function loadDemo(demo) {
    setDDLInput(demo)
    setError(null)
  }

  const totalColumns = schema
    ? Object.values(schema.tables).reduce((sum, t) => sum + t.columns.length, 0)
    : 0

  const dangerWarnings = schema ? schema.warnings.filter(w => w.level === 'danger') : []
  const warningWarnings = schema ? schema.warnings.filter(w => w.level === 'warning') : []
  const infoWarnings = schema ? schema.warnings.filter(w => w.level === 'info') : []

  const selectedTableData = schema && selectedTable ? schema.tables[selectedTable] : null

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span>На главную</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Database className="text-purple-400" size={16} />
            <span className="text-purple-400 text-sm font-medium">Прототип инструмента</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ERD <span className="text-purple-400">Builder</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mb-6">
            Вставьте CREATE TABLE — получите интерактивную диаграмму связей
            с анализом проблем: пропущенные индексы, таблицы-сироты, циклические зависимости.
          </p>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Zap className="text-yellow-400" size={16} />
            <span>Все работает в браузере — данные не покидают ваш компьютер</span>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">

          {/* Input */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Database className="text-purple-400" size={20} />
              DDL-схема
            </h3>

            <textarea
              value={ddlInput}
              onChange={(e) => setDDLInput(e.target.value)}
              placeholder="CREATE TABLE customers (&#10;    id SERIAL PRIMARY KEY,&#10;    email VARCHAR(255) NOT NULL UNIQUE,&#10;    ...&#10;);"
              rows={16}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 font-mono text-sm text-slate-300 resize-y focus:border-purple-500 focus:outline-none mb-4"
            />

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-slate-500">Примеры:</span>
              <button
                onClick={() => loadDemo(demoEcommerce)}
                className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 transition-colors"
              >
                Интернет-магазин
              </button>
              <button
                onClick={() => loadDemo(demoTelecom)}
                className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 transition-colors"
              >
                Телеком-биллинг
              </button>
              <button
                onClick={() => loadDemo(demoHR)}
                className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 transition-colors"
              >
                HR с проблемами
              </button>
            </div>

            <button
              onClick={handleBuild}
              disabled={!ddlInput.trim()}
              className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Search size={18} />
              Построить диаграмму
            </button>
          </motion.div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mb-6">
              <XCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Results */}
          {schema && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <StatCard label="Таблиц" value={Object.keys(schema.tables).length} color="purple" />
                <StatCard label="Колонок" value={totalColumns} color="slate" />
                <StatCard label="Связей (FK)" value={schema.relations.length} color="blue" />
                <StatCard label="Индексов" value={schema.indexes.length} color="slate" />
                <StatCard
                  label="Проблем"
                  value={schema.warnings.length}
                  color={dangerWarnings.length > 0 ? 'red' : warningWarnings.length > 0 ? 'amber' : 'slate'}
                />
              </div>

              {/* Diagram + Detail */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className={selectedTableData ? 'lg:w-[70%]' : 'w-full'}>
                  <ERDDiagram
                    schema={schema}
                    selectedTable={selectedTable}
                    hoveredTable={hoveredTable}
                    onSelectTable={setSelectedTable}
                    onHoverTable={setHoveredTable}
                  />
                </div>

                <AnimatePresence>
                  {selectedTableData && (
                    <motion.div
                      key={selectedTable}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 50, opacity: 0 }}
                      className="lg:w-[30%] glass rounded-xl p-5 self-start max-h-[600px] overflow-y-auto"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Database size={16} className="text-purple-400" />
                          {selectedTableData.name}
                        </h4>
                        <button onClick={() => setSelectedTable(null)} className="text-slate-500 hover:text-white text-xs">
                          &#10005;
                        </button>
                      </div>

                      {/* Columns */}
                      <div className="mb-4">
                        <h5 className="text-xs text-slate-500 mb-2 font-semibold">
                          Колонки ({selectedTableData.columns.length})
                        </h5>
                        <div className="space-y-1">
                          {selectedTableData.columns.map(col => (
                            <div key={col.name} className="flex items-center gap-2 text-xs">
                              <span className="w-4 text-center">
                                {col.isPK ? '\uD83D\uDD11' : col.isFK ? '\u2192' : col.isUnique ? '\u25C6' : ''}
                              </span>
                              <span className={`flex-1 ${col.isNullable ? 'text-slate-400' : 'text-slate-200'}`}>
                                {col.name}
                              </span>
                              <span className="text-slate-500 font-mono">{col.type}</span>
                              {col.isPK && <span className="text-yellow-400 text-[10px]">PK</span>}
                              {col.isFK && <span className="text-blue-400 text-[10px]">FK</span>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Indexes */}
                      {selectedTableData.indexes.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-xs text-slate-500 mb-2 font-semibold">
                            Индексы ({selectedTableData.indexes.length})
                          </h5>
                          <div className="space-y-1">
                            {selectedTableData.indexes.map(idx => (
                              <div key={idx.name} className="text-xs">
                                <span className="text-slate-300">{idx.name}</span>
                                <span className="text-slate-500 ml-1">({idx.columns.join(', ')})</span>
                                {idx.isUnique && <span className="text-purple-400 ml-1">UNIQUE</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Relations */}
                      {(selectedTableData.referencesTo.length > 0 || selectedTableData.referencedBy.length > 0) && (
                        <div className="mb-4">
                          <h5 className="text-xs text-slate-500 mb-2 font-semibold">Связи</h5>
                          <div className="space-y-1 text-xs">
                            {schema.relations
                              .filter(r => r.fromTable === selectedTable)
                              .map(r => (
                                <div key={r.id} className="text-blue-400">
                                  <span className="text-slate-500">{'\u2192'}</span> {r.toTable}.{r.toColumn}
                                  <span className="text-slate-600 ml-1">({r.fromColumn})</span>
                                </div>
                              ))
                            }
                            {schema.relations
                              .filter(r => r.toTable === selectedTable)
                              .map(r => (
                                <div key={r.id} className="text-emerald-400">
                                  <span className="text-slate-500">{'\u2190'}</span> {r.fromTable}.{r.fromColumn}
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )}

                      {/* Warnings */}
                      {selectedTableData.warnings.length > 0 && (
                        <div>
                          <h5 className="text-xs text-slate-500 mb-2 font-semibold">
                            Проблемы ({selectedTableData.warnings.length})
                          </h5>
                          <div className="space-y-2">
                            {selectedTableData.warnings.map((w, i) => (
                              <div
                                key={i}
                                className={`text-xs p-2 rounded border-l-2 ${
                                  w.level === 'danger'
                                    ? 'bg-red-500/10 border-red-500 text-red-300'
                                    : w.level === 'warning'
                                      ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                                      : 'bg-blue-500/10 border-blue-500 text-blue-300'
                                }`}
                              >
                                {w.message}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedTableData.warnings.length === 0 && (
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <span className="text-emerald-400">&#10003;</span> Проблем не обнаружено
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Warnings */}
              {schema.warnings.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="text-amber-400" size={20} />
                    Анализ схемы
                  </h3>

                  <WarningSection
                    title="Критичные"
                    icon={<XCircle size={16} className="text-red-400" />}
                    color="red"
                    warnings={dangerWarnings}
                  />
                  <WarningSection
                    title="Предупреждения"
                    icon={<AlertTriangle size={16} className="text-amber-400" />}
                    color="amber"
                    warnings={warningWarnings}
                  />
                  <WarningSection
                    title="Информация"
                    icon={<Info size={16} className="text-blue-400" />}
                    color="blue"
                    warnings={infoWarnings}
                  />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer info */}
      <section className="py-16 bg-slate-900/50 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="glass rounded-2xl p-8 border border-slate-700">
            <div className="flex items-start gap-4">
              <Database className="text-purple-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-2">Как это работает?</h3>
                <p className="text-slate-400 mb-4">
                  Инструмент парсит <code className="text-purple-400 text-sm">CREATE TABLE</code>,{' '}
                  <code className="text-purple-400 text-sm">ALTER TABLE</code> и{' '}
                  <code className="text-purple-400 text-sm">CREATE INDEX</code> SQL-команды,
                  строит интерактивную ERD-диаграмму и анализирует схему на типичные проблемы:
                  FK без индексов, таблицы-сироты, циклические зависимости.
                </p>
                <p className="text-slate-400 mb-4">
                  Это <span className="text-purple-400 font-semibold">клиентский инструмент</span> —
                  DDL-схемы обрабатываются только в вашем браузере.
                </p>
                <p className="text-sm text-slate-500">
                  Аналог dbdiagram.io, встроенный в экосистему инструментов.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-slate-500 mb-4">
              Этот инструмент создан Лабораторией ПО как демонстрация аналитических модулей
            </p>
            <Link to="/labs/software" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300">
              Узнать больше о Лаборатории ПО <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
