import { useState, useMemo, useCallback, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Papa from 'papaparse'
import {
  ArrowLeft, Upload, Database, FileSpreadsheet,
  Search, Download, AlertTriangle,
  CheckCircle, XCircle, BarChart3, Settings,
  ChevronDown, ChevronRight, Loader2, Zap, Cpu
} from 'lucide-react'
import { reconcileData } from '../../utils/reconcileData'

const PAGE_SIZE = 25

function DropZone({ label, file, onFile, onClear }) {
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) parseFile(f)
  }

  const parseFile = (f) => {
    Papa.parse(f, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (res) => {
        if (res.meta.fields && res.meta.fields.length <= 1) {
          Papa.parse(f, {
            header: true,
            delimiter: ',',
            skipEmptyLines: true,
            encoding: 'UTF-8',
            complete: (res2) => {
              onFile({
                name: f.name,
                data: res2.data,
                columns: res2.meta.fields || [],
              })
            },
          })
        } else {
          onFile({
            name: f.name,
            data: res.data,
            columns: res.meta.fields || [],
          })
        }
      },
    })
  }

  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
        <FileSpreadsheet className="text-blue-400" size={18} />
        {label}
      </h3>

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.csv'
            input.onchange = (e) => {
              if (e.target.files[0]) parseFile(e.target.files[0])
            }
            input.click()
          }}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-500/10'
              : 'border-slate-600 hover:border-slate-500'
          }`}
        >
          <Upload className="mx-auto mb-2 text-slate-500" size={32} />
          <p className="text-sm text-slate-400">Перетащите CSV или нажмите</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-emerald-400" size={16} />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
            <button onClick={onClear} className="text-slate-500 hover:text-red-400 text-xs">
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-2">
            {file.data.length} строк, {file.columns.length} колонок
          </p>
          <div className="overflow-x-auto">
            <table className="text-xs text-slate-400 w-full">
              <thead>
                <tr>
                  {file.columns.map((c) => (
                    <th key={c} className="px-2 py-1 text-left font-medium text-slate-500 whitespace-nowrap">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {file.data.slice(0, 3).map((row, i) => (
                  <tr key={i}>
                    {file.columns.map((c) => (
                      <td key={c} className="px-2 py-1 whitespace-nowrap max-w-[150px] truncate">
                        {row[c]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color, icon: Icon }) {
  const colors = {
    slate: 'text-slate-300',
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
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

export default function DataReconciliation() {
  const [fileA, setFileA] = useState(null)
  const [fileB, setFileB] = useState(null)
  const [config, setConfig] = useState({
    keyA: '', keyB: '', compareFields: [], normalizeKey: 'none',
  })
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [filters, setFilters] = useState({ status: 'all', search: '' })
  const [sortField, setSortField] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRow, setExpandedRow] = useState(null)
  const [openAccordions, setOpenAccordions] = useState({ onlyA: false, onlyB: false, diffs: true })
  const [loading, setLoading] = useState(false)

  const loadDemo = useCallback(async () => {
    setLoading(true)
    try {
      const base = import.meta.env.BASE_URL
      const [textA, textB] = await Promise.all([
        fetch(`${base}demo-data/billing_q4_2025.csv`).then((r) => r.text()),
        fetch(`${base}demo-data/crm_clients.csv`).then((r) => r.text()),
      ])
      const parsedA = Papa.parse(textA, { header: true, delimiter: ';', skipEmptyLines: true })
      const parsedB = Papa.parse(textB, { header: true, delimiter: ';', skipEmptyLines: true })
      setFileA({ name: 'billing_q4_2025.csv', data: parsedA.data, columns: parsedA.meta.fields })
      setFileB({ name: 'crm_clients.csv', data: parsedB.data, columns: parsedB.meta.fields })
      setConfig({
        keyA: 'inn',
        keyB: 'inn',
        normalizeKey: 'inn',
        compareFields: [
          { fieldA: 'phone', fieldB: 'phone', mode: 'phone', tolerance: 0 },
        ],
      })
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const addCompareField = () => {
    setConfig({
      ...config,
      compareFields: [...config.compareFields, { fieldA: '', fieldB: '', mode: 'exact', tolerance: 0 }],
    })
  }

  const updateCompareField = (index, key, value) => {
    const fields = [...config.compareFields]
    fields[index] = { ...fields[index], [key]: value }
    setConfig({ ...config, compareFields: fields })
  }

  const removeCompareField = (index) => {
    setConfig({ ...config, compareFields: config.compareFields.filter((_, i) => i !== index) })
  }

  const runReconciliation = () => {
    if (!fileA || !fileB || !config.keyA || !config.keyB) return
    const result = reconcileData(fileA.data, fileB.data, config)
    setResults(result)
    setActiveTab('dashboard')
    setCurrentPage(1)
    setFilters({ status: 'all', search: '' })
  }

  const allRows = useMemo(() => {
    if (!results) return []
    return [
      ...results.matched.map((m) => ({ ...m, type: m.status === 'ok' ? 'ok' : 'diff' })),
      ...results.onlyInA.map((m) => ({ ...m, type: 'onlyA' })),
      ...results.onlyInB.map((m) => ({ ...m, type: 'onlyB' })),
    ]
  }, [results])

  const filteredRows = useMemo(() => {
    let rows = allRows
    if (filters.status !== 'all') {
      rows = rows.filter((r) => r.type === filters.status)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      rows = rows.filter((r) => {
        const keyVal = String(r.keyValue || '').toLowerCase()
        if (keyVal.includes(q)) return true
        const rowData = r.rowA || r.rowB || r.row || {}
        return Object.values(rowData).some((v) => String(v || '').toLowerCase().includes(q))
      })
    }
    if (sortField) {
      rows = [...rows].sort((a, b) => {
        const va = String(a.keyValue || '')
        const vb = String(b.keyValue || '')
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      })
    }
    return rows
  }, [allRows, filters, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const pageRows = filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const exportResults = () => {
    if (!results) return
    const rows = []
    results.matched.forEach((m) => {
      rows.push({
        status: m.status === 'ok' ? 'Совпало' : 'Расхождение',
        key: m.keyValue,
        diffs: m.diffs.map((d) => `${d.field}: ${d.valueA} ≠ ${d.valueB}`).join(' | '),
        ...Object.fromEntries(Object.entries(m.rowA).map(([k, v]) => [`A_${k}`, v])),
        ...Object.fromEntries(Object.entries(m.rowB).map(([k, v]) => [`B_${k}`, v])),
      })
    })
    results.onlyInA.forEach((m) => {
      rows.push({
        status: 'Только в A',
        key: m.keyValue,
        ...Object.fromEntries(Object.entries(m.row).map(([k, v]) => [`A_${k}`, v])),
      })
    })
    results.onlyInB.forEach((m) => {
      rows.push({
        status: 'Только в B',
        key: m.keyValue,
        ...Object.fromEntries(Object.entries(m.row).map(([k, v]) => [`B_${k}`, v])),
      })
    })
    const csv = Papa.unparse(rows, { delimiter: ';' })
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reconciliation_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const statusIcon = (type) => {
    if (type === 'ok') return <CheckCircle className="text-emerald-400" size={16} />
    if (type === 'diff') return <AlertTriangle className="text-amber-400" size={16} />
    if (type === 'onlyA') return <XCircle className="text-red-400" size={16} />
    return <XCircle className="text-red-400" size={16} />
  }

  const statusLabel = (type) => {
    if (type === 'ok') return 'OK'
    if (type === 'diff') return 'Расх.'
    if (type === 'onlyA') return 'Только A'
    return 'Только B'
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span>На главную</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Cpu className="text-blue-400" size={16} />
            <span className="text-blue-400 text-sm font-medium">Прототип инструмента</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Сверка <span className="text-blue-400">данных</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mb-6">
            Загрузите два файла из разных систем — получите единый отчёт
            с расхождениями, пропусками и аномалиями.
          </p>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Zap className="text-yellow-400" size={16} />
            <span>Всё работает в браузере — данные не покидают ваш компьютер</span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">

          {/* Upload zone */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <DropZone label="Источник A" file={fileA} onFile={setFileA} onClear={() => { setFileA(null); setResults(null) }} />
              <DropZone label="Источник B" file={fileB} onFile={setFileB} onClear={() => { setFileB(null); setResults(null) }} />
            </div>

            <button
              onClick={loadDemo}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Database size={16} />}
              Загрузить демо-данные
            </button>
          </motion.div>

          {/* Config */}
          {fileA && fileB && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="text-blue-400" size={20} />
                Настройка сверки
              </h3>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Ключ файла A</label>
                  <select
                    value={config.keyA}
                    onChange={(e) => setConfig({ ...config, keyA: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">— выбрать —</option>
                    {fileA.columns.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Ключ файла B</label>
                  <select
                    value={config.keyB}
                    onChange={(e) => setConfig({ ...config, keyB: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">— выбрать —</option>
                    {fileB.columns.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Нормализация ключа</label>
                  <select
                    value={config.normalizeKey}
                    onChange={(e) => setConfig({ ...config, normalizeKey: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="none">Нет</option>
                    <option value="phone">Телефон</option>
                    <option value="inn">ИНН</option>
                  </select>
                </div>
              </div>

              {/* Compare fields */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Поля для сравнения</span>
                  <button onClick={addCompareField} className="text-xs text-blue-400 hover:text-blue-300">
                    + Добавить поле
                  </button>
                </div>

                {config.compareFields.length > 0 && (
                  <div className="space-y-2">
                    {config.compareFields.map((cf, i) => (
                      <div key={i} className="grid grid-cols-[1fr_1fr_1fr_80px_32px] gap-2 items-end">
                        <select
                          value={cf.fieldA}
                          onChange={(e) => updateCompareField(i, 'fieldA', e.target.value)}
                          className="px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">Поле A</option>
                          {fileA.columns.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                          value={cf.fieldB}
                          onChange={(e) => updateCompareField(i, 'fieldB', e.target.value)}
                          className="px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">Поле B</option>
                          {fileB.columns.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                          value={cf.mode}
                          onChange={(e) => updateCompareField(i, 'mode', e.target.value)}
                          className="px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs focus:border-blue-500 focus:outline-none"
                        >
                          <option value="exact">Точное</option>
                          <option value="fuzzy">Нечёткое</option>
                          <option value="numeric">Числовое</option>
                          <option value="phone">Телефон</option>
                          <option value="inn">ИНН</option>
                        </select>
                        {cf.mode === 'numeric' ? (
                          <input
                            type="number"
                            value={cf.tolerance}
                            onChange={(e) => updateCompareField(i, 'tolerance', parseFloat(e.target.value) || 0)}
                            placeholder="Допуск"
                            className="px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs focus:border-blue-500 focus:outline-none"
                          />
                        ) : (
                          <div />
                        )}
                        <button onClick={() => removeCompareField(i)} className="text-slate-500 hover:text-red-400 text-xs py-1.5">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={runReconciliation}
                disabled={!config.keyA || !config.keyB}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search size={18} />
                Запустить сверку
              </button>
            </motion.div>
          )}

          {/* Results */}
          {results && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Tabs */}
              <div className="flex gap-1 mb-6 border-b border-slate-800">
                {[
                  { id: 'dashboard', label: 'Сводка', icon: BarChart3 },
                  { id: 'table', label: 'Таблица', icon: FileSpreadsheet },
                  { id: 'issues', label: `Расхождения (${results.stats.matchedDiff + results.stats.onlyInACount + results.stats.onlyInBCount})`, icon: AlertTriangle },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setCurrentPage(1) }}
                    className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors border-b-2 -mb-px ${
                      activeTab === tab.id
                        ? 'border-blue-400 text-white'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Dashboard tab */}
              {activeTab === 'dashboard' && (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <StatCard label="Записей в A" value={results.stats.totalA} color="slate" icon={Database} />
                    <StatCard label="Записей в B" value={results.stats.totalB} color="slate" icon={Database} />
                    <StatCard label="Совпало" value={results.stats.matchedCount} color="blue" />
                    <StatCard
                      label="Совпало %"
                      value={results.stats.totalA > 0 ? `${Math.round((results.stats.matchedCount / results.stats.totalA) * 100)}%` : '—'}
                      color="blue"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard label="Полностью совпали" value={results.stats.matchedOk} color="emerald" icon={CheckCircle} />
                    <StatCard label="С расхождениями" value={results.stats.matchedDiff} color="amber" icon={AlertTriangle} />
                    <StatCard label="Только в A" value={results.stats.onlyInACount} color="red" icon={XCircle} />
                    <StatCard label="Только в B" value={results.stats.onlyInBCount} color="red" icon={XCircle} />
                  </div>

                  {/* Stacked bar */}
                  <div className="glass rounded-xl p-4 mb-6">
                    <h4 className="text-sm text-slate-400 mb-3">Распределение результатов</h4>
                    {(() => {
                      const total = results.stats.matchedOk + results.stats.matchedDiff + results.stats.onlyInACount + results.stats.onlyInBCount
                      if (total === 0) return <p className="text-xs text-slate-500">Нет данных</p>
                      const pOk = (results.stats.matchedOk / total) * 100
                      const pDiff = (results.stats.matchedDiff / total) * 100
                      const pA = (results.stats.onlyInACount / total) * 100
                      const pB = (results.stats.onlyInBCount / total) * 100
                      return (
                        <div>
                          <div className="flex h-8 rounded-lg overflow-hidden">
                            {pOk > 0 && (
                              <div className="bg-emerald-500 flex items-center justify-center text-xs font-medium" style={{ width: `${pOk}%` }}>
                                {pOk >= 8 && `${Math.round(pOk)}%`}
                              </div>
                            )}
                            {pDiff > 0 && (
                              <div className="bg-amber-500 flex items-center justify-center text-xs font-medium text-black" style={{ width: `${pDiff}%` }}>
                                {pDiff >= 8 && `${Math.round(pDiff)}%`}
                              </div>
                            )}
                            {pA > 0 && (
                              <div className="bg-red-500 flex items-center justify-center text-xs font-medium" style={{ width: `${pA}%` }}>
                                {pA >= 8 && `${Math.round(pA)}%`}
                              </div>
                            )}
                            {pB > 0 && (
                              <div className="bg-red-400 flex items-center justify-center text-xs font-medium" style={{ width: `${pB}%` }}>
                                {pB >= 8 && `${Math.round(pB)}%`}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-4 mt-2 text-xs text-slate-400 flex-wrap">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500" /> Совпали</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500" /> Расхождения</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500" /> Только в A</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-400" /> Только в B</span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Top diff fields */}
                  {results.stats.topDiffFields.length > 0 && (
                    <div className="glass rounded-xl p-4">
                      <h4 className="text-sm text-slate-400 mb-3">Топ расхождений по полям</h4>
                      <div className="space-y-2">
                        {results.stats.topDiffFields.map((f) => (
                          <div key={f.field} className="flex items-center gap-3">
                            <span className="text-sm text-slate-300 w-40 truncate">{f.field}</span>
                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${Math.min((f.count / results.stats.matchedCount) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 w-8 text-right">{f.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Table tab */}
              {activeTab === 'table' && (
                <div>
                  {/* Filters */}
                  <div className="flex flex-wrap gap-2 mb-4 items-center">
                    {[
                      { id: 'all', label: 'Все' },
                      { id: 'ok', label: 'Совпали' },
                      { id: 'diff', label: 'Расхождения' },
                      { id: 'onlyA', label: 'Только A' },
                      { id: 'onlyB', label: 'Только B' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => { setFilters({ ...filters, status: f.id }); setCurrentPage(1) }}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          filters.status === f.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                    <div className="relative ml-auto">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setCurrentPage(1) }}
                        placeholder="Поиск..."
                        className="pl-7 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs focus:border-blue-500 focus:outline-none w-48"
                      />
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto glass rounded-xl">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="px-3 py-2 text-left text-xs text-slate-500">Статус</th>
                          <th
                            className="px-3 py-2 text-left text-xs text-slate-500 cursor-pointer hover:text-slate-300"
                            onClick={() => {
                              if (sortField === 'key') setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                              else { setSortField('key'); setSortDir('asc') }
                            }}
                          >
                            Ключ {sortField === 'key' && (sortDir === 'asc' ? '↑' : '↓')}
                          </th>
                          <th className="px-3 py-2 text-left text-xs text-slate-500">Данные A</th>
                          <th className="px-3 py-2 text-left text-xs text-slate-500">Данные B</th>
                          <th className="px-3 py-2 text-left text-xs text-slate-500">Расхождения</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageRows.map((row, i) => {
                          const rowData = row.rowA || row.row || {}
                          const rowBData = row.rowB || {}
                          const colsA = fileA?.columns || []
                          const colsB = fileB?.columns || []
                          const isExpanded = expandedRow === i

                          return (
                            <Fragment key={i}>
                              <tr
                                onClick={() => setExpandedRow(isExpanded ? null : i)}
                                className={`cursor-pointer transition-colors hover:bg-slate-700/50 ${
                                  i % 2 === 0 ? 'bg-slate-800/50' : 'bg-slate-800/30'
                                } ${
                                  row.type === 'diff' ? 'border-l-2 border-l-amber-400' :
                                  (row.type === 'onlyA' || row.type === 'onlyB') ? 'border-l-2 border-l-red-400' : ''
                                }`}
                              >
                                <td className="px-3 py-2">{statusIcon(row.type)}</td>
                                <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{row.keyValue}</td>
                                <td className="px-3 py-2 text-xs text-slate-400 max-w-[200px] truncate">
                                  {colsA.slice(0, 3).map((c) => rowData[c]).filter(Boolean).join(', ')}
                                </td>
                                <td className="px-3 py-2 text-xs text-slate-400 max-w-[200px] truncate">
                                  {colsB.slice(0, 3).map((c) => rowBData[c]).filter(Boolean).join(', ')}
                                </td>
                                <td className="px-3 py-2 text-xs">
                                  {row.diffs && row.diffs.length > 0 ? (
                                    <span className="text-amber-400">{row.diffs.length}</span>
                                  ) : row.type === 'ok' ? (
                                    <span className="text-slate-600">—</span>
                                  ) : (
                                    <span className="text-red-400">{statusLabel(row.type)}</span>
                                  )}
                                </td>
                              </tr>
                              <AnimatePresence>
                                {isExpanded && (
                                  <tr>
                                    <td colSpan={5} className="p-0">
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="p-4 bg-slate-900/50 grid md:grid-cols-2 gap-4">
                                          <div>
                                            <h5 className="text-xs font-semibold text-blue-400 mb-2">Файл A</h5>
                                            <div className="space-y-1">
                                              {colsA.map((c) => {
                                                const hasDiff = row.diffs?.some((d) => d.field === c)
                                                return (
                                                  <div
                                                    key={c}
                                                    className={`text-xs flex gap-2 ${
                                                      hasDiff ? 'bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1' : ''
                                                    }`}
                                                  >
                                                    <span className="text-slate-500 w-32 shrink-0 truncate">{c}:</span>
                                                    <span className="text-slate-300">{rowData[c] || '—'}</span>
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          </div>
                                          <div>
                                            <h5 className="text-xs font-semibold text-blue-400 mb-2">Файл B</h5>
                                            <div className="space-y-1">
                                              {colsB.map((c) => {
                                                const hasDiff = row.diffs?.some((d) => {
                                                  const cf = config.compareFields.find((f) => f.fieldA === d.field)
                                                  return cf && cf.fieldB === c
                                                })
                                                return (
                                                  <div
                                                    key={c}
                                                    className={`text-xs flex gap-2 ${
                                                      hasDiff ? 'bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1' : ''
                                                    }`}
                                                  >
                                                    <span className="text-slate-500 w-32 shrink-0 truncate">{c}:</span>
                                                    <span className="text-slate-300">{rowBData[c] || '—'}</span>
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </motion.div>
                                    </td>
                                  </tr>
                                )}
                              </AnimatePresence>
                            </Fragment>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-center gap-4 mt-4 text-sm text-slate-400">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
                    >
                      Назад
                    </button>
                    <span>Страница {currentPage} из {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
                    >
                      Вперёд
                    </button>
                  </div>
                </div>
              )}

              {/* Issues tab */}
              {activeTab === 'issues' && (
                <div className="space-y-4">
                  {/* Only in A */}
                  <div className="glass rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenAccordions({ ...openAccordions, onlyA: !openAccordions.onlyA })}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <XCircle className="text-red-400" size={16} />
                        Только в источнике A ({results.stats.onlyInACount})
                      </span>
                      {openAccordions.onlyA ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    <AnimatePresence>
                      {openAccordions.onlyA && results.onlyInA.length > 0 && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4">
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-slate-700">
                                    <th className="px-2 py-1 text-left text-slate-500">Ключ</th>
                                    {fileA.columns.slice(0, 5).map((c) => (
                                      <th key={c} className="px-2 py-1 text-left text-slate-500">{c}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {results.onlyInA.map((m, i) => (
                                    <tr key={i} className="border-b border-slate-800/50">
                                      <td className="px-2 py-1 font-mono text-red-400">{m.keyValue}</td>
                                      {fileA.columns.slice(0, 5).map((c) => (
                                        <td key={c} className="px-2 py-1 text-slate-400">{m.row[c]}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Only in B */}
                  <div className="glass rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenAccordions({ ...openAccordions, onlyB: !openAccordions.onlyB })}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <XCircle className="text-red-400" size={16} />
                        Только в источнике B ({results.stats.onlyInBCount})
                      </span>
                      {openAccordions.onlyB ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    <AnimatePresence>
                      {openAccordions.onlyB && results.onlyInB.length > 0 && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4">
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-slate-700">
                                    <th className="px-2 py-1 text-left text-slate-500">Ключ</th>
                                    {fileB.columns.slice(0, 5).map((c) => (
                                      <th key={c} className="px-2 py-1 text-left text-slate-500">{c}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {results.onlyInB.map((m, i) => (
                                    <tr key={i} className="border-b border-slate-800/50">
                                      <td className="px-2 py-1 font-mono text-red-400">{m.keyValue}</td>
                                      {fileB.columns.slice(0, 5).map((c) => (
                                        <td key={c} className="px-2 py-1 text-slate-400">{m.row[c]}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Diffs */}
                  <div className="glass rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenAccordions({ ...openAccordions, diffs: !openAccordions.diffs })}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <AlertTriangle className="text-amber-400" size={16} />
                        Расхождения в полях ({results.stats.matchedDiff})
                      </span>
                      {openAccordions.diffs ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    <AnimatePresence>
                      {openAccordions.diffs && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3">
                            {results.matched
                              .filter((m) => m.status === 'diff')
                              .map((m, i) => (
                                <div key={i} className="bg-slate-800/50 rounded-lg p-3">
                                  <div className="text-xs font-mono text-slate-300 mb-1">
                                    Ключ: <span className="text-blue-400">{m.keyValue}</span>
                                  </div>
                                  {m.diffs.map((d, j) => (
                                    <div key={j} className="text-xs text-slate-400 ml-4">
                                      <span className="text-slate-500">{d.field}:</span>{' '}
                                      <span className="text-amber-300">{d.valueA || '(пусто)'}</span>
                                      <span className="text-slate-600"> ≠ </span>
                                      <span className="text-amber-300">{d.valueB || '(пусто)'}</span>
                                    </div>
                                  ))}
                                </div>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Export */}
              <div className="mt-6">
                <button
                  onClick={exportResults}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors"
                >
                  <Download size={16} />
                  Скачать результат CSV
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer info */}
      <section className="py-16 bg-slate-900/50 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="glass rounded-2xl p-8 border border-slate-700">
            <div className="flex items-start gap-4">
              <Database className="text-blue-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-2">Как это работает?</h3>
                <p className="text-slate-400 mb-4">
                  Инструмент загружает два CSV-файла, нормализует ключевые поля (ИНН, телефоны, названия компаний)
                  и сравнивает записи по выбранному ключу. Все расхождения группируются в наглядный отчёт.
                </p>
                <p className="text-slate-400 mb-4">
                  Это <span className="text-blue-400 font-semibold">клиентский инструмент</span> —
                  данные обрабатываются только в вашем браузере и никуда не отправляются.
                </p>
                <p className="text-sm text-slate-500">
                  Поддерживаемые форматы: CSV с разделителем «;» или «,». Кодировка: UTF-8.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-slate-500 mb-4">
              Этот инструмент создан Лабораторией ПО как демонстрация аналитических модулей
            </p>
            <Link to="/labs/software" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300">
              Узнать больше о Лаборатории ПО
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
