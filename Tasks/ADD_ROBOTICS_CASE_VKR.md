# TASK: Добавить кейс ВКР на страницу Лаборатории Робототехники

## Цель

Создать вложенную страницу с примером реального применения платформы — на основе ВКР студента Яковлева по разработке боевого робота. Показать, какие детерминированные ИИ-инструменты могли бы сократить трудозатраты.

## Новая страница

**Путь:** `/labs/robotics/case-vkr`
**Файл:** `src/pages/labs/cases/RoboticsCaseVKR.jsx`

## Структура страницы

### 1. Hero-секция

```jsx
<section className="relative py-20 overflow-hidden">
  {/* Градиент purple как у Робототехники */}
  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />
  
  <div className="max-w-6xl mx-auto px-6">
    {/* Хлебные крошки */}
    <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
      <Link to="/labs/robotics">Лаборатория Робототехники</Link>
      <span>/</span>
      <span className="text-purple-400">Кейс: ВКР</span>
    </div>

    {/* Бейдж */}
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
      <span className="text-purple-400 text-sm font-medium">Реальный пример</span>
    </div>

    <h1 className="text-4xl md:text-5xl font-bold mb-4">
      Как ИИ-инструменты ускоряют <span className="text-purple-400">инженерные проекты</span>
    </h1>
    
    <p className="text-xl text-slate-400 max-w-3xl">
      Разбираем реальную ВКР студента Политеха и показываем, какие детерминированные 
      инструменты могла бы создать платформа для сокращения трудозатрат в 5-10 раз.
    </p>
  </div>
</section>
```

### 2. О проекте

```jsx
<section className="py-16">
  <div className="max-w-6xl mx-auto px-6">
    <div className="grid md:grid-cols-2 gap-8">
      {/* Карточка проекта */}
      <div className="glass rounded-2xl p-8 border border-purple-500/20">
        <h2 className="text-2xl font-bold mb-4">Проект</h2>
        <h3 className="text-xl text-purple-400 mb-4">
          Разработка колесной базы робота для соревнований «Битва роботов»
        </h3>
        <div className="space-y-3 text-slate-300">
          <p><span className="text-slate-500">Студент:</span> Яковлев В.А.</p>
          <p><span className="text-slate-500">Группа:</span> 3331506/10102</p>
          <p><span className="text-slate-500">Руководитель:</span> Мацко О.Н., к.т.н., доцент</p>
        </div>
      </div>
      
      {/* Задачи проекта */}
      <div className="glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4">Что сделано</h2>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-start gap-3">
            <CheckCircle className="text-emerald-400 mt-1 flex-shrink-0" size={18} />
            <span>Анализ существующих решений (3 типа баз)</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="text-emerald-400 mt-1 flex-shrink-0" size={18} />
            <span>Расчёт кинематики привода (2 варианта моторов)</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="text-emerald-400 mt-1 flex-shrink-0" size={18} />
            <span>3D-моделирование в SolidWorks</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="text-emerald-400 mt-1 flex-shrink-0" size={18} />
            <span>3 итерации проектирования с испытаниями</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="text-emerald-400 mt-1 flex-shrink-0" size={18} />
            <span>4 опытных образца</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

### 3. Проблема: трудоёмкие процессы

```jsx
<section className="py-16 bg-slate-900/50">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-2xl font-bold mb-8 text-center">
      Где студент тратил больше всего времени?
    </h2>
    
    <div className="grid md:grid-cols-3 gap-6">
      {[
        {
          icon: Calculator,
          title: 'Расчёты привода',
          time: '4-6 часов',
          desc: '8 формул кинематики, расчёт для двух моторов, проверка по мощности, оформление таблиц результатов'
        },
        {
          icon: RefreshCw,
          title: 'Документирование итераций',
          time: '2-3 часа × 3 версии',
          desc: 'Описание проблем после испытаний, формулировка доработок, сравнение версий, оформление для презентации'
        },
        {
          icon: Table,
          title: 'Сравнительный анализ',
          time: '3-4 часа',
          desc: 'Сбор данных по 3 типам баз, оценка по 7 критериям, построение таблицы, обоснование выбора'
        }
      ].map((item) => (
        <div key={item.title} className="glass rounded-xl p-6 border border-red-500/20">
          <item.icon className="text-red-400 mb-4" size={24} />
          <h3 className="font-semibold mb-2">{item.title}</h3>
          <div className="text-2xl font-bold text-red-400 mb-2">{item.time}</div>
          <p className="text-sm text-slate-400">{item.desc}</p>
        </div>
      ))}
    </div>
    
    <div className="text-center mt-8">
      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/10 border border-red-500/20">
        <Clock className="text-red-400" size={20} />
        <span className="text-red-400 font-semibold">Итого: 15-20 часов на типовые операции</span>
      </div>
    </div>
  </div>
