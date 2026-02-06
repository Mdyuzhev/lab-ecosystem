import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Cpu, Zap, XCircle, AlertTriangle, CheckCircle,
  Database, Search, ArrowRight, Info, Clock, Layers, BarChart3,
} from 'lucide-react'
import ExplainTree from '../../components/ExplainTree'
import {
  parseExplainInput,
  analyzeWarnings,
  collectStats,
  resetNodeIdCounter,
} from '../../utils/explainParser'
import { demoSimple, demoMedium, demoComplex } from '../../data/explainDemos'

function StatCard({ label, value, color, icon: Icon }) {
  const colors = {
    slate: 'text-slate-300',
    amber: 'text-amber-400',
    red: 'text-red-400',
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
  }
  return (
    <div className="glass rounded-xl p-4 text-center">
      <div className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
        {Icon && <Icon size={12} />}
        {label}
      </div>
      <div className={`text-2xl font-bold ${colors[color] || 'text-white'}`}>{value}</div>
    </div>
  )
}

function formatMs(ms) {
  if (ms == null || ms === 0) return '—'
  if (ms < 1) return `${(ms * 1000).toFixed(0)} \u00B5s`
  if (ms < 1000) return `${ms.toFixed(2)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

function formatRows(n) {
  if (n == null) return '—'
  return Number(n).toLocaleString('ru-RU')
}

const NODE_ICONS = {
  'Seq Scan': '\uD83D\uDD0D',
  'Index Scan': '\u26A1',
  'Index Only Scan': '\u26A1',
  'Bitmap Heap Scan': '\uD83D\uDDC2',
  'Bitmap Index Scan': '\uD83D\uDDC2',
  'Hash Join': '\uD83D\uDD17',
  'Merge Join': '\uD83D\uDD17',
  'Nested Loop': '\uD83D\uDD17',
  'Sort': '\u2195\uFE0F',
  'Aggregate': '\u03A3',
  'GroupAggregate': '\u03A3',
  'HashAggregate': '\u03A3',
  'Hash': '#',
  'Limit': '\u2702\uFE0F',
}

function getNodeIcon(type) {
  return NODE_ICONS[type] || '\u25C6'
}

export default function ExplainVisualizer() {
  const [input, setInput] = useState('')
  const [parsedPlan, setParsedPlan] = useState(null)
  const [stats, setStats] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [error, setError] = useState(null)

  function handleVisualize() {
    try {
      setError(null)
      resetNodeIdCounter()
      const parsed = parseExplainInput(input)
      const analyzed = analyzeWarnings(parsed.root)
      const s = collectStats(analyzed, parsed)
      setParsedPlan({ ...parsed, root: analyzed })
      setStats(s)
      setSelectedNode(null)
    } catch (e) {
      setError(e.message)
      setParsedPlan(null)
      setStats(null)
    }
  }

  function loadDemo(demoData) {
    setInput(JSON.stringify(demoData, null, 2))
    setError(null)
  }

  function handleNodeClick(node) {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node))
  }

  const cacheHitTotal = stats ? stats.totalSharedHit + stats.totalSharedRead : 0
  const cacheHitRatio = cacheHitTotal > 0 ? (stats.totalSharedHit / cacheHitTotal) * 100 : 0

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span>На главную</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Cpu className="text-amber-400" size={16} />
            <span className="text-amber-400 text-sm font-medium">Прототип инструмента</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            EXPLAIN <span className="text-amber-400">Visualizer</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mb-6">
            Вставьте план выполнения PostgreSQL-запроса — получите интерактивное
            дерево с bottleneck-анализом и рекомендациями по оптимизации.
          </p>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Zap className="text-yellow-400" size={16} />
            <span>Всё работает в браузере — данные не покидают ваш компьютер</span>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">

          {/* Input */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Database className="text-amber-400" size={20} />
              План запроса
            </h3>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Вставьте JSON-вывод EXPLAIN (ANALYZE, FORMAT JSON)...'
              rows={12}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 font-mono text-sm text-slate-300 resize-y focus:border-amber-500 focus:outline-none mb-4"
            />

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-slate-500">Примеры:</span>
              <button
                onClick={() => loadDemo(demoSimple)}
                className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 transition-colors"
              >
                Простой запрос
              </button>
              <button
                onClick={() => loadDemo(demoMedium)}
                className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 transition-colors"
              >
                Join + Seq Scan
              </button>
              <button
                onClick={() => loadDemo(demoComplex)}
                className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 transition-colors"
              >
                Сложный план
              </button>
            </div>

            <button
              onClick={handleVisualize}
              disabled={!input.trim()}
              className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Search size={18} />
              Визуализировать
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
          {parsedPlan && stats && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              {/* Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <StatCard label="Общее время" value={formatMs(stats.totalTime)} color="amber" icon={Clock} />
                <StatCard label="Planning" value={formatMs(stats.planningTime)} color="slate" icon={Clock} />
                <StatCard label="Execution" value={formatMs(stats.executionTime)} color="amber" icon={Clock} />
                <StatCard label="Узлов" value={stats.nodeCount} color="slate" icon={Layers} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <StatCard label="Danger" value={stats.dangerCount} color="red" icon={XCircle} />
                <StatCard label="Warning" value={stats.warningCount} color="amber" icon={AlertTriangle} />
                <StatCard label="Info" value={stats.infoCount} color="blue" icon={Info} />
                <StatCard label="Глубина" value={stats.maxDepth} color="slate" icon={BarChart3} />
              </div>

              {/* Cache hit ratio */}
              {cacheHitTotal > 0 && (
                <div className="glass rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">
                      Shared Buffers: Hit {cacheHitRatio.toFixed(1)}% ({formatRows(stats.totalSharedHit)} blocks)
                      {' | '}Read {(100 - cacheHitRatio).toFixed(1)}% ({formatRows(stats.totalSharedRead)} blocks)
                    </span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cacheHitRatio > 90 ? 'bg-emerald-500' : cacheHitRatio > 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${cacheHitRatio}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Tree + Details */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="text-amber-400" size={20} />
                  Дерево выполнения
                </h3>

                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Tree */}
                  <div className={selectedNode ? 'lg:w-[70%]' : 'w-full'}>
                    <ExplainTree
                      root={parsedPlan.root}
                      onNodeClick={handleNodeClick}
                      selectedNodeId={selectedNode?.id ?? null}
                    />
                  </div>

                  {/* Detail panel */}
                  <AnimatePresence>
                    {selectedNode && (
                      <motion.div
                        key={selectedNode.id}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 50, opacity: 0 }}
                        className="lg:w-[30%] glass rounded-xl p-5 self-start"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <span>{getNodeIcon(selectedNode.type)}</span>
                            {selectedNode.type}
                            {selectedNode.relation && (
                              <span className="text-slate-400 font-normal">on {selectedNode.relation}</span>
                            )}
                          </h4>
                          <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-white text-xs">
                            ✕
                          </button>
                        </div>

                        {/* Timing */}
                        <div className="mb-4">
                          <h5 className="text-xs text-slate-500 mb-1 font-semibold">Время</h5>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Startup</span>
                              <span className="font-mono text-slate-300">{formatMs(selectedNode.actualStartupTime)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Total</span>
                              <span className="font-mono text-slate-300">{formatMs(selectedNode.actualTotalTime)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Exclusive</span>
                              <span className="font-mono text-amber-400">
                                {formatMs(selectedNode.exclusiveTime)} ({selectedNode.timePercent.toFixed(1)}%)
                              </span>
                            </div>
                            {selectedNode.actualLoops > 1 && (
                              <div className="flex justify-between">
                                <span className="text-slate-400">Loops</span>
                                <span className="font-mono text-slate-300">{formatRows(selectedNode.actualLoops)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Rows */}
                        <div className="mb-4">
                          <h5 className="text-xs text-slate-500 mb-1 font-semibold">Строки</h5>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-400">План</span>
                              <span className="font-mono text-slate-300">{formatRows(selectedNode.planRows)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Факт</span>
                              <span className="font-mono text-slate-300">
                                {formatRows(selectedNode.actualRows)}
                                {selectedNode.planRows > 0 && selectedNode.actualRows !== null && (
                                  <span className="text-slate-500"> (x{(selectedNode.actualRows / selectedNode.planRows).toFixed(1)})</span>
                                )}
                              </span>
                            </div>
                            {selectedNode.rowsRemovedByFilter > 0 && (
                              <div className="flex justify-between">
                                <span className="text-slate-400">Отброшено</span>
                                <span className="font-mono text-amber-400">{formatRows(selectedNode.rowsRemovedByFilter)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Buffers */}
                        {(selectedNode.sharedHitBlocks > 0 || selectedNode.sharedReadBlocks > 0) && (
                          <div className="mb-4">
                            <h5 className="text-xs text-slate-500 mb-1 font-semibold">Буферы</h5>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Shared Hit</span>
                                <span className="font-mono text-slate-300">{formatRows(selectedNode.sharedHitBlocks)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Shared Read</span>
                                <span className="font-mono text-slate-300">{formatRows(selectedNode.sharedReadBlocks)}</span>
                              </div>
                              {selectedNode.sharedHitBlocks > 0 && selectedNode.sharedReadBlocks > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Hit Ratio</span>
                                  <span className="font-mono text-slate-300">
                                    {((selectedNode.sharedHitBlocks / (selectedNode.sharedHitBlocks + selectedNode.sharedReadBlocks)) * 100).toFixed(1)}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Conditions */}
                        {(selectedNode.filter || selectedNode.indexCond || selectedNode.hashCond || selectedNode.recheckCond) && (
                          <div className="mb-4">
                            <h5 className="text-xs text-slate-500 mb-1 font-semibold">Условия</h5>
                            <div className="space-y-1">
                              {selectedNode.filter && (
                                <p className="text-xs font-mono text-slate-300 bg-slate-800 rounded px-2 py-1">
                                  Filter: {selectedNode.filter}
                                </p>
                              )}
                              {selectedNode.indexCond && (
                                <p className="text-xs font-mono text-slate-300 bg-slate-800 rounded px-2 py-1">
                                  Index Cond: {selectedNode.indexCond}
                                </p>
                              )}
                              {selectedNode.hashCond && (
                                <p className="text-xs font-mono text-slate-300 bg-slate-800 rounded px-2 py-1">
                                  Hash Cond: {selectedNode.hashCond}
                                </p>
                              )}
                              {selectedNode.recheckCond && (
                                <p className="text-xs font-mono text-slate-300 bg-slate-800 rounded px-2 py-1">
                                  Recheck: {selectedNode.recheckCond}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Sort info */}
                        {selectedNode.sortMethod && (
                          <div className="mb-4">
                            <h5 className="text-xs text-slate-500 mb-1 font-semibold">Сортировка</h5>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Метод</span>
                                <span className="font-mono text-slate-300">{selectedNode.sortMethod}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Память</span>
                                <span className={`font-mono ${selectedNode.sortSpaceType === 'Disk' ? 'text-red-400' : 'text-slate-300'}`}>
                                  {formatRows(selectedNode.sortSpaceUsed)} kB ({selectedNode.sortSpaceType})
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Warnings */}
                        {selectedNode.warnings.length > 0 && (
                          <div>
                            <h5 className="text-xs text-slate-500 mb-2 font-semibold">Предупреждения</h5>
                            <div className="space-y-2">
                              {selectedNode.warnings.map((w, i) => (
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Top-3 slowest */}
              {stats.slowestNodes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-sm text-slate-400">Самые медленные узлы</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {stats.slowestNodes.map((node, i) => {
                      const medals = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49']
                      return (
                        <button
                          key={node.id}
                          onClick={() => setSelectedNode(node)}
                          className="glass rounded-xl p-4 text-left hover:border-amber-500/30 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span>{medals[i]}</span>
                            <span className="text-sm font-semibold">
                              {getNodeIcon(node.type)} {node.type}
                              {node.relation ? ` on ${node.relation}` : ''}
                            </span>
                          </div>
                          <div className="text-xs text-amber-400 font-mono">
                            {formatMs(node.exclusiveTime)} ({node.timePercent.toFixed(1)}%)
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatRows(node.actualRows)} rows
                          </div>
                        </button>
                      )
                    })}
                  </div>
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
              <Database className="text-amber-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-2">Как это работает?</h3>
                <p className="text-slate-400 mb-4">
                  Инструмент парсит JSON-вывод PostgreSQL <code className="text-amber-400 text-sm">EXPLAIN (ANALYZE, FORMAT JSON)</code>,
                  строит дерево выполнения, вычисляет exclusive time каждого узла и анализирует
                  8 типов проблем: Seq Scan на больших таблицах, сортировка на диске, промахи кеша и другие.
                </p>
                <p className="text-slate-400 mb-4">
                  Это <span className="text-amber-400 font-semibold">клиентский инструмент</span> —
                  планы запросов обрабатываются только в вашем браузере.
                </p>
                <p className="text-sm text-slate-500">
                  Аналог explain.dalibo.com, встроенный в экосистему инструментов.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-slate-500 mb-4">
              Этот инструмент создан Лабораторией ПО как демонстрация аналитических модулей
            </p>
            <Link to="/labs/software" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300">
              Узнать больше о Лаборатории ПО <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
