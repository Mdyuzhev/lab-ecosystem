function removeComments(ddl) {
  return ddl
    .replace(/--[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
}

function splitDefinitions(body) {
  const defs = []
  let depth = 0
  let current = ''
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    if (ch === '(') depth++
    else if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      defs.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  if (current.trim()) defs.push(current)
  return defs
}

function extractParenContent(str) {
  const m = str.match(/\(([^)]+)\)/)
  return m ? m[1] : ''
}

function parseColumnDef(def) {
  const match = def.match(/^(\w+)\s+([\w]+(?:\s*\(\s*[\d,\s]+\s*\))?)\s*(.*)/i)
  if (!match) return null

  const name = match[1].toLowerCase()
  const rawType = match[2].toUpperCase()
  const rest = match[3] || ''

  const reserved = ['primary', 'foreign', 'constraint', 'unique', 'check', 'index']
  if (reserved.includes(name)) return null

  const col = {
    name,
    type: rawType,
    constraints: [],
    isPK: false,
    isFK: false,
    isNullable: true,
    isUnique: false,
    defaultValue: null,
    checkConstraint: null,
    references: null,
  }

  if (/PRIMARY\s+KEY/i.test(rest)) {
    col.isPK = true
    col.isNullable = false
    col.isUnique = true
    col.constraints.push('PRIMARY KEY')
  }
  if (/NOT\s+NULL/i.test(rest)) {
    col.isNullable = false
    col.constraints.push('NOT NULL')
  }
  if (/\bUNIQUE\b/i.test(rest)) {
    col.isUnique = true
    col.constraints.push('UNIQUE')
  }
  if (/SERIAL/i.test(rawType)) {
    col.isNullable = false
  }

  const defMatch = rest.match(/DEFAULT\s+(\S+)/i)
  if (defMatch) col.defaultValue = defMatch[1]

  const checkMatch = rest.match(/CHECK\s*\(([^)]+)\)/i)
  if (checkMatch) col.checkConstraint = checkMatch[1]

  const refMatch = rest.match(/REFERENCES\s+(\w+)\s*\(\s*(\w+)\s*\)(?:\s+ON\s+DELETE\s+(CASCADE|SET\s+NULL|RESTRICT))?/i)
  if (refMatch) {
    col.isFK = true
    col.constraints.push('FOREIGN KEY')
    col.references = {
      table: refMatch[1].toLowerCase(),
      column: refMatch[2].toLowerCase(),
      onDelete: refMatch[3] || null,
    }
  }

  return col
}

