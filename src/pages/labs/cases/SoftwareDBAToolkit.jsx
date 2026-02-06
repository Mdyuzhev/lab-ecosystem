import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Database, Search, GitBranch,
  Brain, Shield, Zap, Clock, Users, Target, Rocket,
  CheckCircle, ChevronRight, Code, AlertTriangle, Layers,
  Lock, Puzzle, TrendingUp, Network, Lightbulb, Eye
} from 'lucide-react'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

function stagger(i) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay: i * 0.1 },
  }
}

const phaseColors = {
  slate: { text: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500/50', badge: 'bg-slate-500/20 text-slate-400' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/50', badge: 'bg-amber-500/20 text-amber-400' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', badge: 'bg-emerald-500/20 text-emerald-400' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/50', badge: 'bg-blue-500/20 text-blue-400' },
}

const teamColors = {
  amber: 'text-amber-400',
  purple: 'text-purple-400',
  blue: 'text-blue-400',
  emerald: 'text-emerald-400',
  cyan: 'text-cyan-400',
}

const phases = [
  {
    phase: '\u0424\u0430\u0437\u0430 0', title: '\u041a\u043e\u043d\u0441\u043e\u043b\u0438\u0434\u0430\u0446\u0438\u044f', period: '\u041c\u0435\u0441\u044f\u0446 1 (\u043d\u0435\u0434\u0435\u043b\u0438 1-4)',
    colorKey: 'slate',
    items: [
      '\u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435 \u043f\u0440\u043e\u0442\u043e\u0442\u0438\u043f\u043e\u0432 \u0432 \u0435\u0434\u0438\u043d\u044b\u0439 \u043f\u0440\u043e\u0435\u043a\u0442 \u0441 \u043e\u0431\u0449\u0438\u043c \u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u043c \u043a\u0430\u0440\u043a\u0430\u0441\u043e\u043c',
      '\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u043e\u0431\u0449\u0438\u0445 \u043c\u043e\u0434\u0443\u043b\u0435\u0439: SQL Parser, SVG Renderer, Warning Analyzer',
      '\u0415\u0434\u0438\u043d\u044b\u0439 \u0434\u0438\u0437\u0430\u0439\u043d-\u0441\u0438\u0441\u0442\u0435\u043c\u0430 (\u043a\u043e\u043c\u043f\u043e\u043d\u0435\u043d\u0442\u044b \u043a\u0430\u0440\u0442\u043e\u0447\u0435\u043a, \u043f\u0430\u043d\u0435\u043b\u0435\u0439, \u0442\u0430\u0431\u043b\u0438\u0446)',
      '\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435 \u0441\u0435\u0441\u0441\u0438\u0439 \u0432 localStorage (\u0438\u0441\u0442\u043e\u0440\u0438\u044f \u043f\u043b\u0430\u043d\u043e\u0432 \u0438 \u0441\u0445\u0435\u043c)',
      'CI/CD, \u043b\u0438\u043d\u0442\u0435\u0440\u044b, \u0442\u0435\u0441\u0442\u044b, \u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0430 \u043f\u0440\u043e\u0435\u043a\u0442\u0430',
    ],
    deliverable: '\u0415\u0434\u0438\u043d\u043e\u0435 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435 DBA Toolkit \u0441 \u0434\u0432\u0443\u043c\u044f \u0432\u043a\u043b\u0430\u0434\u043a\u0430\u043c\u0438 \u0438 \u043e\u0431\u0449\u0438\u043c\u0438 \u043c\u043e\u0434\u0443\u043b\u044f\u043c\u0438',
  },
  {
    phase: '\u0424\u0430\u0437\u0430 1', title: '\u0423\u0433\u043b\u0443\u0431\u043b\u0435\u043d\u0438\u0435', period: '\u041c\u0435\u0441\u044f\u0446\u044b 2-3 (\u043d\u0435\u0434\u0435\u043b\u0438 5-12)',
    colorKey: 'amber',
    items: [
      'Query Analyzer: \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430 \u0442\u0435\u043a\u0441\u0442\u043e\u0432\u043e\u0433\u043e EXPLAIN (\u043d\u0435 \u0442\u043e\u043b\u044c\u043a\u043e JSON)',
      'Query Analyzer: \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u0435 \u0434\u0432\u0443\u0445 \u043f\u043b\u0430\u043d\u043e\u0432 side-by-side (\u0434\u043e/\u043f\u043e\u0441\u043b\u0435 \u043e\u043f\u0442\u0438\u043c\u0438\u0437\u0430\u0446\u0438\u0438)',
      'Schema Explorer: \u0430\u0432\u0442\u043e\u043b\u044d\u0439\u0430\u0443\u0442 \u0433\u0440\u0430\u0444\u0430 \u0431\u0435\u0437 \u043f\u0435\u0440\u0435\u0441\u0435\u0447\u0435\u043d\u0438\u044f \u043b\u0438\u043d\u0438\u0439',
      'Schema Explorer: \u0444\u0438\u043b\u044c\u0442\u0440 \u00ab\u043f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043e\u043a\u0440\u0435\u0441\u0442\u043d\u043e\u0441\u0442\u044c \u0442\u0430\u0431\u043b\u0438\u0446\u044b\u00bb (\u0433\u043b\u0443\u0431\u0438\u043d\u0430 1-2)',
      'Schema Explorer: \u043f\u0430\u0440\u0441\u0438\u043d\u0433 pg_dump --schema-only',
      '\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u0438\u0435 \u0430\u043d\u0430\u043b\u0438\u0437\u0430\u0442\u043e\u0440\u0430: 15 \u2192 30 \u043f\u0440\u0430\u0432\u0438\u043b \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0438',
      '\u042d\u043a\u0441\u043f\u043e\u0440\u0442: PNG, SVG \u0434\u043b\u044f \u0434\u0438\u0430\u0433\u0440\u0430\u043c\u043c, SQL \u0434\u043b\u044f \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u0439',
      '\u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430 \u0430\u043d\u0442\u0438\u043f\u0430\u0442\u0442\u0435\u0440\u043d\u043e\u0432: 10+ \u0442\u0438\u043f\u043e\u0432\u044b\u0445 \u043f\u0440\u043e\u0431\u043b\u0435\u043c\u043d\u044b\u0445 \u043f\u043b\u0430\u043d\u043e\u0432 \u0441 \u0440\u0430\u0437\u0431\u043e\u0440\u043e\u043c',
    ],
    deliverable: '\u041f\u043e\u043b\u043d\u043e\u0446\u0435\u043d\u043d\u044b\u0435 Query Analyzer + Schema Explorer \u0441 \u044d\u043a\u0441\u043f\u043e\u0440\u0442\u043e\u043c',
  },
  {
    phase: '\u0424\u0430\u0437\u0430 2', title: '\u041d\u043e\u0432\u044b\u0435 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u044b + AI', period: '\u041c\u0435\u0441\u044f\u0446\u044b 4-5 (\u043d\u0435\u0434\u0435\u043b\u0438 13-20)',
    colorKey: 'emerald',
    items: [
      'Schema Diff: \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0434\u0432\u0443\u0445 DDL, \u0432\u0438\u0437\u0443\u0430\u043b\u044c\u043d\u044b\u0439 diff, \u0433\u0435\u043d\u0435\u0440\u0430\u0446\u0438\u044f \u043c\u0438\u0433\u0440\u0430\u0446\u0438\u0438',
      'Performance Hub: \u043f\u0430\u0440\u0441\u0438\u043d\u0433 pg_stat_statements, \u0433\u0440\u0443\u043f\u043f\u0438\u0440\u043e\u0432\u043a\u0430, treemap',
      '\u0421\u0432\u044f\u0437\u043a\u0430 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u043e\u0432: \u043a\u043b\u0438\u043a \u043d\u0430 \u0437\u0430\u043f\u0440\u043e\u0441 \u0432 Performance Hub \u2192 EXPLAIN \u2192 \u0434\u0435\u0440\u0435\u0432\u043e',
      'AI-\u0441\u043e\u0432\u0435\u0442\u043d\u0438\u043a: \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u0438 \u043f\u043e \u043e\u043f\u0442\u0438\u043c\u0438\u0437\u0430\u0446\u0438\u0438 \u0437\u0430\u043f\u0440\u043e\u0441\u043e\u0432 (Claude API)',
      'AI-\u0441\u043e\u0432\u0435\u0442\u043d\u0438\u043a: \u0430\u0443\u0434\u0438\u0442 \u0441\u0445\u0435\u043c\u044b \u0441 \u043a\u043e\u043d\u043a\u0440\u0435\u0442\u043d\u044b\u043c\u0438 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f\u043c\u0438',
      'AI-\u0441\u043e\u0432\u0435\u0442\u043d\u0438\u043a: \u043e\u0431\u044a\u044f\u0441\u043d\u0435\u043d\u0438\u0435 \u043f\u043b\u0430\u043d\u0430 \u043f\u0440\u043e\u0441\u0442\u044b\u043c \u044f\u0437\u044b\u043a\u043e\u043c \u0434\u043b\u044f \u0434\u0436\u0443\u043d\u0438\u043e\u0440\u043e\u0432',
      '\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430 MySQL (\u0441\u0438\u043d\u0442\u0430\u043a\u0441\u0438\u0441 DDL + EXPLAIN)',
    ],
    deliverable: '\u0427\u0435\u0442\u044b\u0440\u0435 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u0430 + AI-\u0441\u043e\u0432\u0435\u0442\u043d\u0438\u043a + \u0434\u0432\u0430 \u0434\u0438\u0430\u043b\u0435\u043a\u0442\u0430 SQL',
  },
  {
    phase: '\u0424\u0430\u0437\u0430 3', title: '\u041f\u0440\u043e\u0434\u0443\u043a\u0442\u0438\u0437\u0430\u0446\u0438\u044f', period: '\u041c\u0435\u0441\u044f\u0446 6 (\u043d\u0435\u0434\u0435\u043b\u0438 21-24)',
    colorKey: 'blue',
    items: [
      '\u0415\u0434\u0438\u043d\u044b\u0439 \u0434\u0430\u0448\u0431\u043e\u0440\u0434 DBA: \u0441\u0432\u043e\u0434\u043a\u0430 \u043f\u043e \u0441\u0445\u0435\u043c\u0435 + \u0442\u043e\u043f \u043f\u0440\u043e\u0431\u043b\u0435\u043c\u043d\u044b\u0445 \u0437\u0430\u043f\u0440\u043e\u0441\u043e\u0432 + \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u0438',
      '\u0428\u0430\u0431\u043b\u043e\u043d\u044b \u0430\u0443\u0434\u0438\u0442\u0430: \u00ab\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u043f\u0435\u0440\u0435\u0434 \u0440\u0435\u043b\u0438\u0437\u043e\u043c\u00bb, \u00ab\u0415\u0436\u0435\u043c\u0435\u0441\u044f\u0447\u043d\u044b\u0439 \u0430\u0443\u0434\u0438\u0442 \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u0438\u00bb',
      '\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u0441\u043a\u0430\u044f \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044f + \u0438\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0439 tutorial',
      '\u0414\u0435\u043c\u043e-\u0441\u0442\u0435\u043d\u0434: \u0440\u0435\u0430\u043b\u0438\u0441\u0442\u0438\u0447\u043d\u0430\u044f \u0441\u0445\u0435\u043c\u0430 \u0442\u0435\u043b\u0435\u043a\u043e\u043c-\u0431\u0438\u043b\u043b\u0438\u043d\u0433\u0430 (50+ \u0442\u0430\u0431\u043b\u0438\u0446) \u0441 \u043f\u0440\u043e\u0431\u043b\u0435\u043c\u0430\u043c\u0438',
      '\u041d\u0430\u0433\u0440\u0443\u0437\u043e\u0447\u043d\u043e\u0435 \u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435: DDL \u0441 200 \u0442\u0430\u0431\u043b\u0438\u0446\u0430\u043c\u0438, EXPLAIN \u043d\u0430 100+ \u0443\u0437\u043b\u043e\u0432',
      '\u0417\u0430\u0449\u0438\u0442\u0430 \u043f\u0440\u043e\u0435\u043a\u0442\u0430, \u043f\u0440\u0435\u0437\u0435\u043d\u0442\u0430\u0446\u0438\u044f \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432',
    ],
    deliverable: 'MVP \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u044b DBA Toolkit, \u0433\u043e\u0442\u043e\u0432\u044b\u0439 \u043a \u043f\u0438\u043b\u043e\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e',
  },
]

