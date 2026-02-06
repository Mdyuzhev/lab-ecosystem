import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Brain, Terminal,
  Shield, Zap, Users, Target, Rocket,
  CheckCircle, ChevronRight, AlertTriangle, Layers,
  Database, Network, TrendingUp, Eye, Server,
  Workflow, BarChart3, Lightbulb, PlayCircle, TestTube,
  Plug, ClipboardList, Monitor, Settings, Globe, Bot, RefreshCw, ShieldCheck, Clock, User2
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
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', badge: 'bg-emerald-500/20 text-emerald-400' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/50', badge: 'bg-blue-500/20 text-blue-400' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/50', badge: 'bg-purple-500/20 text-purple-400' },
}

const phases = [
  {
    phase: '\u0424\u0430\u0437\u0430 0',
    title: '\u0418\u043d\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0430 \u044d\u043a\u0441\u043f\u0435\u0440\u0438\u043c\u0435\u043d\u0442\u043e\u0432',
    period: '\u041c\u0435\u0441\u044f\u0446 1 (\u043d\u0435\u0434\u0435\u043b\u0438 1-4)',
    colorKey: 'slate',
    items: [
      '\u0420\u0430\u0437\u0432\u0451\u0440\u0442\u044b\u0432\u0430\u043d\u0438\u0435 \u0441\u0442\u0435\u043d\u0434\u0430: K3s + GitLab CI + YouTrack + Telegram \u0431\u043e\u0442',
      '\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430 MCP-\u0441\u0435\u0440\u0432\u0435\u0440\u0430: \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 bash, git, psql, kubectl, API',
      '\u0428\u0430\u0431\u043b\u043e\u043d \u0438\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0438 \u0430\u0433\u0435\u043d\u0442\u0430: \u0444\u043e\u0440\u043c\u0430\u0442 .md, \u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0430 \u0448\u0430\u0433\u043e\u0432, \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043e\u0448\u0438\u0431\u043e\u043a',
      '\u0424\u0440\u0435\u0439\u043c\u0432\u043e\u0440\u043a \u0438\u0437\u043c\u0435\u0440\u0435\u043d\u0438\u0439: \u0432\u0440\u0435\u043c\u044f \u0434\u043e/\u043f\u043e\u0441\u043b\u0435, \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u043e \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0430, \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c \u0432\u044b\u0437\u043e\u0432\u0430',
      '\u041f\u0435\u0440\u0432\u044b\u0439 \u044d\u043a\u0441\u043f\u0435\u0440\u0438\u043c\u0435\u043d\u0442: smoke-test \u043f\u043e\u0441\u043b\u0435 \u0434\u0435\u043f\u043b\u043e\u044f (\u0437\u0430\u0434\u0430\u0447\u0430 #1.3.4)',
      '\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044f: \u043a\u0430\u043a \u0437\u0430\u043f\u0443\u0441\u043a\u0430\u0442\u044c \u0430\u0433\u0435\u043d\u0442\u0430, \u043a\u0430\u043a \u043f\u0438\u0441\u0430\u0442\u044c \u0438\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0438',
    ],
    deliverable: '\u0420\u0430\u0431\u043e\u0447\u0438\u0439 \u0441\u0442\u0435\u043d\u0434, MCP-\u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f, \u043f\u0435\u0440\u0432\u0430\u044f \u0437\u0430\u0434\u0430\u0447\u0430 \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u0430 \u0430\u0433\u0435\u043d\u0442\u043e\u043c',
  },
  {
    phase: '\u0424\u0430\u0437\u0430 1',
    title: '\u0411\u044b\u0441\u0442\u0440\u044b\u0435 \u043f\u043e\u0431\u0435\u0434\u044b (Wave 1)',
    period: '\u041c\u0435\u0441\u044f\u0446\u044b 2-3 (\u043d\u0435\u0434\u0435\u043b\u0438 5-12)',
    colorKey: 'emerald',
    items: [
      '\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 Flyway-\u043c\u0438\u0433\u0440\u0430\u0446\u0438\u0439 \u043f\u0435\u0440\u0435\u0434 \u0434\u0435\u043f\u043b\u043e\u0435\u043c \u2192 \u043e\u0442\u0447\u0451\u0442 \u0432 MR',
      '\u041c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433 SSL-\u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043a\u0430\u0442\u043e\u0432: \u0435\u0436\u0435\u0434\u043d\u0435\u0432\u043d\u0430\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430, \u0430\u043b\u0435\u0440\u0442 \u0437\u0430 30/14/7 \u0434\u043d\u0435\u0439',
      '\u0413\u0435\u043d\u0435\u0440\u0430\u0446\u0438\u044f changelog \u043f\u043e \u043a\u043e\u043c\u043c\u0438\u0442\u0430\u043c \u043c\u0435\u0436\u0434\u0443 \u0442\u0435\u0433\u0430\u043c\u0438',
      '\u0410\u0443\u0434\u0438\u0442 K8s-\u043a\u043e\u043d\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u0438: \u043b\u0438\u043c\u0438\u0442\u044b, health checks, secrets',
      '\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 Swagger-\u0430\u043d\u043d\u043e\u0442\u0430\u0446\u0438\u0439 \u043f\u043e\u0441\u043b\u0435 \u043a\u0430\u0436\u0434\u043e\u0433\u043e MR',
      '\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e\u0441\u0442\u0438 \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u044b\u0445 \u0441\u0435\u0440\u0432\u0438\u0441\u043e\u0432 \u043f\u0435\u0440\u0435\u0434 \u0434\u0435\u043f\u043b\u043e\u0435\u043c',
      'A/B-\u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u0435: \u0430\u0433\u0435\u043d\u0442 vs \u0440\u0443\u0447\u043d\u0430\u044f \u0440\u0430\u0431\u043e\u0442\u0430 \u0434\u043b\u044f \u043a\u0430\u0436\u0434\u043e\u0439 \u0437\u0430\u0434\u0430\u0447\u0438',
      '\u0421\u0431\u043e\u0440 \u043c\u0435\u0442\u0440\u0438\u043a: \u0432\u0440\u0435\u043c\u044f, \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u043e, \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c \u0434\u043b\u044f \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u044d\u043a\u0441\u043f\u0435\u0440\u0438\u043c\u0435\u043d\u0442\u0430',
    ],
    deliverable: '8-10 \u0437\u0430\u0434\u0430\u0447 \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u044e\u0442\u0441\u044f \u0430\u0433\u0435\u043d\u0442\u043e\u043c \u0440\u0435\u0433\u0443\u043b\u044f\u0440\u043d\u043e, \u043c\u0435\u0442\u0440\u0438\u043a\u0438 \u044d\u043a\u043e\u043d\u043e\u043c\u0438\u0438 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u044b',
  },
  {
    phase: '\u0424\u0430\u0437\u0430 2',
    title: '\u0423\u0433\u043b\u0443\u0431\u043b\u0451\u043d\u043d\u0430\u044f \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u044f (Wave 2-3)',
    period: '\u041c\u0435\u0441\u044f\u0446\u044b 4-5 (\u043d\u0435\u0434\u0435\u043b\u0438 13-20)',
    colorKey: 'blue',
    items: [
      '\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439 code review: style, null safety, \u0442\u0435\u0441\u0442\u044b, \u0430\u0440\u0445\u0438\u0442\u0435\u043a\u0442\u0443\u0440\u043d\u044b\u0435 \u043f\u0430\u0442\u0442\u0435\u0440\u043d\u044b',
      '\u041c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433 \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u0430 \u0434\u0430\u043d\u043d\u044b\u0445: NULL \u0432 \u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u043f\u043e\u043b\u044f\u0445, \u0431\u0438\u0442\u044b\u0435 FK, \u0434\u0443\u0431\u043b\u0438\u043a\u0430\u0442\u044b',
      '\u0410\u043d\u0430\u043b\u0438\u0437 pg_stat_statements \u2192 \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u0438 \u043f\u043e \u0438\u043d\u0434\u0435\u043a\u0441\u0430\u043c',
      '\u0413\u0435\u043d\u0435\u0440\u0430\u0446\u0438\u044f \u0442\u0435\u0441\u0442\u043e\u0432\u044b\u0445 \u0434\u0430\u043d\u043d\u044b\u0445 \u043f\u043e \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u044e \u043c\u043e\u0434\u0435\u043b\u0438 (fixtures \u0441\u043e \u0441\u0432\u044f\u0437\u044f\u043c\u0438)',
      '\u0410\u043d\u0430\u043b\u0438\u0437 \u0442\u0435\u0445\u043d\u0438\u0447\u0435\u0441\u043a\u043e\u0433\u043e \u0434\u043e\u043b\u0433\u0430: TODO/FIXME, \u0443\u0441\u0442\u0430\u0440\u0435\u0432\u0448\u0438\u0435 \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u0438 \u0441 CVE',
      'Right-sizing \u043a\u043e\u043d\u0442\u0435\u0439\u043d\u0435\u0440\u043e\u0432: CPU/RAM \u0430\u043d\u0430\u043b\u0438\u0437, \u0442\u0440\u0435\u043d\u0434\u044b, \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u0438',
      '\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u043f\u043e\u0441\u0442\u043c\u043e\u0440\u0442\u0435\u043c: \u0441\u0431\u043e\u0440 \u043b\u043e\u0433\u043e\u0432 + \u043c\u0435\u0442\u0440\u0438\u043a \u2192 \u0447\u0435\u0440\u043d\u043e\u0432\u0438\u043a \u043e\u0442\u0447\u0451\u0442\u0430',
      '\u041e\u0440\u043a\u0435\u0441\u0442\u0440\u0430\u0446\u0438\u044f: \u0446\u0435\u043f\u043e\u0447\u043a\u0438 \u0437\u0430\u0434\u0430\u0447 (\u0434\u0435\u043f\u043b\u043e\u0439 \u2192 smoke \u2192 \u0430\u043b\u0435\u0440\u0442 \u2192 \u043e\u0442\u043a\u0430\u0442 \u043f\u0440\u0438 \u043e\u0448\u0438\u0431\u043a\u0435)',
    ],
    deliverable: '20+ \u0437\u0430\u0434\u0430\u0447 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u043d\u043e, \u0446\u0435\u043f\u043e\u0447\u043a\u0438 \u0437\u0430\u0434\u0430\u0447 \u0440\u0430\u0431\u043e\u0442\u0430\u044e\u0442, \u043e\u0440\u043a\u0435\u0441\u0442\u0440\u0430\u0446\u0438\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u0435\u043d\u0430',
  },
  {
    phase: '\u0424\u0430\u0437\u0430 3',
    title: '\u041c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f \u0438 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430',
    period: '\u041c\u0435\u0441\u044f\u0446 6 (\u043d\u0435\u0434\u0435\u043b\u0438 21-24)',
    colorKey: 'purple',
    items: [
      '\u041a\u0430\u0442\u0430\u043b\u043e\u0433 \u043f\u0440\u043e\u0432\u0435\u0440\u0435\u043d\u043d\u044b\u0445 \u0437\u0430\u0434\u0430\u0447: \u0448\u0430\u0431\u043b\u043e\u043d\u044b \u0438\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0439, \u043c\u0435\u0442\u0440\u0438\u043a\u0438, \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u0438',
      '\u041c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f \u0432\u043d\u0435\u0434\u0440\u0435\u043d\u0438\u044f: \u043a\u0430\u043a \u0432\u044b\u0431\u0438\u0440\u0430\u0442\u044c \u0437\u0430\u0434\u0430\u0447\u0438, \u043a\u0430\u043a \u0438\u0437\u043c\u0435\u0440\u044f\u0442\u044c \u044d\u0444\u0444\u0435\u043a\u0442',
      '\u0414\u0430\u0448\u0431\u043e\u0440\u0434 \u0430\u0433\u0435\u043d\u0442\u0430: \u0447\u0442\u043e \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u043e, \u0441\u043a\u043e\u043b\u044c\u043a\u043e \u0441\u044d\u043a\u043e\u043d\u043e\u043c\u043b\u0435\u043d\u043e, \u0433\u0434\u0435 \u0431\u044b\u043b\u0438 \u043e\u0448\u0438\u0431\u043a\u0438',
      '\u0412\u0435\u0431-\u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f: \u0437\u0430\u043f\u0443\u0441\u043a \u0437\u0430\u0434\u0430\u0447, \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u043b\u043e\u0433\u043e\u0432, \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430 \u0440\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u044f',
      '\u0421\u0442\u0430\u0442\u044c\u044f \u043d\u0430 \u0425\u0430\u0431\u0440: \u043c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f, \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b, \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u0438',
      '\u0417\u0430\u0449\u0438\u0442\u0430 \u043f\u0440\u043e\u0435\u043a\u0442\u0430, \u043f\u0440\u0435\u0437\u0435\u043d\u0442\u0430\u0446\u0438\u044f \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432',
    ],
    deliverable: '\u0412\u043e\u0441\u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u043c\u0430\u044f \u043c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f + \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u0430\u0433\u0435\u043d\u0442\u0430\u043c\u0438',
  },
]

