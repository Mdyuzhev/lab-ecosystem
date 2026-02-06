import { normalizePhone, normalizeInn } from './normalizers'

/**
 * Сверка двух массивов данных из CSV.
 *
 * @param {Array} dataA - массив объектов из CSV файла A
 * @param {Array} dataB - массив объектов из CSV файла B
 * @param {Object} config - конфигурация сверки:
 *   keyA, keyB - имена колонок-ключей
 *   compareFields - [{ fieldA, fieldB, mode: 'exact'|'fuzzy'|'numeric'|'phone'|'inn', tolerance? }]
 *   normalizeKey - 'none'|'phone'|'inn'
 */
export function reconcileData(dataA, dataB, config) {
  const { keyA, keyB, compareFields = [], normalizeKey = 'none' } = config

  const normalize = (val) => {
    if (!val || String(val).trim() === '') return null
    const s = String(val).trim()
    if (normalizeKey === 'phone') return normalizePhone(s)
    if (normalizeKey === 'inn') return normalizeInn(s)
    return s.toLowerCase()
  }

  // Индексируем файл B по нормализованному ключу
  const mapB = new Map()
  dataB.forEach((row) => {
    const key = normalize(row[keyB])
    if (key) {
      if (!mapB.has(key)) mapB.set(key, [])
      mapB.get(key).push(row)
    }
  })

  const matched = []
  const onlyInA = []
  const usedBKeys = new Set()

  // Проходим по файлу A
  dataA.forEach((rowA) => {
    const rawKey = rowA[keyA]
    const key = normalize(rawKey)

    if (!key) {
      onlyInA.push({ keyValue: rawKey || '(пусто)', row: rowA })
      return
    }

    const bRows = mapB.get(key)
    if (!bRows || bRows.length === 0) {
      onlyInA.push({ keyValue: rawKey, row: rowA })
      return
    }

    usedBKeys.add(key)
    const rowB = bRows[0] // берём первое совпадение

    const diffs = []
    compareFields.forEach(({ fieldA, fieldB, mode, tolerance }) => {
      const valA = rowA[fieldA]
      const valB = rowB[fieldB]
      const diff = compareValues(valA, valB, mode, tolerance)
      if (diff) {
        diffs.push({ field: fieldA, valueA: valA, valueB: valB, diffType: diff })
      }
    })

    matched.push({
      keyValue: rawKey,
      rowA,
      rowB,
      diffs,
      status: diffs.length === 0 ? 'ok' : 'diff',
    })
  })

  // Записи только в B
  const onlyInB = []
  dataB.forEach((rowB) => {
    const key = normalize(rowB[keyB])
    if (!key || !usedBKeys.has(key)) {
      onlyInB.push({ keyValue: rowB[keyB] || '(пусто)', row: rowB })
    }
  })

  // Статистика по полям с расхождениями
  const fieldDiffCounts = {}
  matched.forEach((m) => {
    m.diffs.forEach((d) => {
      fieldDiffCounts[d.field] = (fieldDiffCounts[d.field] || 0) + 1
    })
  })
  const topDiffFields = Object.entries(fieldDiffCounts)
    .map(([field, count]) => ({ field, count }))
    .sort((a, b) => b.count - a.count)

  const matchedOk = matched.filter((m) => m.status === 'ok').length
  const matchedDiff = matched.filter((m) => m.status === 'diff').length

  return {
    matched,
    onlyInA,
    onlyInB,
    stats: {
      totalA: dataA.length,
      totalB: dataB.length,
      matchedCount: matched.length,
      matchedOk,
      matchedDiff,
      onlyInACount: onlyInA.length,
      onlyInBCount: onlyInB.length,
      topDiffFields,
    },
  }
}

function compareValues(a, b, mode, tolerance = 0) {
  const strA = a == null ? '' : String(a).trim()
  const strB = b == null ? '' : String(b).trim()

  if (strA === '' && strB === '') return null

  switch (mode) {
    case 'exact':
      return strA.toLowerCase() === strB.toLowerCase() ? null : 'mismatch'

    case 'fuzzy': {
      const normA = strA.toLowerCase().replace(/["«»'']/g, '').replace(/\s+/g, ' ')
      const normB = strB.toLowerCase().replace(/["«»'']/g, '').replace(/\s+/g, ' ')
      return normA === normB ? null : 'mismatch'
    }

    case 'numeric': {
      const numA = parseFloat(strA)
      const numB = parseFloat(strB)
      if (isNaN(numA) && isNaN(numB)) return null
      if (isNaN(numA) || isNaN(numB)) return 'mismatch'
      return Math.abs(numA - numB) > (tolerance || 0) ? 'tolerance_exceeded' : null
    }

    case 'phone': {
      const pA = normalizePhone(strA)
      const pB = normalizePhone(strB)
      if (!pA && !pB) return null
      return pA === pB ? null : 'mismatch'
    }

    case 'inn': {
      const iA = normalizeInn(strA)
      const iB = normalizeInn(strB)
      if (!iA && !iB) return null
      return iA === iB ? null : 'mismatch'
    }

    default:
      return strA === strB ? null : 'mismatch'
  }
}