</section>
```

### 4. Решение: три детерминированных инструмента

```jsx
<section className="py-16">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">
        Инструменты, которые создаст <span className="text-emerald-400">ИИ-лаборатория</span>
      </h2>
      <p className="text-slate-400 max-w-2xl mx-auto">
        Эти модули создаются один раз с помощью ИИ, верифицируются, 
        и затем работают детерминированно — быстро, бесплатно, без ошибок.
      </p>
    </div>

    {/* Инструмент 1 */}
    <div className="glass rounded-2xl p-8 mb-8 border border-emerald-500/20">
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <Calculator className="text-emerald-400" size={32} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">Калькулятор кинематики привода</h3>
          <p className="text-slate-400 mb-4">
            Рассчитывает всю кинематическую цепь «мотор → редуктор → колесо» по входным параметрам.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-semibold text-emerald-400 mb-2">Входные данные:</div>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Требуемая скорость (м/с)</li>
                <li>• Масса робота (кг)</li>
                <li>• Характеристики мотора</li>
                <li>• Тип и число ступеней редуктора</li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-400 mb-2">Результат:</div>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Минимальный диаметр колеса</li>
                <li>• Передаточные числа</li>
                <li>• Момент и обороты на каждом валу</li>
                <li>• Готовая таблица для презентации</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-4">
            <span className="text-red-400 line-through">4-6 часов вручную</span>
            <ArrowRight className="text-slate-500" size={16} />
            <span className="text-emerald-400 font-bold">5 минут</span>
          </div>
        </div>
      </div>
    </div>

    {/* Инструмент 2 */}
    <div className="glass rounded-2xl p-8 mb-8 border border-blue-500/20">
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <GitBranch className="text-blue-400" size={32} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">Генератор changelog'а итераций</h3>
          <p className="text-slate-400 mb-4">
            Автоматически документирует изменения между версиями конструкции в структурированном формате.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-semibold text-blue-400 mb-2">Входные данные:</div>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Параметры версии N</li>
                <li>• Результаты испытаний</li>
                <li>• Что сломалось / не работает</li>
                <li>• Параметры версии N+1</li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-400 mb-2">Результат:</div>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Структура: Проблема → Причина → Решение</li>
                <li>• Таблица сравнения версий</li>
                <li>• Раздел «Lessons Learned»</li>
                <li>• Готовые слайды для презентации</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-4">
            <span className="text-red-400 line-through">2-3 часа на версию</span>
            <ArrowRight className="text-slate-500" size={16} />
            <span className="text-blue-400 font-bold">10 минут</span>
          </div>
        </div>
      </div>
    </div>

    {/* Инструмент 3 */}
    <div className="glass rounded-2xl p-8 border border-amber-500/20">
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <LayoutGrid className="text-amber-400" size={32} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">Матрица выбора конструктивного решения</h3>
          <p className="text-slate-400 mb-4">
            Генерирует взвешенную матрицу сравнения альтернатив с автоматическим ранжированием.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-semibold text-amber-400 mb-2">Входные данные:</div>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Список альтернатив</li>
                <li>• Критерии сравнения</li>
                <li>• Веса критериев</li>
                <li>• Оценки по каждому критерию</li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-amber-400 mb-2">Результат:</div>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Взвешенная матрица (Pugh Matrix)</li>
                <li>• Итоговый рейтинг</li>
                <li>• Визуализация (radar chart)</li>
                <li>• Обоснование выбора для ПЗ</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-4">
            <span className="text-red-400 line-through">3-4 часа</span>
            <ArrowRight className="text-slate-500" size={16} />
            <span className="text-amber-400 font-bold">15 минут</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### 5. Экономический эффект

```jsx
<section className="py-16 bg-gradient-to-b from-emerald-500/5 to-transparent">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-2xl font-bold mb-8 text-center">Экономический эффект</h2>
    
    <div className="grid md:grid-cols-2 gap-8">
      {/* Для одной ВКР */}
      <div className="glass rounded-2xl p-8 text-center">
        <div className="text-sm text-slate-400 mb-2">Экономия на одной ВКР</div>
        <div className="text-5xl font-bold text-emerald-400 mb-2">15-20</div>
        <div className="text-xl text-slate-300">часов</div>
        <div className="mt-4 text-sm text-slate-500">
          Время на типовые инженерные операции сокращается на 90-95%
        </div>
      </div>
      
      {/* При масштабировании */}
      <div className="glass rounded-2xl p-8 text-center">
        <div className="text-sm text-slate-400 mb-2">При 100 студентах в год</div>
        <div className="text-5xl font-bold text-emerald-400 mb-2">1500-2000</div>
        <div className="text-xl text-slate-300">человеко-часов</div>
        <div className="mt-4 text-sm text-slate-500">
          Плюс стандартизация качества документации
        </div>
      </div>
    </div>
    
    {/* Ключевой принцип */}
    <div className="mt-8 glass rounded-2xl p-6 border border-emerald-500/20">
      <div className="flex items-center gap-4">
        <Lightbulb className="text-yellow-400 flex-shrink-0" size={32} />
        <div>
          <div className="font-semibold mb-1">Ключевой принцип</div>
          <p className="text-slate-400">
            ИИ создаёт инструмент один раз → инструмент верифицируется → 
            дальше он работает детерминированно, без вызовов LLM, без оплаты токенов, 
            без риска «галлюцинаций». Одна инвестиция — бесконечное использование.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
```

