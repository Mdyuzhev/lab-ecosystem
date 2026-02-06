import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, FileSearch, Upload, Settings, BarChart3,
  Puzzle, Brain, Shield, Zap, Clock, Users, Target, Rocket,
  CheckCircle, ChevronRight, Database, Code, Globe, Download,
  TrendingUp, DollarSign, AlertTriangle, Layers, GitBranch,
  MonitorSmartphone, Lock, Plug
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
  blue: { text: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/50', badge: 'bg-blue-500/20 text-blue-400' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', badge: 'bg-emerald-500/20 text-emerald-400' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/50', badge: 'bg-purple-500/20 text-purple-400' },
}

const teamColors = {
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  cyan: 'text-cyan-400',
}

const metricColors = {
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  amber: 'text-amber-400',
}

export default function SoftwareReconciliation() {
  return (
    <div className="min-h-screen bg-slate-950">

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/labs/software" className="hover:text-white transition-colors">Лаборатория ПО</Link>
            <span>/</span>
            <span className="text-blue-400">Сверка данных</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Rocket className="text-blue-400" size={14} />
            <span className="text-blue-400 text-sm font-medium">План развития: Прототип &rarr; MVP</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Платформа <span className="text-blue-400">сверки данных</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mb-8">
            Универсальный инструмент для сопоставления данных из разных источников.
            Подключаемые модули нормализации, конструктор правил, AI-ассистент
            для автоматической настройки. От CSV-файлов до корпоративных систем.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">6 мес</div>
              <div className="text-sm text-slate-400">до MVP</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">5</div>
              <div className="text-sm text-slate-400">студентов</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">&times;10</div>
              <div className="text-sm text-slate-400">ускорение сверки</div>
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
                  В крупных компаниях данные о клиентах, финансах, операциях хранятся
                  в десятках систем. Каждая система — свой формат, свои ключи,
                  свой уровень актуальности.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  Когда нужно свести данные — аналитик открывает два Excel-файла
                  и начинает сопоставлять руками. Телефон в одной системе
                  <span className="font-mono text-amber-400"> +7(903)123-45-67</span>, в другой —
                  <span className="font-mono text-amber-400"> 89031234567</span>. Компания то
                  <span className="font-mono text-amber-400"> ООО &laquo;Ромашка&raquo;</span>, то
                  <span className="font-mono text-amber-400"> Ромашка, ООО</span>.
                </p>
                <p className="text-slate-400">
                  Это повторяется каждый месяц, в каждом отделе, с каждой новой выгрузкой.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { metric: '2-3 дня/мес', label: 'На ручную сверку биллинга и бухгалтерии', color: 'red' },
                  { metric: '15-20%', label: 'Записей с расхождениями между системами', color: 'amber' },
                  { metric: '7+', label: 'Систем с данными о клиентах', color: 'amber' },
                  { metric: '0', label: 'Единых стандартов форматов данных', color: 'red' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    {...stagger(i)}
                    className="glass rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className={`text-2xl font-bold ${item.color === 'red' ? 'text-red-400' : 'text-amber-400'} min-w-[120px]`}>
                      {item.metric}
                    </div>
                    <div className="text-slate-300">{item.label}</div>
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
            <p className="text-slate-400 mb-8">Работающий прототип, доступный в браузере</p>

            <div className="glass rounded-2xl p-8 border border-emerald-500/20">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-emerald-400">
                    Прототип: Сверка двух CSV
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Загрузка двух CSV-файлов в браузер',
                      'Выбор ключевых полей и полей сравнения',
                      'Нормализация телефонов, ИНН, названий компаний',
                      'Точное, нечёткое и числовое сравнение',
                      'Дашборд со статистикой совпадений и расхождений',
                      'Таблица результатов с фильтрами и сортировкой',
                      'Экспорт результатов в CSV',
                      'Данные не покидают браузер',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <CheckCircle className="text-emerald-400 mt-1 flex-shrink-0" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/tools/data-reconciliation"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors font-medium"
                  >
                    Попробовать прототип
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-400">
                    Ограничения прототипа
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Только два источника (A и B)',
                      'Только CSV-формат',
                      'Правила не сохраняются между сессиями',
                      'Нет каталога нормализаторов — зашиты в код',
                      'Нет AI-помощника',
                      'Нет возможности расширения без программирования',
                      'Максимум ~50K строк (ограничение браузера)',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-400">
                        <div className="w-4 h-4 rounded-full border border-slate-600 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Целевая архитектура */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <Layers className="text-blue-400" size={24} />
              <h2 className="text-2xl font-bold">Целевая архитектура</h2>
            </div>
            <p className="text-slate-400 mb-8">
              Плагинная архитектура: каждый компонент — заменяемый модуль с единым интерфейсом
            </p>

            <div className="space-y-4">
              {/* Потребители */}
              <div className="glass rounded-xl p-6">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Потребители</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4 text-center">
                    <MonitorSmartphone className="text-blue-400 mx-auto mb-2" size={20} />
                    <div className="text-sm font-medium">Web UI</div>
                    <div className="text-xs text-slate-500">Конструктор правил</div>
                  </div>
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                    <Brain className="text-emerald-400 mx-auto mb-2" size={20} />
                    <div className="text-sm font-medium">AI-ассистент</div>
                    <div className="text-xs text-slate-500">Автонастройка</div>
                  </div>
                  <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-4 text-center">
                    <Code className="text-purple-400 mx-auto mb-2" size={20} />
                    <div className="text-sm font-medium">CLI / API</div>
                    <div className="text-xs text-slate-500">Автоматизация</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-1 text-slate-600">
                  <div className="w-px h-4 bg-slate-600" />
                  <ChevronRight className="rotate-90" size={16} />
                </div>
              </div>

              {/* Движок */}
              <div className="glass rounded-xl p-6 border border-blue-500/20">
                <div className="text-xs text-blue-400 uppercase tracking-wider mb-3">Движок сверки</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <Upload className="text-slate-400 mx-auto mb-2" size={20} />
                    <div className="text-sm font-medium">Загрузчики</div>
                    <div className="text-xs text-slate-500 mt-1">CSV, Excel, JSON, SQL</div>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <Settings className="text-slate-400 mx-auto mb-2" size={20} />
                    <div className="text-sm font-medium">Нормализаторы</div>
                    <div className="text-xs text-slate-500 mt-1">Телефон, ИНН, Дата, ...</div>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <GitBranch className="text-slate-400 mx-auto mb-2" size={20} />
                    <div className="text-sm font-medium">Матчеры</div>
                    <div className="text-xs text-slate-500 mt-1">Exact, Fuzzy, LLM</div>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <BarChart3 className="text-slate-400 mx-auto mb-2" size={20} />
                    <div className="text-sm font-medium">Анализаторы</div>
                    <div className="text-xs text-slate-500 mt-1">Аномалии, Отчёты</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-1 text-slate-600">
                  <div className="w-px h-4 bg-slate-600" />
                  <ChevronRight className="rotate-90" size={16} />
                </div>
              </div>

              {/* Плагины */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Puzzle className="text-amber-400" size={16} />
                  <div className="text-xs text-amber-400 uppercase tracking-wider">Каталог плагинов (подключаемые модули)</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'phone_ru', 'inn_ru', 'company_name', 'date_multi', 'email_normalize',
                    'address_ru', 'fio_normalize', 'exact_match', 'fuzzy_match',
                    'numeric_tolerance', 'semantic_llm', 'csv_loader', 'xlsx_loader',
                    'json_loader', 'anomaly_detector', 'duplicate_finder',
                  ].map(plugin => (
                    <span key={plugin} className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono">
                      {plugin}
                    </span>
                  ))}
                  <span className="px-3 py-1 rounded-full bg-slate-700 text-slate-400 text-xs">
                    + ваш модуль
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Подключаемые модули */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <Puzzle className="text-amber-400" size={24} />
              <h2 className="text-2xl font-bold">Подключаемые модули</h2>
            </div>
            <p className="text-slate-400 mb-8">
              Каждый модуль — файл с единым интерфейсом. Написать новый модуль = реализовать контракт.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Code className="text-blue-400" size={18} />
                  Контракт нормализатора
                </h3>
                <pre className="text-sm text-slate-300 bg-slate-900 rounded-lg p-4 overflow-x-auto font-mono leading-relaxed">
{`{
  id: 'phone_ru',
  name: 'Телефон (РФ)',
  type: 'normalizer',
  description: 'Приводит к 7XXXXXXXXXX',
  params: [],
  execute: (value) => {
    const digits = String(value)
      .replace(/\\D/g, '')
    if (digits[0] === '8')
      return '7' + digits.slice(1)
    return digits
  }
}`}</pre>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Code className="text-blue-400" size={18} />
                  Контракт матчера
                </h3>
                <pre className="text-sm text-slate-300 bg-slate-900 rounded-lg p-4 overflow-x-auto font-mono leading-relaxed">
{`{
  id: 'fuzzy_string',
  name: 'Нечёткое сравнение',
  type: 'matcher',
  params: [
    {
      name: 'threshold',
      type: 'number',
      default: 0.85,
      label: 'Порог сходства'
    }
  ],
  execute: (a, b, params) => ({
    match: similarity(a, b)
      >= params.threshold,
    score: similarity(a, b),
  })
}`}</pre>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { type: 'Загрузчики', count: '4+', desc: 'CSV, Excel, JSON, SQL', color: 'text-blue-400' },
                { type: 'Нормализаторы', count: '8+', desc: 'Телефон, ИНН, ФИО, дата, адрес', color: 'text-emerald-400' },
                { type: 'Матчеры', count: '4+', desc: 'Точный, нечёткий, числовой, LLM', color: 'text-amber-400' },
                { type: 'Анализаторы', count: '3+', desc: 'Аномалии, дубли, отчёты', color: 'text-purple-400' },
              ].map((item, i) => (
                <motion.div key={item.type} {...stagger(i)} className="glass rounded-xl p-4 text-center">
                  <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
                  <div className="font-medium text-sm mt-1">{item.type}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI-ассистент */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <Brain className="text-emerald-400" size={24} />
              <h2 className="text-2xl font-bold">AI-ассистент</h2>
            </div>
            <p className="text-slate-400 mb-8">
              Не заменяет пользователя — помогает настроить сверку быстрее
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass rounded-xl p-6 border border-emerald-500/20">
                <h3 className="font-semibold mb-4 text-emerald-400">
                  &laquo;Помочь настроить&raquo;
                </h3>
                <div className="space-y-4 text-sm">
                  {[
                    'Пользователь загрузил два файла',
                    'AI анализирует колонки, типы данных, примеры значений',
                    <span key="s1">Предлагает: <span className="font-mono text-emerald-400">&laquo;A.inn и B.taxpayer_id — одно поле. Рекомендую нормализатор inn_ru как ключ сопоставления&raquo;</span></span>,
                    'Генерирует черновик модели сверки, пользователь корректирует',
                  ].map((text, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                      <div className="text-slate-300">{text}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6 border border-emerald-500/20">
                <h3 className="font-semibold mb-4 text-emerald-400">
                  &laquo;Объяснить результаты&raquo;
                </h3>
                <div className="space-y-4 text-sm">
                  {[
                    'Сверка завершена: 847 совпадений, 23 расхождения, 15 сирот',
                    'AI получает статистику и топ расхождений',
                    <span key="s2">Резюме: <span className="font-mono text-emerald-400">&laquo;12 из 23 расхождений — в поле phone, вероятно смена номеров. 15 сирот — закрытые счета, не мигрированные в CRM&raquo;</span></span>,
                    'Рекомендации: конкретные действия для улучшения качества данных',
                  ].map((text, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                      <div className="text-slate-300">{text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6 mt-8">
              <h3 className="font-semibold mb-3 text-slate-400">Техническая реализация</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-400">
                <div>
                  <span className="text-white">Вход:</span> метаданные файлов (колонки, типы, 5 примеров) + каталог плагинов
                </div>
                <div>
                  <span className="text-white">Модель:</span> Claude API, один вызов, ~500 токенов
                </div>
                <div>
                  <span className="text-white">Выход:</span> JSON-модель сверки, готовая к применению
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
              <Target className="text-blue-400" size={24} />
              <h2 className="text-2xl font-bold">Дорожная карта</h2>
            </div>
            <p className="text-slate-400 mb-8">6 месяцев, 4 фазы, инкрементальное наращивание ценности</p>
          </motion.div>

          <div className="space-y-0">
            {[
              {
                phase: 'Фаза 0', title: 'Запуск', period: 'Месяц 1 (недели 1-4)',
                color: 'slate', status: 'Онбординг',
                items: [
                  'Онбординг команды, настройка окружения',
                  'Архитектурные решения (ADR), фиксация интерфейсов плагинов',
                  'Рефакторинг прототипа: выделение ядра из UI',
                  'Базовые классы: BaseLoader, BaseNormalizer, BaseMatcher',
                  'CI/CD pipeline, линтеры, coverage',
                ],
                deliverable: 'Репозиторий, архитектура, контракты модулей',
              },
              {
                phase: 'Фаза 1', title: 'Фундамент', period: 'Месяцы 2-3 (недели 5-12)',
                color: 'blue', status: 'Ядро',
                items: [
                  'Движок сверки: pipeline загрузка \u2192 нормализация \u2192 матчинг \u2192 отчёт',
                  '8+ нормализаторов: телефон, ИНН, ФИО, компания, дата, email, адрес',
                  '4 матчера: exact, fuzzy (Levenshtein), numeric (\u00b1\u03b4), composite',
                  'Каскадный матчинг: сначала по ИНН, fallback по телефону, fallback по имени',
                  'Конструктор правил в UI: визуальная сборка pipeline из плагинов',
                  'Сохранение/загрузка моделей сверки (JSON, localStorage)',
                  'Генераторы тестовых данных: 1K-100K записей, конфигурируемые аномалии',
                ],
                deliverable: 'Работающий движок + UI конструктор + каталог из 15 плагинов',
              },
              {
                phase: 'Фаза 2', title: 'Интеллект', period: 'Месяцы 4-5 (недели 13-20)',
                color: 'emerald', status: 'AI',
                items: [
                  'AI-ассистент: автонастройка модели по метаданным файлов',
                  'AI-интерпретатор: резюме результатов и рекомендации',
                  'Семантический матчер (LLM): для сложных случаев нечёткого сопоставления',
                  'Автопрофилирование: детект типов данных, рекомендация нормализаторов',
                  'Обнаружение аномалий: выбросы, дубли, подозрительные паттерны',
                  'Поддержка Excel и JSON как источников',
                  'Сверка N:M (один ко многим)',
                ],
                deliverable: 'AI-ассистент + семантический матчинг + расширенные источники',
              },
              {
                phase: 'Фаза 3', title: 'Продуктизация', period: 'Месяц 6 (недели 21-24)',
                color: 'purple', status: 'MVP',
                items: [
                  'Библиотека шаблонов: \u00abБиллинг\u2194CRM\u00bb, \u00abСклад\u21941С\u00bb, \u00abHR\u2194Табель\u00bb',
                  'Расширенная визуализация: Sankey-диаграммы потоков данных',
                  'Экспорт: Excel с листами (сводка, расхождения, сироты), PDF-отчёт',
                  'Документация: пользовательская + разработчика (как писать плагины)',
                  'Демо-стенд с реалистичными данными и сценариями',
                  'Нагрузочное тестирование: 100K строк < 2 мин',
                  'Защита проекта, презентация результатов',
                ],
                deliverable: 'MVP, готовый к пилотированию в отделах компании',
              },
            ].map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-6"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full ${phaseColors[phase.color].bg} border-2 ${phaseColors[phase.color].border} flex items-center justify-center flex-shrink-0 z-10`}>
                    <span className={`${phaseColors[phase.color].text} text-sm font-bold`}>{i}</span>
                  </div>
                  {i < 3 && <div className="w-px flex-1 bg-slate-700 min-h-[20px]" />}
                </div>

                <div className="glass rounded-xl p-6 mb-4 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-xs px-2 py-1 rounded ${phaseColors[phase.color].badge}`}>
                      {phase.phase}
                    </span>
                    <span className="text-xs text-slate-500">{phase.period}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{phase.title}</h3>

                  <ul className="space-y-2 mb-4">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                        <ChevronRight className={`${phaseColors[phase.color].text} mt-0.5 flex-shrink-0`} size={14} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`text-sm font-medium ${phaseColors[phase.color].text} flex items-center gap-2`}>
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
              <Users className="text-blue-400" size={24} />
              <h2 className="text-2xl font-bold">Команда</h2>
            </div>
            <p className="text-slate-400 mb-8">5 студентов с автономными зонами ответственности</p>

            <div className="grid md:grid-cols-5 gap-4">
              {[
                { role: 'Backend Core', focus: 'Движок сверки', tech: 'JS, алгоритмы', color: 'blue', icon: '\u2699\uFE0F', desc: 'Плагинная архитектура, нормализаторы, матчеры, pipeline' },
                { role: 'Frontend', focus: 'UI конструктор', tech: 'React, Tailwind', color: 'purple', icon: '\uD83C\uDFA8', desc: 'Визуальный конструктор правил, дашборды, визуализация' },
                { role: 'AI & Analytics', focus: 'AI-ассистент', tech: 'LLM API, промпты', color: 'emerald', icon: '\uD83E\uDD16', desc: 'Автонастройка, семантический матчинг, анализ аномалий' },
                { role: 'Data & QA', focus: 'Тестирование', tech: 'Python, pytest', color: 'amber', icon: '\uD83E\uDDEA', desc: 'Генераторы данных, тесты, бенчмарки, CI/CD' },
                { role: 'Integrations', focus: 'Форматы и шаблоны', tech: 'JS, parsers', color: 'cyan', icon: '\uD83D\uDD0C', desc: 'Загрузчики (Excel, JSON, SQL), шаблоны сверок, экспорт' },
              ].map((member, i) => (
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
                    { label: 'Сверка биллинг \u2194 бухгалтерия', before: '2-3 дня/мес', after: '2-3 часа', save: '\u00d78-12' },
                    { label: 'Консолидация отчётности филиалов', before: '1 день/мес', after: '30 мин', save: '\u00d716' },
                    { label: 'Мониторинг дебиторской задолженности', before: '4 часа', after: '5 мин', save: '\u00d748' },
                    { label: 'Сверка HR \u2194 система доступов', before: '1 день/квартал', after: '1 час', save: '\u00d78' },
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
                <h3 className="text-xl font-semibold mb-6 text-blue-400">Стратегическая ценность</h3>
                <ul className="space-y-4">
                  {[
                    { title: 'Масштабируемость', desc: 'Один инструмент для всех отделов вместо десятков скриптов. Новый тип сверки = новый шаблон, не новая разработка.' },
                    { title: 'Качество данных', desc: 'Регулярная сверка выявляет проблемы на ранней стадии. Меньше ошибок в отчётности, меньше рисков при аудите.' },
                    { title: 'Основа для автоматизации', desc: 'Каждая подтверждённая модель сверки — готовая спецификация для внедрения через корпоративные инструменты (RPA, ETL).' },
                    { title: 'Развитие компетенций', desc: '5 студентов получают продуктовый опыт. Потенциальный кадровый резерв для компании.' },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <CheckCircle className="text-blue-400 mt-1 flex-shrink-0" size={16} />
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
                { value: '100+', label: 'чел\u00b7часов экономии/мес', color: 'emerald' },
                { value: '15+', label: 'подключаемых модулей', color: 'blue' },
                { value: '7+', label: 'шаблонов сверок', color: 'purple' },
                { value: '\u221E', label: 'новых сценариев без кода', color: 'amber' },
              ].map((m, i) => (
                <motion.div key={m.label} {...stagger(i)} className="glass rounded-xl p-4 text-center">
                  <div className={`text-3xl font-bold ${metricColors[m.color]}`}>{m.value}</div>
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
              {
                icon: <Lock className="text-blue-400 mb-3" size={24} />,
                title: 'Данные под контролем',
                desc: 'Обработка в браузере — файлы не загружаются на внешние серверы. AI-ассистент получает только метаданные (колонки, типы), не содержимое.',
              },
              {
                icon: <Puzzle className="text-amber-400 mb-3" size={24} />,
                title: 'Открытая архитектура',
                desc: 'Плагинный подход позволяет расширять без изменения ядра. Новый отдел — новый набор нормализаторов, не переписывание системы.',
              },
              {
                icon: <Zap className="text-emerald-400 mb-3" size={24} />,
                title: 'Инкрементальная ценность',
                desc: 'Каждая фаза даёт работающий результат. Не \u00abвсё или ничего\u00bb, а постоянный прирост возможностей.',
              },
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
          <h2 className="text-2xl font-bold mb-4">Заинтересовались?</h2>
          <p className="text-slate-400 mb-8">
            Прототип уже работает. Попробуйте с демо-данными или загрузите свои файлы.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/tools/data-reconciliation"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors font-semibold flex items-center gap-2"
            >
              Открыть прототип
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/labs/software"
              className="px-8 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Все проекты лаборатории
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
