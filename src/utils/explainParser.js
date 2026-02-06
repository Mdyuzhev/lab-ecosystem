let nodeIdCounter = 0

export function resetNodeIdCounter() {
  nodeIdCounter = 0
}

/**
 * Парсит ввод пользователя (JSON) в структуру дерева.
 */
export function parseExplainInput(input) {
  const trimmed = input.trim()

  let parsed
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new Error('Не удалось разобрать план. Вставьте результат EXPLAIN (ANALYZE, FORMAT JSON).')
  }

  if (Array.isArray(parsed) && parsed[0]?.Plan) {
    const entry = parsed[0]
    const root = processNode(entry.Plan, null, entry['Execution Time'] || 0)
    return {
      root,
      planningTime: entry['Planning Time'] || 0,
      executionTime: entry['Execution Time'] || 0,
      totalTime: (entry['Planning Time'] || 0) + (entry['Execution Time'] || 0),
    }
  }

  if (parsed?.Plan) {
    const root = processNode(parsed.Plan, null, 0)
    return { root, planningTime: 0, executionTime: 0, totalTime: 0 }
  }

  if (parsed?.['Node Type']) {
    const root = processNode(parsed, null, 0)
    return { root, planningTime: 0, executionTime: 0, totalTime: 0 }
  }

  throw new Error('Неизвестный формат. Ожидается JSON-вывод EXPLAIN.')
}

function processNode(raw, parent, totalExecutionTime) {
  const node = {
    id: nodeIdCounter++,
    type: raw['Node Type'],
    relation: raw['Relation Name'] || null,
    alias: raw['Alias'] || null,
    indexName: raw['Index Name'] || null,
    parentRelationship: raw['Parent Relationship'] || null,
    joinType: raw['Join Type'] || null,

    startupCost: raw['Startup Cost'] || 0,
    totalCost: raw['Total Cost'] || 0,

    actualStartupTime: raw['Actual Startup Time'] ?? null,
    actualTotalTime: raw['Actual Total Time'] ?? null,
    actualRows: raw['Actual Rows'] ?? null,
    actualLoops: raw['Actual Loops'] ?? 1,

    planRows: raw['Plan Rows'] || 0,
    planWidth: raw['Plan Width'] || 0,

    exclusiveTime: 0,
    timePercent: 0,

    sharedHitBlocks: raw['Shared Hit Blocks'] || 0,
    sharedReadBlocks: raw['Shared Read Blocks'] || 0,

    filter: raw['Filter'] || null,
    indexCond: raw['Index Cond'] || null,
    hashCond: raw['Hash Cond'] || null,
    recheckCond: raw['Recheck Cond'] || null,
    rowsRemovedByFilter: raw['Rows Removed by Filter'] || 0,
    rowsRemovedByIndexRecheck: raw['Rows Removed by Index Recheck'] || 0,

    sortKey: raw['Sort Key'] || null,
    sortMethod: raw['Sort Method'] || null,
    sortSpaceUsed: raw['Sort Space Used'] || 0,
    sortSpaceType: raw['Sort Space Type'] || null,

    hashBuckets: raw['Hash Buckets'] || 0,
    hashBatches: raw['Hash Batches'] || 0,
    peakMemoryUsage: raw['Peak Memory Usage'] || 0,

    warnings: [],
    children: [],
    raw,
  }

  if (raw.Plans && raw.Plans.length > 0) {
    node.children = raw.Plans.map((child) => processNode(child, node, totalExecutionTime))
  }

  if (node.actualTotalTime !== null) {
    const childrenTime = node.children.reduce(
      (sum, c) => sum + (c.actualTotalTime || 0) * (c.actualLoops || 1),
      0,
    )
    node.exclusiveTime = Math.max(0, node.actualTotalTime * node.actualLoops - childrenTime)
  }

  if (totalExecutionTime > 0 && node.exclusiveTime > 0) {
    node.timePercent = (node.exclusiveTime / totalExecutionTime) * 100
  }

  return node
}

function traverseTree(node, fn) {
  fn(node)
  node.children.forEach((child) => traverseTree(child, fn))
}

function formatNumber(n) {
  return Number(n).toLocaleString('ru-RU')
}

/**
 * Обходит дерево, добавляет предупреждения.
 */