const team = [
  { role: 'MCP & Infra', focus: '\u0421\u0442\u0435\u043d\u0434 + \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f', icon: Plug, desc: 'MCP-\u0441\u0435\u0440\u0432\u0435\u0440, \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u043e\u0432 (bash, git, psql, kubectl), \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430 \u0441\u0442\u0435\u043d\u0434\u0430', tech: 'MCP, Docker, K8s, Linux' },
  { role: 'Agent Scripts', focus: '\u0418\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0438 \u0430\u0433\u0435\u043d\u0442\u0430', icon: ClipboardList, desc: '\u041d\u0430\u043f\u0438\u0441\u0430\u043d\u0438\u0435 .md-\u0438\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0439 \u0434\u043b\u044f \u043a\u0430\u0436\u0434\u043e\u0439 \u0437\u0430\u0434\u0430\u0447\u0438, \u043e\u0442\u043b\u0430\u0434\u043a\u0430, \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 edge cases', tech: 'Markdown, Shell, prompting' },
  { role: 'Metrics & QA', focus: '\u0418\u0437\u043c\u0435\u0440\u0435\u043d\u0438\u044f', icon: BarChart3, desc: '\u0424\u0440\u0435\u0439\u043c\u0432\u043e\u0440\u043a \u0434\u043e/\u043f\u043e\u0441\u043b\u0435, \u0441\u0431\u043e\u0440 \u043c\u0435\u0442\u0440\u0438\u043a, A/B-\u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f, \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044c \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u0430 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432', tech: 'Python, Grafana, \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430' },
  { role: 'Platform UI', focus: '\u0414\u0430\u0448\u0431\u043e\u0440\u0434 + \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435', icon: Monitor, desc: '\u0412\u0435\u0431-\u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441: \u0437\u0430\u043f\u0443\u0441\u043a \u0437\u0430\u0434\u0430\u0447, \u043b\u043e\u0433\u0438, \u0440\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u0435, \u043e\u0442\u0447\u0451\u0442\u044b \u043f\u043e \u044d\u043a\u043e\u043d\u043e\u043c\u0438\u0438', tech: 'React, Tailwind, REST API' },
  { role: 'DevOps & CI', focus: '\u0418\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044f \u0432 \u043f\u0430\u0439\u043f\u043b\u0430\u0439\u043d', icon: Settings, desc: 'GitLab CI-\u0438\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044f, \u0442\u0440\u0438\u0433\u0433\u0435\u0440\u044b \u0430\u0433\u0435\u043d\u0442\u0430, \u043e\u0440\u043a\u0435\u0441\u0442\u0440\u0430\u0446\u0438\u044f \u0446\u0435\u043f\u043e\u0447\u0435\u043a, Telegram-\u0431\u043e\u0442', tech: 'GitLab CI, Python, Bash' },
]

