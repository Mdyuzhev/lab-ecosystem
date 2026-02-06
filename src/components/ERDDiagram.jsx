import { useState, useRef, useCallback, useEffect } from 'react'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

const TABLE_WIDTH = 240
const HEADER_H = 36
const ROW_H = 22
const PAD = 8

function estimateTableHeight(table) {
  return HEADER_H + table.columns.length * ROW_H + PAD
}

function initialLayout(tables) {
  const names = Object.keys(tables)
  const cols = Math.ceil(Math.sqrt(names.length))
  const GAP_X = 100
  const GAP_Y = 80
  const positions = {}
  names.forEach((name, i) => {
    const row = Math.floor(i / cols)
    const col = i % cols
    positions[name] = {
      x: col * (TABLE_WIDTH + GAP_X) + 50,
      y: row * (estimateTableHeight(tables[name]) + GAP_Y) + 50,
    }
  })
  return positions
}

function getColIndex(table, colName) {
  return table.columns.findIndex(c => c.name === colName)
}

function computeEdgePath(fromPos, fromTable, fromColName, toPos, toTable, toColName) {
  const fromColIdx = getColIndex(fromTable, fromColName)
  const toColIdx = getColIndex(toTable, toColName)

  const fromH = estimateTableHeight(fromTable)
  const toH = estimateTableHeight(toTable)

  const fromCenterX = fromPos.x + TABLE_WIDTH / 2
  const toCenterX = toPos.x + TABLE_WIDTH / 2

  let fromX, toX

  if (fromCenterX <= toCenterX) {
    fromX = fromPos.x + TABLE_WIDTH
    toX = toPos.x
  } else {
    fromX = fromPos.x
    toX = toPos.x + TABLE_WIDTH
  }

  const fromY = fromPos.y + HEADER_H + (fromColIdx >= 0 ? fromColIdx : 0) * ROW_H + ROW_H / 2
  const toY = toPos.y + HEADER_H + (toColIdx >= 0 ? toColIdx : 0) * ROW_H + ROW_H / 2

  const dx = Math.abs(fromX - toX)
  const cp = Math.max(dx * 0.4, 40)

  const cp1x = fromCenterX <= toCenterX ? fromX + cp : fromX - cp
  const cp2x = fromCenterX <= toCenterX ? toX - cp : toX + cp

  return {
    path: `M ${fromX} ${fromY} C ${cp1x} ${fromY}, ${cp2x} ${toY}, ${toX} ${toY}`,
    fromX, fromY, toX, toY,
  }
}

function CrowFoot({ x, y, direction, type }) {
  const size = 8
  const dx = direction === 'right' ? size : -size
  if (type === 'many') {
    return (
      <g>
        <line x1={x} y1={y} x2={x + dx} y2={y - size} stroke="currentColor" strokeWidth={1.5} />
        <line x1={x} y1={y} x2={x + dx} y2={y} stroke="currentColor" strokeWidth={1.5} />
        <line x1={x} y1={y} x2={x + dx} y2={y + size} stroke="currentColor" strokeWidth={1.5} />
      </g>
    )
  }
  return (
    <line x1={x} y1={y - size} x2={x} y2={y + size} stroke="currentColor" strokeWidth={1.5} />
  )
}

