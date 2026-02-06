import { useMemo } from 'react'

const NODE_WIDTH = 280
const NODE_HEIGHT = 80
const H_GAP = 40
const V_GAP = 60
const PADDING = 40

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

function getNodeBg(timePercent) {
  if (timePercent > 50) return '#7f1d1d30'
  if (timePercent > 20) return '#78350f30'
  if (timePercent > 5) return '#1e3a5f30'
  return '#1e293b80'
}

function getNodeStroke(node, isSelected) {
  if (isSelected) return '#60a5fa'
  if (node.warnings.some((w) => w.level === 'danger')) return '#ef4444'
  if (node.warnings.some((w) => w.level === 'warning')) return '#f59e0b'
  return '#475569'
}

function getStrokeWidth(node, isSelected) {
  if (isSelected) return 2.5
  if (node.warnings.some((w) => w.level === 'danger')) return 2
  return 1.5
}

function formatMs(ms) {
  if (ms == null) return '—'
  if (ms < 1) return `${(ms * 1000).toFixed(0)} \u00B5s`
  if (ms < 1000) return `${ms.toFixed(2)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

function formatRows(n) {
  if (n == null) return '—'
  return Number(n).toLocaleString('ru-RU')
}

function layoutTree(node, depth = 0) {
  if (node.children.length === 0) {
    node._layout = {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      x: 0,
      y: depth * (NODE_HEIGHT + V_GAP),
      subtreeWidth: NODE_WIDTH,
    }
    return node
  }

  node.children.forEach((child) => layoutTree(child, depth + 1))

  const childrenTotalWidth =
    node.children.reduce((sum, c) => sum + c._layout.subtreeWidth, 0) +
    H_GAP * (node.children.length - 1)

  const subtreeWidth = Math.max(NODE_WIDTH, childrenTotalWidth)

  let offsetX = 0
  node.children.forEach((child) => {
    child._layout.offsetX = offsetX + child._layout.subtreeWidth / 2 - NODE_WIDTH / 2
    offsetX += child._layout.subtreeWidth + H_GAP
  })

  node._layout = {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    x: childrenTotalWidth / 2 - NODE_WIDTH / 2,
    y: depth * (NODE_HEIGHT + V_GAP),
    subtreeWidth,
  }

  return node
}

function computePositions(node, parentOffsetX = 0) {
  const absX = parentOffsetX + (node._layout.offsetX ?? node._layout.x)
  const absY = node._layout.y
  node._abs = { x: absX, y: absY }

  node.children.forEach((child) => {
    const childGroupOffset = parentOffsetX + (node._layout.x - node._layout.subtreeWidth / 2 + NODE_WIDTH / 2)
    computePositions(child, childGroupOffset + (child._layout.subtreeWidth / 2 - NODE_WIDTH / 2 - child._layout.offsetX + child._layout.offsetX))
  })
}

function flattenPositions(node, parentAbsX = 0) {
  const positions = []

  function walk(n, groupStartX) {
    const absX = groupStartX + (n._layout.offsetX ?? n._layout.x)
    const absY = n._layout.y
    positions.push({ node: n, x: absX, y: absY })
    n._absX = absX
    n._absY = absY

    if (n.children.length > 0) {
      const myCenter = absX + NODE_WIDTH / 2
      const childrenTotalWidth =
        n.children.reduce((sum, c) => sum + c._layout.subtreeWidth, 0) +
        H_GAP * (n.children.length - 1)
      const childrenStartX = myCenter - childrenTotalWidth / 2

      let offset = 0
      n.children.forEach((child) => {
        const childGroupStart = childrenStartX + offset
        walk(child, childGroupStart + (child._layout.subtreeWidth / 2 - NODE_WIDTH / 2))
        offset += child._layout.subtreeWidth + H_GAP
      })
    }
  }

  walk(node, 0)
  return positions
}

function TreeNode({ node, x, y, isSelected, onClick }) {
  const bg = getNodeBg(node.timePercent)
  const stroke = getNodeStroke(node, isSelected)
  const sw = getStrokeWidth(node, isSelected)
  const icon = getNodeIcon(node.type)
  const label = node.relation ? `${node.type} on ${node.relation}` : node.type
  const warningCount = node.warnings.length
  const pctWidth = Math.min(node.timePercent, 100)

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={(e) => { e.stopPropagation(); onClick(node) }}
      className="cursor-pointer"
    >
      <rect
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={10}
        ry={10}
        fill={bg}
        stroke={stroke}
        strokeWidth={sw}
      />
      {/* Icon + label */}
      <text x={12} y={22} fill="#e2e8f0" fontSize={13} fontWeight={600}>
        {icon} {label.length > 30 ? label.slice(0, 28) + '...' : label}
      </text>
      {/* Metrics */}
      <text x={12} y={42} fill="#94a3b8" fontSize={11}>
        {formatRows(node.actualRows)} rows {'  '} {formatMs(node.exclusiveTime)} {'  '}
        ({node.timePercent.toFixed(1)}%)
      </text>
      {/* Progress bar */}
      <rect x={12} y={52} width={NODE_WIDTH - 24} height={6} rx={3} fill="#1e293b" />
      <rect
        x={12}
        y={52}
        width={Math.max(0, (NODE_WIDTH - 24) * (pctWidth / 100))}
        height={6}
        rx={3}
        fill={
          node.timePercent > 50
            ? '#ef4444'
            : node.timePercent > 20
              ? '#f59e0b'
              : node.timePercent > 5
                ? '#3b82f6'
                : '#475569'
        }
      />
      {/* Warning badge */}
      {warningCount > 0 && (
        <>
          <circle cx={NODE_WIDTH - 18} cy={18} r={10} fill={
            node.warnings.some((w) => w.level === 'danger') ? '#ef4444' :
            node.warnings.some((w) => w.level === 'warning') ? '#f59e0b' : '#3b82f6'
          } opacity={0.9} />
          <text x={NODE_WIDTH - 18} y={22} fill="white" fontSize={10} fontWeight={700} textAnchor="middle">
            {warningCount}
          </text>
        </>
      )}
    </g>
  )
}

function TreeEdges({ positions }) {
  const edges = []

  function walk(node) {
    if (node.children.length > 0) {
      const parentCx = node._absX + NODE_WIDTH / 2
      const parentBy = node._absY + NODE_HEIGHT

      node.children.forEach((child) => {
        const childCx = child._absX + NODE_WIDTH / 2
        const childTy = child._absY
        const midY = (parentBy + childTy) / 2

        const maxRows = Math.max(1, child.actualRows || 1)
        const strokeW = Math.min(4, Math.max(1, Math.log10(maxRows + 1)))

        edges.push(
          <path
            key={`${node.id}-${child.id}`}
            d={`M ${parentCx} ${parentBy} C ${parentCx} ${midY}, ${childCx} ${midY}, ${childCx} ${childTy}`}
            fill="none"
            stroke="#475569"
            strokeWidth={strokeW}
          />,
        )
      })
    }
    node.children.forEach(walk)
  }

  positions.forEach((p) => {
    if (p.node.children.length > 0 && p.node._absX !== undefined) {
      // edges drawn from walk
    }
  })

  if (positions.length > 0) walk(positions[0].node)

  return <>{edges}</>
}

export default function ExplainTree({ root, onNodeClick, selectedNodeId }) {
  const { positions, svgWidth, svgHeight } = useMemo(() => {
    const cloned = structuredClone(root)
    layoutTree(cloned, 0)
    const pos = flattenPositions(cloned, 0)

    let maxX = 0
    let maxY = 0
    pos.forEach((p) => {
      if (p.x + NODE_WIDTH > maxX) maxX = p.x + NODE_WIDTH
      if (p.y + NODE_HEIGHT > maxY) maxY = p.y + NODE_HEIGHT
    })

    return {
      positions: pos,
      svgWidth: maxX + PADDING * 2,
      svgHeight: maxY + PADDING * 2,
    }
  }, [root])

  return (
    <div className="overflow-auto border border-slate-700 rounded-xl bg-slate-900/50">
      <svg
        width={Math.max(svgWidth, 600)}
        height={svgHeight}
        className="min-w-full"
      >
        <g transform={`translate(${PADDING}, ${PADDING})`}>
          <TreeEdges positions={positions} />
          {positions.map((p) => (
            <TreeNode
              key={p.node.id}
              node={p.node}
              x={p.x}
              y={p.y}
              isSelected={selectedNodeId === p.node.id}
              onClick={onNodeClick}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