export default function SoftwareAIAgents() {
  return (
    <div className="min-h-screen bg-slate-950">

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/labs/software" className="hover:text-white transition-colors">Лаборатория ПО</Link>
            <span>/</span>
            <span className="text-emerald-400">AI-агенты для QA</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Rocket className="text-emerald-400" size={14} />
            <span className="text-emerald-400 text-sm font-medium">Исследование &rarr; Методология &rarr; Платформа</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI-агенты для <span className="text-emerald-400">QA</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mb-8">
            Автономные агенты, которые выполняют реальные задачи разработки: прогоняют тесты,
            проверяют миграции, мониторят инфраструктуру, генерируют отчёты. Не чат-боты —
            а полноценные исполнители с доступом к инструментам через MCP-протокол.
          </p>

          <div className="flex flex-wrap gap-6">
            <div className="glass rounded-xl px-6 py-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">56</div>
              <div className="text-sm text-slate-400">задач-гипотез</div>
            </div>
            <div className="glass rounded-xl px-6 py-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">4</div>
              <div className="text-sm text-slate-400">направления</div>
            </div>
            <div className="glass rounded-xl px-6 py-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">20-50&times;</div>
              <div className="text-sm text-slate-400">ускорение рутины</div>
            </div>
          </div>
        </div>
      </section>

      {/* Проблема */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-8">
              <AlertTriangle className="text-emerald-400" size={24} />
              <h2 className="text-2xl font-bold">Проблема</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  QA-инженер в крупной команде тратит значительную часть времени
                  на повторяемые задачи: проверить миграцию, прогнать smoke-тест после деплоя,
                  убедиться что SSL не истечёт, собрать changelog, написать постмортем.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  Каждая задача по отдельности — 30 минут. Но их десятки, и они повторяются
                  каждый спринт, каждый деплой, каждый инцидент. В сумме это
                  <span className="text-emerald-400 font-medium"> сотни часов в год</span> на
                  работу, которую можно формализовать.
                </p>
                <p className="text-slate-400">
                  AI-агенты способны взять эту рутину на себя — не заменяя инженера,
                  а работая как автономный ассистент с доступом к CLI, API, базам данных
                  и системам мониторинга.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: TestTube, area: 'Автотесты', pain: 'Ручной запуск, анализ flaky, генерация Page Object — часы рутины каждую неделю' },
                  { icon: Database, area: 'Базы данных', pain: 'Проверка миграций, аудит схемы, мониторинг качества данных — раз в спринт забывают' },
                  { icon: Globe, area: 'Инфраструктура', pain: 'SSL, health-check, K8s-аудит, chaos-тестирование — всё руками, всё по чеклисту' },
                  { icon: ClipboardList, area: 'Процессы', pain: 'Code review, changelog, постмортем, документация API — отнимают время у инженерии' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-xl p-4 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-emerald-400" size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.area}</div>
                      <div className="text-sm text-slate-400">{item.pain}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Что уже есть: методология триады */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-emerald-400" size={24} />
              <h2 className="text-2xl font-bold">Что уже есть</h2>
            </div>
            <p className="text-slate-400 mb-8">
              Не теория — реальный опыт промышленной разработки с AI-агентами
            </p>

            <div className="glass rounded-2xl p-8 border border-emerald-500/20 mb-8">
              <h3 className="text-xl font-semibold mb-6 text-emerald-400">
                Методология &laquo;Триада&raquo;
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-xl bg-slate-800 p-6 text-center">
                  <div className="mb-3"><User2 className="text-emerald-400 mx-auto" size={28} /></div>
                  <div className="font-semibold mb-2">Продукт-овнер</div>
                  <p className="text-sm text-slate-400">
                    Человек. Ставит задачу, принимает решения, контролирует результат.
                    Отвечает за &laquo;что&raquo; и &laquo;зачем&raquo;.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-800 p-6 text-center">
                  <div className="mb-3"><Brain className="text-emerald-400 mx-auto" size={28} /></div>
                  <div className="font-semibold mb-2">Стратег (Claude Opus)</div>
                  <p className="text-sm text-slate-400">
                    LLM для планирования. Декомпозирует задачу, пишет спецификации,
                    создаёт пошаговые инструкции для исполнителя.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-800 p-6 text-center">
                  <div className="mb-3"><Zap className="text-emerald-400 mx-auto" size={28} /></div>
                  <div className="font-semibold mb-2">Исполнитель (Claude Code)</div>
                  <p className="text-sm text-slate-400">
                    AI-агент с доступом к терминалу, git, API. Выполняет инструкции
                    автономно: пишет код, запускает тесты, деплоит.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold mb-4 text-emerald-400 flex items-center gap-2"><CheckCircle size={18} /> Подтверждено на практике</h3>
                <div className="space-y-2">
                  {[
                    'Планирование Logistics Hub: 109 задач за 8 минут (экономия 230-800K\u20BD)',
                    'UI-автотесты на Selenide: от инструкции до работающих тестов',
                    'CI/CD pipeline: validate \u2192 build \u2192 test \u2192 deploy автономно',
                    'Рефакторинг API: миграция схемы БД + код + тесты за сессию',
                    'Мониторинг: настройка Prometheus + Grafana + алертинг',
                    'Документация: автогенерация из кода и коммитов',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="text-emerald-400 mt-0.5 flex-shrink-0" size={14} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold mb-4 text-amber-400 flex items-center gap-2"><AlertTriangle size={18} /> Обнаруженные ограничения</h3>
                <div className="space-y-2">
                  {[
                    'Когнитивная перегрузка: >2 агентов одновременно — потеря контекста',
                    'Критическое мышление снижается при делегировании планирования',
                    'Агент не понимает бизнес-контекст — нужны точные спецификации',
                    'Flaky-поведение: одна и та же инструкция может дать разный результат',
                    'Стоимость ошибки растёт: агент уверенно делает неправильные вещи',
                    'Нет встроенного механизма самопроверки результатов',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <AlertTriangle className="text-amber-400 mt-0.5 flex-shrink-0" size={14} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6 mt-8">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">3-4&times;</div>
                  <div className="text-sm text-slate-400">ускорение разработки (подтверждено)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">2 агента</div>
                  <div className="text-sm text-slate-400">оптимальный потолок на человека</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">50-60&times;</div>
                  <div className="text-sm text-slate-400">ускорение механической работы</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 56 задач-гипотез */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-emerald-400" size={24} />
              <h2 className="text-2xl font-bold">56 задач-гипотез</h2>
            </div>
            <p className="text-slate-400 mb-8">
              Каждая задача сформулирована как проверяемая гипотеза: &laquo;если агент сделает X,
              то метрика Y улучшится на Z%&raquo;. Четыре направления, от автотестов до процессов.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TestTube className="text-emerald-400" size={20} />
                  <h3 className="font-semibold">Автотесты</h3>
                  <span className="text-xs text-slate-500">7 задач</span>
                </div>
                <div className="space-y-2">
                  {[
                    { task: 'UI-автотесты на Selenide', status: 'done' },
                    { task: 'Генерация тест-кейсов из ТЗ/user story', status: 'planned' },
                    { task: 'Автогенерация Page Object по скриншоту', status: 'planned' },
                    { task: 'Автоматический анализ flaky-тестов', status: 'planned' },
                    { task: 'Генерация тестовых данных по модели', status: 'planned' },
                    { task: 'Мутационное тестирование', status: 'research' },
                    { task: 'Визуальное регрессионное тестирование', status: 'research' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="flex-shrink-0">
                        {item.status === 'done' && <CheckCircle className="text-emerald-400" size={14} />}
                        {item.status === 'planned' && <Clock className="text-blue-400" size={14} />}
                        {item.status === 'research' && <Lightbulb className="text-amber-400" size={14} />}
                      </span>
                      <span>{item.task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="text-blue-400" size={20} />
                  <h3 className="font-semibold">Базы данных</h3>
                  <span className="text-xs text-slate-500">6 задач</span>
                </div>
                <div className="space-y-2">
                  {[
                    { task: 'Автопроверка Flyway-миграций перед деплоем', status: 'planned' },
                    { task: 'Аудит схемы dev vs prod', status: 'planned' },
                    { task: 'Мониторинг качества данных (NULL, FK, дубли)', status: 'planned' },
                    { task: 'Генерация тестовых fixtures по схеме', status: 'planned' },
                    { task: 'Анализ pg_stat_statements, рекомендации по индексам', status: 'planned' },
                    { task: 'Авто-откат при деградации SQL после деплоя', status: 'research' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="flex-shrink-0">
                        {item.status === 'done' && <CheckCircle className="text-emerald-400" size={14} />}
                        {item.status === 'planned' && <Clock className="text-blue-400" size={14} />}
                        {item.status === 'research' && <Lightbulb className="text-amber-400" size={14} />}
                      </span>
                      <span>{item.task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Server className="text-amber-400" size={20} />
                  <h3 className="font-semibold">Инфраструктура</h3>
                  <span className="text-xs text-slate-500">6 задач</span>
                </div>
                <div className="space-y-2">
                  {[
                    { task: 'Проверка доступности перед деплоем (DNS, порты, сервисы)', status: 'planned' },
                    { task: 'Мониторинг SSL-сертификатов + автоперевыпуск', status: 'planned' },
                    { task: 'Аудит K8s: лимиты, health checks, secrets', status: 'planned' },
                    { task: 'Smoke-test после деплоя \u2192 Telegram', status: 'planned' },
                    { task: 'Right-sizing: анализ CPU/RAM, рекомендации', status: 'planned' },
                    { task: 'Chaos-тестирование: убить pod, проверить восстановление', status: 'research' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="flex-shrink-0">
                        {item.status === 'done' && <CheckCircle className="text-emerald-400" size={14} />}
                        {item.status === 'planned' && <Clock className="text-blue-400" size={14} />}
                        {item.status === 'research' && <Lightbulb className="text-amber-400" size={14} />}
                      </span>
                      <span>{item.task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Workflow className="text-purple-400" size={20} />
                  <h3 className="font-semibold">Процессы разработки</h3>
                  <span className="text-xs text-slate-500">7 задач</span>
                </div>
                <div className="space-y-2">
                  {[
                    { task: 'Автоматический code review в MR', status: 'planned' },
                    { task: 'Генерация changelog по коммитам', status: 'planned' },
                    { task: 'Анализ техдолга: TODO, CVE, мёртвый код', status: 'planned' },
                    { task: 'Проверка Swagger-аннотаций, полнота API-документации', status: 'planned' },
                    { task: 'Прогнозирование сроков по velocity', status: 'research' },
                    { task: 'Агент-онбординг: чат-бот по архитектуре проекта', status: 'research' },
                    { task: 'Автоматический постмортем: логи + метрики \u2192 отчёт', status: 'research' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="flex-shrink-0">
                        {item.status === 'done' && <CheckCircle className="text-emerald-400" size={14} />}
                        {item.status === 'planned' && <Clock className="text-blue-400" size={14} />}
                        {item.status === 'research' && <Lightbulb className="text-amber-400" size={14} />}
                      </span>
                      <span>{item.task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-6 mt-6 text-sm text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle className="text-emerald-400" size={12} /> Реализовано</span>
              <span className="flex items-center gap-1"><Clock className="text-blue-400" size={12} /> В плане</span>
              <span className="flex items-center gap-1"><Lightbulb className="text-amber-400" size={12} /> Исследование</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Как работает агент */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <PlayCircle className="text-emerald-400" size={24} />
              <h2 className="text-2xl font-bold">Как работает агент</h2>
            </div>
            <p className="text-slate-400 mb-8">
              Пример: задача &laquo;Smoke-test после деплоя&raquo; — от триггера до отчёта в Telegram
            </p>

            <div className="glass rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { step: '1', title: 'Триггер', desc: 'GitLab CI вызывает агента после deploy-prod', icon: Rocket },
                  { step: '2', title: 'Инструкция', desc: 'Агент читает .md-файл с шагами проверки', icon: ClipboardList },
                  { step: '3', title: 'Health Check', desc: 'curl API endpoint, проверка HTTP 200 + response time', icon: ShieldCheck },
                  { step: '4', title: 'CRUD Test', desc: 'Создать/прочитать/обновить/удалить через API', icon: RefreshCw },
                  { step: '5', title: 'Connections', desc: 'Проверить PostgreSQL, Kafka, Redis подключения', icon: Plug },
                  { step: '6', title: 'Отчёт', desc: 'Результат + детали \u2192 Telegram + YouTrack', icon: BarChart3 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="mb-2"><item.icon className="text-emerald-400 mx-auto" size={22} /></div>
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-slate-700">
                <span className="text-sm text-slate-500 line-through">Человек: 15-30 минут</span>
                <span className="text-sm text-emerald-400 font-medium">Агент: 45 секунд</span>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="text-emerald-400" size={20} />
                <h3 className="font-semibold">Инструменты агента (MCP)</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Model Context Protocol — стандарт Anthropic для подключения LLM к внешним инструментам.
                Агент получает доступ не через хаки, а через формальный протокол.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'bash (терминал)', 'git (репозиторий)', 'curl (HTTP)', 'psql (PostgreSQL)',
                  'kubectl (K8s)', 'docker (контейнеры)', 'YouTrack API', 'GitLab API',
                  'Telegram API', 'файловая система',
                ].map(tool => (
                  <span key={tool} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Формат гипотезы */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="text-amber-400" size={24} />
              <h2 className="text-2xl font-bold">Формат: гипотеза, не задача</h2>
            </div>
            <p className="text-slate-400 mb-8">
              Каждая из 56 задач — это проверяемая гипотеза с метрикой успеха,
              а не просто &laquo;сделать фичу&raquo;. Это позволяет объективно оценить: работает агент или нет.
            </p>

            <div className="glass rounded-2xl p-8 border border-amber-500/20 max-w-3xl mx-auto">
              <div className="text-xs text-amber-400 uppercase tracking-wider mb-2">Пример: задача #1.3.4</div>
              <h3 className="text-lg font-semibold mb-4">Smoke-test после деплоя</h3>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase mb-1">Гипотеза</div>
                  <div className="text-slate-300 text-sm">
                    Если агент прогонит стандартный набор проверок (health, CRUD API, коннекты к БД/Kafka/Redis)
                    после каждого деплоя, то время обнаружения поломок сократится с 15-60 минут до 1-2 минут.
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 uppercase mb-1">Метрика успеха</div>
                  <div className="text-slate-300 text-sm">
                    MTTR (Mean Time To Recovery) &le; 5 минут для типовых поломок.
                    100% деплоев покрыты автоматическим smoke-тестом.
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 uppercase mb-1">Инструменты</div>
                  <div className="flex flex-wrap gap-2">
                    {['bash', 'curl', 'psql', 'Telegram API', 'YouTrack API'].map(t => (
                      <span key={t} className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">{t}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 uppercase mb-1">Приоритет</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">Wave 1 — быстрая победа</span>
                    <span className="text-xs text-slate-500">1-2 недели на реализацию</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-8">
              {[
                { label: 'ЕСЛИ', desc: 'Агент делает конкретное действие', color: 'text-blue-400' },
                { label: 'ТО', desc: 'Метрика изменяется измеримо', color: 'text-emerald-400' },
                { label: 'ПОТОМУ ЧТО', desc: 'Устраняется конкретная рутинная задача', color: 'text-amber-400' },
                { label: 'ПРОВЕРЯЕМ', desc: 'До/после сравнение по метрике', color: 'text-purple-400' },
              ].map((item, i) => (
                <motion.div key={item.label} {...stagger(i)} className="glass rounded-xl p-4 text-center">
                  <div className={`text-sm font-bold ${item.color} mb-2`}>{item.label}</div>
                  <div className="text-xs text-slate-400">{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Дорожная карта */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-emerald-400" size={24} />
              <h2 className="text-2xl font-bold">Дорожная карта</h2>
            </div>
            <p className="text-slate-400 mb-8">6 месяцев, 4 фазы — от экспериментов к воспроизводимой методологии</p>
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
              <Users className="text-emerald-400" size={24} />
              <h2 className="text-2xl font-bold">Команда</h2>
            </div>
            <p className="text-slate-400 mb-8">5 студентов, каждый с автономной зоной ответственности</p>

            <div className="grid md:grid-cols-5 gap-4">
              {team.map((member, i) => (
                <motion.div
                  key={member.role}
                  {...stagger(i)}
                  className="glass rounded-xl p-4 text-center"
                >
                  <div className="mb-3"><member.icon className="text-emerald-400 mx-auto" size={24} /></div>
                  <div className="font-semibold text-sm mb-1">{member.role}</div>
                  <div className="text-xs text-emerald-400 mb-2">{member.focus}</div>
                  <p className="text-xs text-slate-400 mb-3">{member.desc}</p>
                  <div className="text-xs text-slate-500">{member.tech}</div>
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
                    { label: 'Smoke-test после деплоя', before: '15-30 мин', after: '45 сек', save: '\u00d725' },
                    { label: 'Проверка миграций', before: '20-40 мин', after: '2 мин', save: '\u00d715' },
                    { label: 'Генерация changelog', before: '30-60 мин', after: '30 сек', save: '\u00d760' },
                    { label: 'Аудит K8s-конфигурации', before: '1-2 часа', after: '3 мин', save: '\u00d725' },
                    { label: 'Code review (первичный)', before: '30-60 мин', after: '2 мин', save: '\u00d720' },
                    { label: 'Постмортем (черновик)', before: '2-4 часа', after: '5 мин', save: '\u00d730' },
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
                    { title: 'Масштабируемость', desc: 'Одна инструкция = один агент на любое количество проектов. Горизонтальное масштабирование без найма.' },
                    { title: 'Воспроизводимость', desc: 'Методология из каталога: выбрал задачу \u2192 взял шаблон \u2192 запустил. Не \u00abмагия одного человека\u00bb.' },
                    { title: 'Культура измерений', desc: 'Каждая автоматизация сопровождается метрикой \u00abдо/после\u00bb. Бизнес видит ROI, а не технологический хайп.' },
                    { title: 'Конкурентное преимущество', desc: 'Ранний опыт с AI-агентами в промышленной QA — задел для развития компетенций на 2-3 года вперёд.' },
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
                { value: '56', label: 'задач-гипотез в реестре', colorClass: 'text-emerald-400' },
                { value: '200+', label: 'часов экономии в год (прогноз)', colorClass: 'text-blue-400' },
                { value: '10+', label: 'MCP-инструментов подключено', colorClass: 'text-amber-400' },
                { value: '1', label: 'методология (воспроизводимая)', colorClass: 'text-purple-400' },
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
              { icon: <Shield className="text-emerald-400 mb-3" size={24} />, title: 'Контролируемая автономность', desc: 'Агент работает строго по инструкции. Нет доступа к продакшн-данным напрямую — только через утверждённые MCP-подключения. Каждое действие логируется.' },
              { icon: <Eye className="text-emerald-400 mb-3" size={24} />, title: 'Человек в контуре', desc: 'Критические действия (деплой в прод, откат, изменение конфигурации) требуют подтверждения человека. Агент предлагает — человек решает.' },
              { icon: <BarChart3 className="text-emerald-400 mb-3" size={24} />, title: 'Метрики, не вера', desc: 'Каждая задача — гипотеза с измеримой метрикой. Если агент не даёт выигрыша — задача возвращается в ручной режим. Без догматизма.' },
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
          <h2 className="text-2xl font-bold mb-4">Хотите увидеть реестр задач?</h2>
          <p className="text-slate-400 mb-8">
            56 задач-гипотез с приоритезацией, метриками и оценками эффекта.
            Impact Calculator поможет оценить потенциальную экономию для вашей команды.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/tools/impact-calculator"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors font-medium flex items-center gap-2"
            >
              <BarChart3 size={18} />
              Impact Calculator
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