### 6. Переиспользование

```jsx
<section className="py-16">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-2xl font-bold mb-8 text-center">Где ещё применимы эти инструменты?</h2>
    
    <div className="grid md:grid-cols-3 gap-6">
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-emerald-400 mb-3">Калькулятор кинематики</h3>
        <ul className="text-sm text-slate-400 space-y-2">
          <li>• Электромобили и электрокары</li>
          <li>• Промышленные манипуляторы</li>
          <li>• Конвейерные системы</li>
          <li>• Любой привод с редуктором</li>
        </ul>
      </div>
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-blue-400 mb-3">Changelog итераций</h3>
        <ul className="text-sm text-slate-400 space-y-2">
          <li>• Любое итеративное проектирование</li>
          <li>• Разработка электроники</li>
          <li>• Тестирование ПО</li>
          <li>• Оптимизация процессов</li>
        </ul>
      </div>
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-amber-400 mb-3">Матрица выбора</h3>
        <ul className="text-sm text-slate-400 space-y-2">
          <li>• Выбор материалов</li>
          <li>• Сравнение поставщиков</li>
          <li>• Оценка технологий</li>
          <li>• Любое инженерное решение</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

### 7. CTA — связь с лабораторией

```jsx
<section className="py-16">
  <div className="max-w-4xl mx-auto px-6 text-center">
    <h2 className="text-2xl font-bold mb-4">Хотите применить подобные инструменты?</h2>
    <p className="text-slate-400 mb-8">
      Лаборатория Робототехники работает в связке с ИИ-лабораторией, 
      которая создаёт детерминированные модули для ускорения инженерных задач.
    </p>
    <div className="flex justify-center gap-4">
      <Link to="/labs/ai" className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors">
        Лаборатория ИИ →
      </Link>
      <Link to="/labs/robotics" className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors">
        ← Назад к Робототехнике
      </Link>
    </div>
  </div>
</section>
```

---

## Роутинг

Добавить в `App.jsx`:

```jsx
import RoboticsCaseVKR from './pages/labs/cases/RoboticsCaseVKR'

// В Routes:
<Route path="/labs/robotics/case-vkr" element={<RoboticsCaseVKR />} />
```

## Ссылка со страницы Робототехники

На странице `src/pages/labs/RoboticsLab.jsx` добавить блок:

```jsx
<section className="py-16 bg-slate-900/50">
  <div className="max-w-6xl mx-auto px-6">
    <div className="glass rounded-2xl p-8 border border-purple-500/20">
      <div className="flex items-center gap-4 mb-4">
        <FileText className="text-purple-400" size={24} />
        <h2 className="text-xl font-bold">Реальный пример применения</h2>
      </div>
      <p className="text-slate-400 mb-4">
        Смотрите, как ИИ-инструменты могли бы ускорить разработку боевого робота 
        в 5-10 раз на примере реальной ВКР студента Политеха.
      </p>
      <Link 
        to="/labs/robotics/case-vkr" 
        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
      >
        Смотреть кейс <ArrowRight size={16} />
      </Link>
    </div>
  </div>
</section>
```

---

## Импорты для страницы кейса

```jsx
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, ArrowRight, CheckCircle, Clock, Calculator, 
  RefreshCw, Table, GitBranch, LayoutGrid, Lightbulb, FileText 
} from 'lucide-react'
```

---

## Проверка

```bash
npm run dev
```

1. Открыть `/labs/robotics`
2. Найти блок "Реальный пример применения"
3. Перейти по ссылке на `/labs/robotics/case-vkr`
4. Проверить все секции страницы
5. Проверить навигацию назад

## Коммит

```bash
git add -A
git commit -m "feat(cases): add VKR case study for Robotics Lab"
git push
```

---

*Работать автономно. Создать страницу кейса, добавить роутинг, добавить ссылку на странице Робототехники.*