function parseCreateTables(ddl, tables) {
  const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\(([\s\S]*?)\)\s*;/gi
  let match

  while ((match = tableRegex.exec(ddl)) !== null) {
    const tableName = match[1].toLowerCase()
    const body = match[2]

    const columns = []
    const compositePK = []

    const definitions = splitDefinitions(body)

    definitions.forEach(def => {
      const trimmed = def.trim()

      if (/^PRIMARY\s+KEY\s*\(/i.test(trimmed)) {
        const cols = extractParenContent(trimmed).split(',').map(c => c.trim().toLowerCase())
        compositePK.push(...cols)
        return
      }

      if (/^(?:CONSTRAINT\s+\w+\s+)?FOREIGN\s+KEY/i.test(trimmed)) {
        return
      }

      if (/^CONSTRAINT\s+/i.test(trimmed) && !/FOREIGN/i.test(trimmed)) {
        return
      }

      const col = parseColumnDef(trimmed)
      if (col) columns.push(col)
    })

    if (compositePK.length > 0) {
      compositePK.forEach(pkCol => {
        const col = columns.find(c => c.name === pkCol)
        if (col) {
          col.isPK = true
          col.isNullable = false
          col.isUnique = true
        }
      })
    }

    tables[tableName] = {
      name: tableName,
      columns,
      primaryKey: compositePK.length > 0
        ? compositePK
        : columns.filter(c => c.isPK).map(c => c.name),
      indexes: [],
      referencedBy: [],
      referencesTo: [],
      warnings: [],
    }
  }
}

function parseAlterTableFK(ddl, tables, relations) {
  const alterRegex = /ALTER\s+TABLE\s+(\w+)\s+ADD\s+CONSTRAINT\s+(\w+)\s+FOREIGN\s+KEY\s*\(\s*(\w+)\s*\)\s*REFERENCES\s+(\w+)\s*\(\s*(\w+)\s*\)/gi
  let match

  while ((match = alterRegex.exec(ddl)) !== null) {
    const fromTable = match[1].toLowerCase()
    const constraintName = match[2].toLowerCase()
    const fromColumn = match[3].toLowerCase()
    const toTable = match[4].toLowerCase()
    const toColumn = match[5].toLowerCase()

    relations.push({
      id: constraintName,
      fromTable,
      fromColumn,
      toTable,
      toColumn,
      constraintName,
    })

    if (tables[fromTable]) {
      const col = tables[fromTable].columns.find(c => c.name === fromColumn)
      if (col) {
        col.isFK = true
        col.references = { table: toTable, column: toColumn }
      }
    }
  }
}

function parseCreateIndexes(ddl, indexes) {
  const indexRegex = /CREATE\s+(UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s+ON\s+(\w+)\s*\(([^)]+)\)\s*;/gi
  let match

  while ((match = indexRegex.exec(ddl)) !== null) {
    indexes.push({
      name: match[2].toLowerCase(),
      table: match[3].toLowerCase(),
      columns: match[4].split(',').map(c => c.trim().toLowerCase()),
      isUnique: !!match[1],
    })
  }
}

function extractInlineReferences(tables, relations) {
  Object.values(tables).forEach(table => {
    table.columns.forEach(col => {
      if (col.references) {
        const relId = `${table.name}_${col.name}_fk`
        if (!relations.find(r => r.fromTable === table.name && r.fromColumn === col.name)) {
          relations.push({
            id: relId,
            fromTable: table.name,
            fromColumn: col.name,
            toTable: col.references.table,
            toColumn: col.references.column,
            onDelete: col.references.onDelete,
            constraintName: relId,
          })
        }

        table.referencesTo.push(col.references.table)

        if (tables[col.references.table]) {
          tables[col.references.table].referencedBy.push(table.name)
        }
      }
    })
  })
}

function attachIndexes(tables, indexes) {
  indexes.forEach(idx => {
    if (tables[idx.table]) {
      tables[idx.table].indexes.push(idx)
    }
  })
}

function findCycles(tables, relations) {
  const cycles = []
  const tableNames = Object.keys(tables)

  function dfs(start, current, path, visited) {
    const outgoing = relations.filter(r => r.fromTable === current)
    for (const rel of outgoing) {
      if (rel.toTable === start && path.length > 0) {
        cycles.push([...path, current])
        continue
      }
      if (visited.has(rel.toTable)) continue
      visited.add(rel.toTable)
      dfs(start, rel.toTable, [...path, current], visited)
      visited.delete(rel.toTable)
    }
  }

  tableNames.forEach(t => {
    dfs(t, t, [], new Set([t]))
  })

  return deduplicateCycles(cycles)
}

function deduplicateCycles(cycles) {
  const seen = new Set()
  return cycles.filter(cycle => {
    const sorted = [...cycle].sort().join(',')
    if (seen.has(sorted)) return false
    seen.add(sorted)
    return true
  })
}

export function analyzeSchema(tables, relations, indexes) {
  const warnings = []

  Object.values(tables).forEach(table => {
    table.columns.filter(c => c.isFK).forEach(col => {
      const hasIndex = table.indexes.some(idx => idx.columns[0] === col.name) ||
        table.primaryKey.includes(col.name)
      if (!hasIndex) {
        const w = {
          level: 'warning',
          table: table.name,
          column: col.name,
          code: 'FK_NO_INDEX',
          message: `${table.name}.${col.name} \u2014 FK \u0431\u0435\u0437 \u0438\u043d\u0434\u0435\u043a\u0441\u0430. JOIN/DELETE \u043f\u043e \u044d\u0442\u043e\u0439 \u0441\u0432\u044f\u0437\u0438 \u0431\u0443\u0434\u0435\u0442 \u043c\u0435\u0434\u043b\u0435\u043d\u043d\u044b\u043c.`,
          suggestion: `CREATE INDEX idx_${table.name}_${col.name} ON ${table.name}(${col.name});`,
        }
        warnings.push(w)
        table.warnings.push(w)
      }
    })

    const hasOutgoing = table.columns.some(c => c.isFK)
    const hasIncoming = table.referencedBy.length > 0
    if (!hasOutgoing && !hasIncoming) {
      const w = {
        level: 'info',
        table: table.name,
        code: 'ORPHAN_TABLE',
        message: `\u0422\u0430\u0431\u043b\u0438\u0446\u0430 ${table.name} \u043d\u0435 \u0441\u0432\u044f\u0437\u0430\u043d\u0430 \u043d\u0438 \u0441 \u043e\u0434\u043d\u043e\u0439 \u0434\u0440\u0443\u0433\u043e\u0439 \u0442\u0430\u0431\u043b\u0438\u0446\u0435\u0439.`,
      }
      warnings.push(w)
      table.warnings.push(w)
    }

    if (table.primaryKey.length === 0) {
      const w = {
        level: 'danger',
        table: table.name,
        code: 'NO_PRIMARY_KEY',
        message: `\u0422\u0430\u0431\u043b\u0438\u0446\u0430 ${table.name} \u043d\u0435 \u0438\u043c\u0435\u0435\u0442 PRIMARY KEY.`,
      }
      warnings.push(w)
      table.warnings.push(w)
    }

    if (table.columns.length > 20) {
      const w = {
        level: 'info',
        table: table.name,
        code: 'WIDE_TABLE',
        message: `\u0422\u0430\u0431\u043b\u0438\u0446\u0430 ${table.name} \u0438\u043c\u0435\u0435\u0442 ${table.columns.length} \u043a\u043e\u043b\u043e\u043d\u043e\u043a. \u0420\u0430\u0441\u0441\u043c\u043e\u0442\u0440\u0438\u0442\u0435 \u043d\u043e\u0440\u043c\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044e.`,
      }
      warnings.push(w)
      table.warnings.push(w)
    }
  })

  const cycles = findCycles(tables, relations)
  cycles.forEach(cycle => {
    const w = {
      level: 'warning',
      code: 'CIRCULAR_DEPENDENCY',
      tables: cycle,
      message: `\u0426\u0438\u043a\u043b\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u044c: ${cycle.join(' \u2192 ')} \u2192 ${cycle[0]}`,
    }
    warnings.push(w)
  })

  return warnings
}

export function parseDDL(ddl) {
  const tables = {}
  const relations = []
  const indexes = []

  const cleaned = removeComments(ddl)

  parseCreateTables(cleaned, tables)
  parseAlterTableFK(cleaned, tables, relations)
  parseCreateIndexes(cleaned, indexes)
  extractInlineReferences(tables, relations)
  attachIndexes(tables, indexes)

  const warnings = analyzeSchema(tables, relations, indexes)

  return { tables, relations, indexes, warnings }
}