const team = [
  { role: 'Query Engine', focus: 'EXPLAIN + Performance', icon: '\u26A1', desc: '\u041f\u0430\u0440\u0441\u0438\u043d\u0433 EXPLAIN (JSON + text), \u0434\u0435\u0440\u0435\u0432\u043e, \u043c\u0435\u0442\u0440\u0438\u043a\u0438, \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u0435 \u043f\u043b\u0430\u043d\u043e\u0432, slow log', tech: 'JS, SVG, \u0430\u043b\u0433\u043e\u0440\u0438\u0442\u043c\u044b', color: 'amber' },
  { role: 'Schema Engine', focus: 'ERD + Diff', icon: '\uD83D\uDDFA', desc: 'DDL-\u043f\u0430\u0440\u0441\u0435\u0440, \u0430\u0432\u0442\u043e\u043b\u044d\u0439\u0430\u0443\u0442 \u0433\u0440\u0430\u0444\u0430, Schema Diff, \u0433\u0435\u043d\u0435\u0440\u0430\u0446\u0438\u044f \u043c\u0438\u0433\u0440\u0430\u0446\u0438\u0439', tech: 'JS, SVG, \u0433\u0440\u0430\u0444-\u0430\u043b\u0433\u043e\u0440\u0438\u0442\u043c\u044b', color: 'purple' },
  { role: 'Frontend', focus: 'UI \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u044b', icon: '\uD83C\uDFA8', desc: '\u0415\u0434\u0438\u043d\u044b\u0439 \u043a\u0430\u0440\u043a\u0430\u0441, \u0434\u0438\u0437\u0430\u0439\u043d-\u0441\u0438\u0441\u0442\u0435\u043c\u0430, \u0434\u0430\u0448\u0431\u043e\u0440\u0434\u044b, \u044d\u043a\u0441\u043f\u043e\u0440\u0442 \u0432 PNG/PDF', tech: 'React, Tailwind, Canvas', color: 'blue' },
  { role: 'AI & Analytics', focus: 'AI-\u0441\u043e\u0432\u0435\u0442\u043d\u0438\u043a', icon: '\uD83E\uDD16', desc: '\u041f\u0440\u043e\u043c\u043f\u0442\u044b \u0434\u043b\u044f \u043e\u043f\u0442\u0438\u043c\u0438\u0437\u0430\u0446\u0438\u0438, \u0430\u0443\u0434\u0438\u0442\u0430, \u043e\u0431\u044a\u044f\u0441\u043d\u0435\u043d\u0438\u0439. \u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u0438\u0435 \u043f\u0440\u0430\u0432\u0438\u043b \u0430\u043d\u0430\u043b\u0438\u0437\u0430\u0442\u043e\u0440\u0430', tech: 'LLM API, \u043f\u0440\u043e\u043c\u043f\u0442-\u0438\u043d\u0436\u0435\u043d\u0435\u0440\u0438\u044f', color: 'emerald' },
  { role: 'QA & Data', focus: '\u0422\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435', icon: '\uD83E\uDDEA', desc: '\u0422\u0435\u0441\u0442\u043e\u0432\u044b\u0435 DDL \u0438 \u043f\u043b\u0430\u043d\u044b, \u0431\u0435\u043d\u0447\u043c\u0430\u0440\u043a\u0438, \u043a\u0440\u043e\u0441\u0441\u0431\u0440\u0430\u0443\u0437\u0435\u0440\u043d\u043e\u0441\u0442\u044c, CI/CD, \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044f', tech: 'Jest, Playwright, Docker', color: 'cyan' },
]