export function analyzeWarnings(root) {
  traverseTree(root, (node) => {
    node.warnings = []

    if (node.type === 'Seq Scan' && node.actualRows > 10000) {
      node.warnings.push({
        level: 'warning',
        code: 'SEQ_SCAN_LARGE',
        message: `Sequential Scan на ${node.relation}: ${formatNumber(node.actualRows)} строк. Рассмотрите создание индекса.`,
      })
    }

    if (node.rowsRemovedByFilter > 0 && node.actualRows > 0) {
      const ratio = node.rowsRemovedByFilter / (node.actualRows + node.rowsRemovedByFilter)
      if (ratio > 0.8) {
        node.warnings.push({
          level: 'warning',
          code: 'HIGH_FILTER_RATIO',
          message: `${(ratio * 100).toFixed(0)}% строк отброшено фильтром (${formatNumber(node.rowsRemovedByFilter)} из ${formatNumber(node.actualRows + node.rowsRemovedByFilter)}). Индекс по полю фильтрации ускорит запрос.`,
        })
      }
    }

    if (node.planRows > 0 && node.actualRows !== null) {
      const factor = node.actualRows / node.planRows
      if (factor > 10 || factor < 0.1) {
        node.warnings.push({
          level: 'info',
          code: 'ROW_ESTIMATE_OFF',
          message: `Ожидалось ${formatNumber(node.planRows)} строк, получено ${formatNumber(node.actualRows)} (x${factor.toFixed(1)}). Обновите статистику: ANALYZE ${node.relation || 'table'}.`,
        })
      }
    }

    if (node.sortSpaceType === 'Disk') {
      node.warnings.push({
        level: 'danger',
        code: 'DISK_SORT',
        message: `Сортировка ушла на диск (${formatNumber(node.sortSpaceUsed)} kB). Увеличьте work_mem или оптимизируйте запрос.`,
      })
    }

    if (node.hashBatches > 1) {
      node.warnings.push({
        level: 'warning',
        code: 'HASH_BATCHES',
        message: `Hash в ${node.hashBatches} batch (не влез в memory, ${formatNumber(node.peakMemoryUsage)} kB). Увеличьте work_mem.`,
      })
    }

    if (node.type === 'Nested Loop' && node.actualLoops > 1000) {
      node.warnings.push({
        level: 'danger',
        code: 'NESTED_LOOP_MANY',
        message: `Nested Loop: ${formatNumber(node.actualLoops)} итераций. Возможно, Hash Join или Merge Join эффективнее.`,
      })
    }

    if (node.sharedReadBlocks > 0 && node.sharedHitBlocks > 0) {
      const hitRatio = node.sharedHitBlocks / (node.sharedHitBlocks + node.sharedReadBlocks)
      if (hitRatio < 0.9) {
        node.warnings.push({
          level: 'info',
          code: 'LOW_CACHE_HIT',
          message: `Cache hit ratio: ${(hitRatio * 100).toFixed(1)}%. Возможно, нужно увеличить shared_buffers.`,
        })
      }
    }

    if (node.timePercent > 50) {
      node.warnings.push({
        level: 'danger',
        code: 'BOTTLENECK',
        message: `Этот узел занимает ${node.timePercent.toFixed(1)}% общего времени выполнения.`,
      })
    }
  })

  return root
}

/**
 * Собирает общую статистику по дереву.
 */
export function collectStats(root, meta) {
  const stats = {
    planningTime: meta.planningTime,
    executionTime: meta.executionTime,
    totalTime: meta.totalTime,
    nodeCount: 0,
    maxDepth: 0,
    totalWarnings: 0,
    dangerCount: 0,
    warningCount: 0,
    infoCount: 0,
    seqScans: [],
    slowestNodes: [],
    nodeTypes: {},
    totalSharedHit: 0,
    totalSharedRead: 0,
  }

  const allNodes = []

  traverseTree(root, (node) => {
    stats.nodeCount++
    stats.totalWarnings += node.warnings.length
    stats.dangerCount += node.warnings.filter((w) => w.level === 'danger').length
    stats.warningCount += node.warnings.filter((w) => w.level === 'warning').length
    stats.infoCount += node.warnings.filter((w) => w.level === 'info').length
    stats.totalSharedHit += node.sharedHitBlocks
    stats.totalSharedRead += node.sharedReadBlocks

    if (node.type === 'Seq Scan') stats.seqScans.push(node)
    stats.nodeTypes[node.type] = (stats.nodeTypes[node.type] || 0) + 1

    allNodes.push(node)
  })

  function getDepth(node) {
    if (node.children.length === 0) return 1
    return 1 + Math.max(...node.children.map(getDepth))
  }
  stats.maxDepth = getDepth(root)

  stats.slowestNodes = allNodes
    .filter((n) => n.exclusiveTime > 0)
    .sort((a, b) => b.exclusiveTime - a.exclusiveTime)
    .slice(0, 3)

  return stats
}