function TableNode({ table, pos, isSelected, isHovered, hasWarnings, onMouseDown, onClick, onHover }) {
  const h = estimateTableHeight(table)
  const borderColor = isSelected
    ? '#60a5fa'
    : hasWarnings
      ? '#f59e0b'
      : isHovered
        ? '#60a5fa'
        : '#475569'
  const borderWidth = isSelected ? 2 : 1

  return (
    <g
      transform={`translate(${pos.x}, ${pos.y})`}
      onMouseDown={(e) => onMouseDown(e)}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{ cursor: 'grab' }}
    >
      <rect
        width={TABLE_WIDTH}
        height={h}
        rx={8}
        fill="#1e293b"
        stroke={borderColor}
        strokeWidth={borderWidth}
      />
      {isHovered && (
        <rect
          width={TABLE_WIDTH}
          height={h}
          rx={8}
          fill="none"
          stroke="#60a5fa"
          strokeWidth={1}
          opacity={0.3}
          filter="url(#glow)"
        />
      )}
      <rect
        width={TABLE_WIDTH}
        height={HEADER_H}
        rx={8}
        fill="#334155"
      />
      <rect
        x={0}
        y={HEADER_H - 8}
        width={TABLE_WIDTH}
        height={8}
        fill="#334155"
      />
      <text x={12} y={HEADER_H / 2 + 5} fill="white" fontWeight="bold" fontSize={13}>
        {table.name}
      </text>
      {hasWarnings && (
        <text x={TABLE_WIDTH - 24} y={HEADER_H / 2 + 5} fontSize={12}>
          &#9888;
        </text>
      )}

      {table.columns.map((col, i) => {
        const y = HEADER_H + i * ROW_H + ROW_H / 2 + 4
        let icon = ''
        let iconColor = '#94a3b8'
        if (col.isPK) { icon = '\uD83D\uDD11'; iconColor = '#facc15' }
        else if (col.isFK) { icon = '\u2192'; iconColor = '#60a5fa' }
        else if (col.isUnique) { icon = '\u25C6'; iconColor = '#a78bfa' }

        return (
          <g key={col.name}>
            {col.isFK && (
              <rect x={0} y={HEADER_H + i * ROW_H} width={TABLE_WIDTH} height={ROW_H} fill="#3b82f6" opacity={0.05} />
            )}
            <text x={12} y={y} fontSize={11} fill={iconColor}>
              {icon}
            </text>
            <text x={icon ? 28 : 12} y={y} fontSize={11} fill={col.isNullable ? '#94a3b8' : '#e2e8f0'}>
              {col.name}
            </text>
            <text x={TABLE_WIDTH - 8} y={y} fontSize={10} fill="#64748b" textAnchor="end">
              {col.type}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export default function ERDDiagram({ schema, selectedTable, hoveredTable, onSelectTable, onHoverTable }) {
  const svgRef = useRef(null)
  const [positions, setPositions] = useState({})
  const [dragging, setDragging] = useState(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 1400, h: 900 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0, vx: 0, vy: 0 })

  useEffect(() => {
    if (schema) {
      const pos = initialLayout(schema.tables)
      setPositions(pos)
      fitToView(pos, schema.tables)
    }
  }, [schema])

  const fitToView = useCallback((pos, tables) => {
    const names = Object.keys(pos)
    if (names.length === 0) return
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    names.forEach(n => {
      const p = pos[n]
      const t = tables[n]
      if (!t) return
      minX = Math.min(minX, p.x)
      minY = Math.min(minY, p.y)
      maxX = Math.max(maxX, p.x + TABLE_WIDTH)
      maxY = Math.max(maxY, p.y + estimateTableHeight(t))
    })
    const pad = 60
    setViewBox({
      x: minX - pad,
      y: minY - pad,
      w: maxX - minX + pad * 2,
      h: maxY - minY + pad * 2,
    })
  }, [])

  const svgToWorld = useCallback((clientX, clientY) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    const scaleX = viewBox.w / rect.width
    const scaleY = viewBox.h / rect.height
    return {
      x: (clientX - rect.left) * scaleX + viewBox.x,
      y: (clientY - rect.top) * scaleY + viewBox.y,
    }
  }, [viewBox])

  const handleMouseDown = useCallback((tableName, e) => {
    e.stopPropagation()
    e.preventDefault()
    const world = svgToWorld(e.clientX, e.clientY)
    const pos = positions[tableName]
    setDragging(tableName)
    setDragStart({ x: world.x - pos.x, y: world.y - pos.y })
  }, [positions, svgToWorld])

  const handleMouseMove = useCallback((e) => {
    if (dragging) {
      const world = svgToWorld(e.clientX, e.clientY)
      setPositions(prev => ({
        ...prev,
        [dragging]: {
          x: world.x - dragStart.x,
          y: world.y - dragStart.y,
        },
      }))
    } else if (isPanning) {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const scaleX = viewBox.w / rect.width
      const scaleY = viewBox.h / rect.height
      const dx = (e.clientX - panStart.x) * scaleX
      const dy = (e.clientY - panStart.y) * scaleY
      setViewBox(prev => ({
        ...prev,
        x: panStart.vx - dx,
        y: panStart.vy - dy,
      }))
    }
  }, [dragging, dragStart, isPanning, panStart, svgToWorld, viewBox])

  const handleMouseUp = useCallback(() => {
    setDragging(null)
    setIsPanning(false)
  }, [])

  const handleBgMouseDown = useCallback((e) => {
    if (e.button === 0 && !dragging) {
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY, vx: viewBox.x, vy: viewBox.y })
    }
  }, [dragging, viewBox])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 1.1 : 0.9
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const mx = (e.clientX - rect.left) / rect.width
    const my = (e.clientY - rect.top) / rect.height

    setViewBox(prev => {
      const newW = prev.w * factor
      const newH = prev.h * factor
      return {
        x: prev.x + (prev.w - newW) * mx,
        y: prev.y + (prev.h - newH) * my,
        w: newW,
        h: newH,
      }
    })
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.addEventListener('wheel', handleWheel, { passive: false })
    return () => svg.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  if (!schema) return null

  const { tables, relations } = schema

  const relatedTables = new Set()
  if (hoveredTable) {
    relations.forEach(r => {
      if (r.fromTable === hoveredTable || r.toTable === hoveredTable) {
        relatedTables.add(r.fromTable)
        relatedTables.add(r.toTable)
      }
    })
  }

  return (
    <div className="relative glass rounded-xl overflow-hidden" style={{ height: '600px' }}>
      <div className="absolute top-3 right-3 z-10 flex gap-1">
        <button
          onClick={() => setViewBox(prev => ({
            x: prev.x + prev.w * 0.1,
            y: prev.y + prev.h * 0.1,
            w: prev.w * 0.8,
            h: prev.h * 0.8,
          }))}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => setViewBox(prev => ({
            x: prev.x - prev.w * 0.125,
            y: prev.y - prev.h * 0.125,
            w: prev.w * 1.25,
            h: prev.h * 1.25,
          }))}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={() => fitToView(positions, tables)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Fit"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        onMouseDown={handleBgMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: dragging ? 'grabbing' : isPanning ? 'move' : 'default' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {relations.map((rel, i) => {
          const fromTable = tables[rel.fromTable]
          const toTable = tables[rel.toTable]
          const fromPos = positions[rel.fromTable]
          const toPos = positions[rel.toTable]
          if (!fromTable || !toTable || !fromPos || !toPos) return null

          const edge = computeEdgePath(fromPos, fromTable, rel.fromColumn, toPos, toTable, rel.toColumn)
          const isHighlighted = hoveredTable && (rel.fromTable === hoveredTable || rel.toTable === hoveredTable)
          const isCyclic = schema.warnings.some(w => w.code === 'CIRCULAR_DEPENDENCY' && w.tables && w.tables.includes(rel.fromTable) && w.tables.includes(rel.toTable))

          const fromCol = fromTable.columns.find(c => c.name === rel.fromColumn)
          const isMany = fromCol && !fromCol.isUnique

          const strokeColor = isCyclic
            ? '#f87171'
            : isHighlighted
              ? '#60a5fa'
              : '#64748b'

          return (
            <g key={`${rel.id}-${i}`} className={isCyclic ? 'text-red-400' : isHighlighted ? 'text-blue-400' : 'text-slate-500'}>
              <path
                d={edge.path}
                fill="none"
                stroke={strokeColor}
                strokeWidth={isHighlighted ? 2 : 1.5}
                strokeDasharray={isCyclic ? '5,5' : 'none'}
                opacity={hoveredTable && !isHighlighted ? 0.2 : 1}
              />
              <CrowFoot
                x={edge.toX}
                y={edge.toY}
                direction={edge.toX > edge.fromX ? 'left' : 'right'}
                type="one"
              />
              {isMany && (
                <CrowFoot
                  x={edge.fromX}
                  y={edge.fromY}
                  direction={edge.fromX < edge.toX ? 'left' : 'right'}
                  type="many"
                />
              )}
            </g>
          )
        })}

        {Object.entries(tables).map(([name, table]) => {
          const pos = positions[name]
          if (!pos) return null
          return (
            <TableNode
              key={name}
              table={table}
              pos={pos}
              isSelected={selectedTable === name}
              isHovered={hoveredTable === name || relatedTables.has(name)}
              hasWarnings={table.warnings.length > 0}
              onMouseDown={(e) => handleMouseDown(name, e)}
              onClick={() => onSelectTable(selectedTable === name ? null : name)}
              onHover={(hovered) => onHoverTable(hovered ? name : null)}
            />
          )
        })}
      </svg>
    </div>
  )
}