export default function SoftwareDBAToolkit() {
  return (
    <div className="min-h-screen bg-slate-950">

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/labs/software" className="hover:text-white transition-colors">Лаборатория ПО</Link>
            <span>/</span>
            <span className="text-amber-400">DBA Toolkit</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Rocket className="text-amber-400" size={14} />
            <span className="text-amber-400 text-sm font-medium">План развития: Прототипы &rarr; Платформа</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            DBA <span className="text-amber-400">Toolkit</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mb-8">
            Набор инструментов для администраторов баз данных: визуализация планов запросов,
            интерактивные ER-диаграммы, анализ производительности и рекомендации по оптимизации.
            Всё в браузере, без установки, данные не покидают компьютер.
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
            <div className="glass rounded-xl p-4 border border-amber-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Search className="text-amber-400" size={20} />
                <div className="font-semibold">EXPLAIN Visualizer</div>
              </div>
              <p className="text-sm text-slate-400">
                Интерактивное дерево плана выполнения PostgreSQL с bottleneck-анализом
              </p>
            </div>
            <div className="glass rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Network className="text-purple-400" size={20} />
                <div className="font-semibold">ERD Builder</div>
              </div>
              <p className="text-sm text-slate-400">
                ER-диаграмма по DDL-скриптам с анализом проблем схемы
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Проблема */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-8">
              <AlertTriangle className="text-amber-400" size={24} />
              <h2 className="text-2xl font-bold">Проблема</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  DBA ежедневно работает с планами выполнения запросов и структурой базы данных.
                  Стандартные инструменты — либо текстовый вывод <span className="font-mono text-amber-400">EXPLAIN</span> на 50+ строк,
                  в котором глаза ломаются, либо тяжёлые десктопные приложения типа DBeaver и pgAdmin.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  Онлайн-инструменты существуют (explain.dalibo.com, dbdiagram.io), но
                  отправляют данные на чужие серверы — для корпоративной среды это
                  неприемлемый риск. Структура базы и планы запросов — это чувствительная информация.
                </p>
                <p className="text-slate-400">
                  Нужен набор инструментов, который работает локально, визуализирует
                  сложные структуры и помогает находить проблемы — а не просто показывает сырые данные.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: '\uD83D\uDCC4', pain: 'Текстовый EXPLAIN', desc: 'Дерево из 50 строк, вложенность 8 уровней, bottleneck не виден' },
                  { icon: '\uD83D\uDDA5', pain: 'Тяжёлые IDE', desc: 'DBeaver/pgAdmin — установка, лицензии, нет мобильного доступа' },
                  { icon: '\uD83C\uDF10', pain: 'Онлайн-инструменты', desc: 'Данные уходят на чужие серверы — неприемлемо для продакшн-схем' },
                  { icon: '\u270F\uFE0F', pain: 'Ручные ERD', desc: 'Рисуют связи в draw.io руками, забывают обновить после ALTER TABLE' },
                  { icon: '\uD83D\uDD0D', pain: 'Слепые зоны', desc: 'FK без индексов, таблицы-сироты, циклические зависимости — не видны без анализа' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-xl p-4 flex items-start gap-4"
                  >
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="font-medium text-white">{item.pain}</div>
                      <div className="text-sm text-slate-400">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Что уже есть */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-emerald-400" size={24} />
              <h2 className="text-2xl font-bold">Что уже есть</h2>
            </div>
            <p className="text-slate-400 mb-8">Два прототипа, доступные в браузере</p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass rounded-2xl p-8 border border-amber-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <Search className="text-amber-400" size={24} />
                  <h3 className="text-xl font-semibold text-amber-400">EXPLAIN Visualizer</h3>
                </div>
                <ul className="space-y-2 mb-6">
                  {[
                    'Парсинг EXPLAIN (ANALYZE, FORMAT JSON)',
                    'Интерактивное SVG-дерево узлов плана',
                    'Цветовая кодировка по % времени выполнения',
                    '8 типов предупреждений (Seq Scan, disk sort, hash batches...)',
                    'Панель деталей: тайминги, строки, буферы, условия',
                    'Топ-3 самых медленных узлов',
                    'Три встроенных демо-плана разной сложности',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="text-emerald-400 mt-0.5 flex-shrink-0" size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/tools/explain-visualizer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 transition-colors text-sm font-medium"
                >
                  Открыть прототип
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="glass rounded-2xl p-8 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <Network className="text-purple-400" size={24} />
                  <h3 className="text-xl font-semibold text-purple-400">ERD Builder</h3>
                </div>
                <ul className="space-y-2 mb-6">
                  {[
                    'Парсинг CREATE TABLE / ALTER TABLE / CREATE INDEX',
                    'Интерактивная SVG-диаграмма с drag & drop',
                    "Линии FK-связей с crow's foot нотацией",
                    'Подсветка проблем: FK без индекса, сироты, циклы',
                    'Панель деталей таблицы: колонки, индексы, связи',
                    'Генерация SQL для пропущенных индексов',
                    'Три демо-схемы (e-commerce, телеком, HR с проблемами)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="text-emerald-400 mt-0.5 flex-shrink-0" size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/tools/erd-builder"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-medium"
                >
                  Открыть прототип
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="glass rounded-xl p-6 mt-8">
              <h3 className="font-semibold mb-3 text-slate-400">Ограничения прототипов</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-400">
                {[
                  'Два отдельных инструмента, не связаны между собой',
                  'Нет сохранения сессий и истории анализа',
                  'Нет AI-рекомендаций по оптимизации',
                  'Только PostgreSQL (нет MySQL, Oracle, MSSQL)',
                  'Нет экспорта диаграмм (PNG, SVG, PDF)',
                  'Нет сравнения схем (dev vs prod)',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-3 h-3 rounded-full border border-slate-600 mt-1 flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Целевая платформа */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <Layers className="text-amber-400" size={24} />
              <h2 className="text-2xl font-bold">Целевая платформа</h2>
            </div>
            <p className="text-slate-400 mb-8">
              Единое пространство для DBA: от анализа одного запроса до аудита всей схемы
            </p>

            <div className="space-y-4">
              <div className="glass rounded-xl p-6 border border-amber-500/20">
                <div className="text-xs text-amber-400 uppercase tracking-wider mb-3">DBA Workspace</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 text-center">
                    <Search className="text-amber-400 mx-auto mb-2" size={20} />
                    <div className="text-sm font-medium">Query Analyzer</div>
                    <div className="text-xs text-slate-500">EXPLAIN &rarr; дерево &rarr; оптимизация</div>
                  </div>
                  <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-4 text-center">
                    <Network className="text-purple-400 mx-auto mb-2" size={20} />
                    <div className="text-sm font-medium">Schema Explorer</div>
                    <div className="text-xs text-slate-500">DDL &rarr; ERD &rarr; аудит</div>
                  </div>
                  <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4 text-center">
                    <GitBranch className="text-blue-400 mx-auto mb-2" size={20} />
                    <div className="text-sm font-medium">Schema Diff</div>
                    <div className="text-xs text-slate-500">dev vs prod &rarr; миграция</div>
                  </div>
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                    <TrendingUp className="text-emerald-400 mx-auto mb-2" size={20} />
                    <div className="text-sm font-medium">Performance Hub</div>
                    <div className="text-xs text-slate-500">slow log &rarr; анализ &rarr; тренды</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-1 text-slate-600">
                  <div className="w-px h-4 bg-slate-600" />
                  <ChevronRight className="rotate-90" size={16} />
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Общие модули</div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { icon: '\uD83D\uDCDD', name: 'SQL Parser', desc: 'DDL, DML, EXPLAIN' },
                    { icon: '\uD83C\uDFA8', name: 'SVG Renderer', desc: 'Деревья, графы, ERD' },
                    { icon: '\u26A0\uFE0F', name: 'Analyzer', desc: '50+ правил проверки' },
                    { icon: '\uD83E\uDD16', name: 'AI Advisor', desc: 'Рекомендации LLM' },
                    { icon: '\uD83D\uDCCA', name: 'Exporter', desc: 'PNG, SVG, PDF, SQL' },
                  ].map(item => (
                    <div key={item.name} className="rounded-lg bg-slate-800 p-3 text-center">
                      <div className="text-lg mb-1">{item.icon}</div>
                      <div className="text-xs font-medium">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-1 text-slate-600">
                  <div className="w-px h-4 bg-slate-600" />
                  <ChevronRight className="rotate-90" size={16} />
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="text-amber-400" size={16} />
                  <div className="text-xs text-amber-400 uppercase tracking-wider">Поддержка СУБД</div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'PostgreSQL', status: 'active' },
                    { name: 'MySQL', status: 'planned' },
                    { name: 'Oracle', status: 'planned' },
                    { name: 'MS SQL', status: 'planned' },
                    { name: 'ClickHouse', status: 'research' },
                    { name: 'SQLite', status: 'research' },
                  ].map(db => (
                    <span
                      key={db.name}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        db.status === 'active'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : db.status === 'planned'
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {db.name}
                      {db.status === 'active' && ' \u2713'}
                      {db.status === 'research' && ' *'}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 mt-3 text-xs text-slate-500">
                  <span>&check; реализовано</span>
                  <span className="text-slate-400">&bull; в плане</span>
                  <span>* исследование</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ключевые фичи MVP */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="text-amber-400" size={24} />
              <h2 className="text-2xl font-bold">Ключевые фичи MVP</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="text-amber-400" size={20} />
                  <h3 className="font-semibold">Query Analyzer</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">расширение EXPLAIN</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {[
                    'Визуализация EXPLAIN ANALYZE в виде интерактивного дерева',
                    'Поддержка текстового формата (не только JSON)',
                    'Сравнение двух планов (до/после оптимизации)',
                    'AI-рекомендации: \u00abсоздайте индекс на orders(customer_id)\u00bb',
                    'История запросов в localStorage с поиском',
                    'Экспорт дерева в PNG/SVG',
                    'Библиотека антипаттернов: типовые проблемные планы с объяснениями',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="text-amber-400 mt-0.5 flex-shrink-0" size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Network className="text-purple-400" size={20} />
                  <h3 className="font-semibold">Schema Explorer</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">расширение ERD</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {[
                    'Интерактивная ERD с drag & drop и zoom',
                    'Автолэйаут с учётом связей (граф без пересечений)',
                    'Аудит схемы: 15+ правил (FK без индекса, сироты, циклы, wide tables)',
                    'Генерация миграционного SQL для каждой проблемы',
                    'Фильтрация: показать только таблицы связанные с выбранной',
                    'Поддержка pg_dump --schema-only как входа',
                    'Экспорт ERD в SVG/PNG/PDF',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="text-purple-400 mt-0.5 flex-shrink-0" size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GitBranch className="text-blue-400" size={20} />
                  <h3 className="font-semibold">Schema Diff</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">новый</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {[
                    'Сравнение двух DDL: dev vs prod, v1 vs v2',
                    'Визуальный diff: новые таблицы, удалённые колонки, изменённые типы',
                    'Автогенерация миграционного SQL (ALTER TABLE, CREATE INDEX)',
                    'Подсветка потенциально опасных изменений (DROP, type change)',
                    'Экспорт миграции в .sql файл',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="text-blue-400 mt-0.5 flex-shrink-0" size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-emerald-400" size={20} />
                  <h3 className="font-semibold">Performance Hub</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">новый</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {[
                    'Загрузка pg_stat_statements или slow log',
                    'Группировка запросов по шаблонам (нормализация параметров)',
                    'Ранжирование: какие запросы съедают 80% времени',
                    'Визуализация: treemap по total_time, calls, mean_time',
                    'Связь с Query Analyzer: клик на запрос \u2192 EXPLAIN \u2192 дерево',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="text-emerald-400 mt-0.5 flex-shrink-0" size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI-советник */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <Brain className="text-emerald-400" size={24} />
              <h2 className="text-2xl font-bold">AI-советник</h2>
            </div>
            <p className="text-slate-400 mb-8">
              Не заменяет DBA — усиливает. Анализирует план или схему и предлагает конкретные действия.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass rounded-xl p-6 border border-emerald-500/20">
                <h3 className="font-semibold mb-3 text-emerald-400">{'\uD83E\uDD16'} &laquo;Оптимизировать запрос&raquo;</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <p>DBA вставляет EXPLAIN ANALYZE медленного запроса.</p>
                  <p>AI получает дерево плана + предупреждения анализатора.</p>
                  <div className="rounded-lg bg-slate-900 p-3 font-mono text-xs text-emerald-400">
                    &laquo;Seq Scan на orders (534ms, 60% времени). 80% строк отброшено фильтром по created_at.
                    Рекомендую: CREATE INDEX idx_orders_created_at ON orders(created_at);
                    Ожидаемый эффект: Index Scan, ~10ms вместо 534ms.&raquo;
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6 border border-emerald-500/20">
                <h3 className="font-semibold mb-3 text-emerald-400">{'\uD83E\uDD16'} &laquo;Аудит схемы&raquo;</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <p>DBA загрузил DDL из pg_dump. Схема: 45 таблиц.</p>
                  <p>AI получает результат анализа: предупреждения, статистику.</p>
                  <div className="rounded-lg bg-slate-900 p-3 font-mono text-xs text-emerald-400">
                    &laquo;Найдено 12 FK без индексов — это замедлит JOIN и CASCADE DELETE.
                    Таблица audit_log (8M строк) не имеет индекса на created_at — партиционирование
                    по месяцам сократит время очистки с часов до секунд.&raquo;
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6 border border-emerald-500/20">
                <h3 className="font-semibold mb-3 text-emerald-400">{'\uD83E\uDD16'} &laquo;Объяснить план&raquo;</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <p>Джуниор-разработчик не понимает почему запрос медленный.</p>
                  <p>AI объясняет план простым языком с аналогиями.</p>
                  <div className="rounded-lg bg-slate-900 p-3 font-mono text-xs text-emerald-400">
                    &laquo;Представьте: вы ищете книгу в библиотеке. Сейчас БД перебирает все 500K книг
                    подряд (Seq Scan). Индекс — это каталог по автору. С ним БД сразу
                    найдёт нужную полку за 3 шага вместо 500K.&raquo;
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6 mt-8">
              <h3 className="font-semibold mb-3 text-slate-400">Техническая реализация</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-400">
                <div>
                  <span className="text-white">Вход:</span> план/схема + предупреждения анализатора (метаданные, не сырые данные)
                </div>
                <div>
                  <span className="text-white">Модель:</span> Claude API, один вызов с system prompt эксперта PostgreSQL
                </div>
                <div>
                  <span className="text-white">Выход:</span> структурированные рекомендации с конкретным SQL
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Дорожная карта */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-amber-400" size={24} />
              <h2 className="text-2xl font-bold">Дорожная карта</h2>
            </div>
            <p className="text-slate-400 mb-8">6 месяцев, 4 фазы — от двух прототипов к единой платформе</p>
          </motion.div>

          <div className="space-y-0">
            {phases.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-6"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full ${phaseColors[phase.colorKey].bg} border-2 ${phaseColors[phase.colorKey].border} flex items-center justify-center flex-shrink-0 z-10`}>
                    <span className={`${phaseColors[phase.colorKey].text} text-sm font-bold`}>{i}</span>
                  </div>
                  {i < 3 && <div className="w-px flex-1 bg-slate-700 min-h-[20px]" />}
                </div>

                <div className="glass rounded-xl p-6 mb-4 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-xs px-2 py-1 rounded ${phaseColors[phase.colorKey].badge}`}>
                      {phase.phase}
                    </span>
                    <span className="text-xs text-slate-500">{phase.period}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{phase.title}</h3>

                  <ul className="space-y-2 mb-4">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                        <ChevronRight className={`${phaseColors[phase.colorKey].text} mt-0.5 flex-shrink-0`} size={14} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`text-sm font-medium ${phaseColors[phase.colorKey].text} flex items-center gap-2`}>
                    <Rocket size={14} />
                    Результат: {phase.deliverable}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Команда */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-amber-400" size={24} />
              <h2 className="text-2xl font-bold">Команда</h2>
            </div>
            <p className="text-slate-400 mb-8">5 студентов с автономными зонами ответственности</p>

            <div className="grid md:grid-cols-5 gap-4">
              {team.map((member, i) => (
                <motion.div key={member.role} {...stagger(i)} className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">{member.icon}</div>
                  <div className="font-semibold text-sm mb-1">{member.role}</div>
                  <div className={`text-xs ${teamColors[member.color]} mb-2`}>{member.focus}</div>
                  <div className="text-xs text-slate-500 mb-2">{member.desc}</div>
                  <div className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 inline-block">{member.tech}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ценность для компании */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-emerald-400" size={24} />
              <h2 className="text-2xl font-bold">Ценность для компании</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass rounded-2xl p-8 border border-emerald-500/20">
                <h3 className="text-xl font-semibold mb-6 text-emerald-400">Прямая экономия</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Анализ медленного запроса', before: '30-60 мин', after: '2-3 мин', save: '\u00d715' },
                    { label: 'Визуализация схемы БД', before: '2-4 часа (draw.io)', after: '10 сек', save: '\u00d7100+' },
                    { label: 'Аудит схемы перед релизом', before: '1-2 дня', after: '15 мин', save: '\u00d750' },
                    { label: 'Подготовка миграции dev\u2192prod', before: '2-4 часа', after: '5 мин', save: '\u00d730' },
                    { label: 'Онбординг DBA на новый проект', before: '1-2 дня', after: '2 часа', save: '\u00d76' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300 flex-1">{row.label}</span>
                      <span className="text-slate-500 line-through mx-3">{row.before}</span>
                      <span className="text-emerald-400 font-medium mx-3">{row.after}</span>
                      <span className="text-emerald-400 font-bold">{row.save}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-6 text-amber-400">Стратегическая ценность</h3>
                <ul className="space-y-4">
                  {[
                    { title: 'Безопасность', desc: 'Данные не покидают браузер. Никаких внешних сервисов для анализа продакшн-схем и планов запросов.' },
                    { title: 'Стандартизация', desc: 'Единый инструмент для всех DBA. Общий язык: 30 правил аудита вместо \u00abу каждого свой чеклист\u00bb.' },
                    { title: 'Обучение', desc: 'Библиотека антипаттернов и AI-объяснения — обучающий инструмент для джуниоров и разработчиков.' },
                    { title: 'Масштабируемость', desc: 'Новый диалект SQL = новый парсер-модуль. Не переписывание, а расширение.' },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <CheckCircle className="text-amber-400 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <div className="font-medium text-white">{item.title}</div>
                        <div className="text-sm text-slate-400">{item.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { value: '4', label: 'инструмента в платформе', colorClass: 'text-amber-400' },
                { value: '30+', label: 'правил аудита схемы', colorClass: 'text-blue-400' },
                { value: '8+', label: 'типов предупреждений EXPLAIN', colorClass: 'text-purple-400' },
                { value: '0', label: 'данных на чужих серверах', colorClass: 'text-emerald-400' },
              ].map((m, i) => (
                <motion.div key={m.label} {...stagger(i)} className="glass rounded-xl p-4 text-center">
                  <div className={`text-3xl font-bold ${m.colorClass}`}>{m.value}</div>
                  <div className="text-sm text-slate-400 mt-1">{m.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Безопасность и принципы */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Lock className="text-amber-400 mb-3" size={24} />, title: 'Локальная обработка', desc: 'DDL, планы запросов, структура БД — всё обрабатывается в браузере. AI-советник получает только обезличенные метрики, не сырые данные.' },
              { icon: <Puzzle className="text-amber-400 mb-3" size={24} />, title: 'Модульная архитектура', desc: 'Каждый инструмент автономен, но общие модули (парсер, рендерер, анализатор) переиспользуются. Новый диалект SQL = новый парсер-плагин.' },
              { icon: <Zap className="text-amber-400 mb-3" size={24} />, title: 'Нулевой порог входа', desc: 'Открыл URL — работаешь. Никакой установки, регистрации, ключей. Демо-данные позволяют попробовать за 10 секунд.' },
            ].map((card, i) => (
              <motion.div key={card.title} {...stagger(i)} className="glass rounded-xl p-6">
                {card.icon}
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-slate-400">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Попробуйте прототипы</h2>
          <p className="text-slate-400 mb-8">
            Оба инструмента уже работают. Вставьте свой EXPLAIN или DDL — или используйте демо-данные.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/tools/explain-visualizer"
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 transition-colors font-medium flex items-center gap-2"
            >
              <Search size={18} />
              EXPLAIN Visualizer
            </Link>
            <Link
              to="/tools/erd-builder"
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition-colors font-medium flex items-center gap-2"
            >
              <Network size={18} />
              ERD Builder
            </Link>
            <Link
              to="/labs/software"
              className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Все проекты
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
