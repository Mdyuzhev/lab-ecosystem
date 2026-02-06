import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Tv, Camera, Home, KeyRound, Layers,
  Target, Rocket, TrendingUp, CheckCircle, ChevronRight,
  Brain, Eye, Shield, Zap, AlertTriangle, BarChart3,
  Users, Lightbulb, Wifi, ThermometerSun, Bell,
  Lock, Fingerprint, Video, MonitorSmartphone, Bot,
  Activity, Timer, UserCheck, Package, Gauge,
  MessageSquare, ShieldCheck, Cog, Globe, Puzzle
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

const winkHypotheses = [
  { icon: Activity, title: 'Предиктивный антиотток', desc: 'Агент анализирует паттерны просмотров — снижение частоты, сужение жанров, пропуск рекомендаций — и выявляет пользователей с высокой вероятностью отмены подписки за 7-14 дней до события. Триггерит персональную акцию удержания: скидку, бесплатный месяц премиум-контента или подборку по забытому интересу.' },
  { icon: Brain, title: 'Рекомендации по контексту', desc: 'Вместо стандартных жанровых подборок — рекомендации с учётом времени суток, дня недели, устройства и паттернов досмотра. Вечер пятницы → лёгкие комедии и сериалы. Утро выходного → документалки. Телевизор → семейный контент, телефон → короткий формат. Гипотеза: +15-20% к CTR рекомендаций.' },
  { icon: Gauge, title: 'Проактивный мониторинг качества стрима', desc: 'Агент детектит проблемы воспроизведения до жалобы: буферизация, артефакты кодека, рассинхрон звука, падение битрейта. Автоматически переключает CDN-ноду или качество, логирует инцидент. Метрика: снижение обращений в ТП по качеству видео на 30-40%.' },
  { icon: MonitorSmartphone, title: 'A/B-тестирование визуального мерчендайзинга', desc: 'Автогенерация вариантов обложек и описаний контента с замером CTR на сегментах аудитории. Агент создаёт 3-5 вариантов превью для каждого тайтла, распределяет по когортам и через 48 часов определяет победителя. Потенциал: +10-25% кликов на промо-контент.' },
  { icon: UserCheck, title: 'Реактивация «спящих» подписок', desc: 'Детекция аккаунтов, которые платят, но не смотрят контент более 30 дней. Агент формирует персональную push-кампанию с подборкой нового контента по историческим предпочтениям. Альтернатива — проактивное предложение паузы подписки для повышения лояльности.' },
  { icon: ShieldCheck, title: 'Автомодерация пользовательского контента', desc: 'Фильтрация спама, ботовых отзывов и манипуляций рейтингами в пользовательских оценках. CV-модель проверяет загружаемые аватары и скриншоты. NLP-анализ выявляет токсичные комментарии и накрутку. Снижение ручной модерации на 80%.' },
  { icon: MessageSquare, title: 'Умные субтитры и аудиодескрипция', desc: 'Автогенерация субтитров для контента без них, включая описание звуковых эффектов и музыки для слабослышащих. Расширение аудитории на пользователей с ограниченными возможностями и иностранцев. Дополнительно — автоперевод субтитров для мультиязычного контента.' },
]

const cctvHypotheses = [
  { icon: Eye, title: 'Детекция нетипичных событий', desc: 'CV-модель распознаёт аномалии на камере — оставленный предмет, скопление людей, падение человека, проникновение в запретную зону. Пороги адаптируются под конкретную локацию: что нормально для ТЦ — аномалия для подъезда. Снижение ложных срабатываний на 60% по сравнению с простым motion detection.' },
  { icon: Cog, title: 'Автодиагностика качества камеры', desc: 'Агент непрерывно оценивает качество картинки: загрязнение объектива, сбитый фокус, засветка, сдвиг угла обзора. При деградации — автоматический алерт на обслуживающую организацию с фотофиксацией проблемы и приоритетом. Сокращение времени обнаружения неисправности с дней до минут.' },
  { icon: Zap, title: 'Адаптивная компрессия видеопотока', desc: 'Интеллектуальное сжатие на основе анализа сцены: статичные зоны (стены, небо) сжимаются агрессивнее, зоны интереса (входы, проходы) сохраняют качество. Экономия трафика и хранилища до 40% без потери информативности на критических участках.' },
  { icon: Shield, title: 'Детекция саботажа и вандализма', desc: 'Мгновенный алерт при перекрытии камеры, повороте, расфокусировке, заливке краской или физическом повреждении. Агент отличает умышленное воздействие от природных факторов (дождь, паутина, снег). Время реакции — менее 30 секунд от события до уведомления.' },
  { icon: BarChart3, title: 'Аналитика проходимости', desc: 'Для коммерческих клиентов — подсчёт посетителей, тепловые карты перемещений, определение пиковых часов и зон скопления. Данные агрегируются в дашборд с трендами по дням и неделям. Продаётся как дополнительный аналитический сервис поверх базового видеонаблюдения.' },
  { icon: Timer, title: 'Предиктивное обслуживание оборудования', desc: 'По телеметрии камер (температура, uptime, частота перезагрузок, деградация битрейта) предсказать выход из строя за 3-7 дней. Плановая замена вместо аварийной — снижение простоев на 50%, оптимизация логистики выездных бригад.' },
  { icon: Video, title: 'Автоматический таймлапс', desc: 'Для строительных площадок и долгосрочных проектов — автоформирование таймлапс-видео за день, неделю, месяц. Агент выбирает оптимальные кадры (без ночи, дождя, пустых периодов) и монтирует ролик с наложением даты. Продаётся как premium-сервис для застройщиков.' },
]

const smartHomeHypotheses = [
  { icon: Lightbulb, title: 'Автосценарии по поведению', desc: 'Агент наблюдает паттерны использования устройств — свет выключается в 23:00, кондиционер включается при 25°, шторы закрываются на закате — и предлагает готовые сценарии автоматизации. Пользователь подтверждает одним нажатием. Снижение порога входа в автоматизацию: не нужно программировать, достаточно жить как обычно.' },
  { icon: AlertTriangle, title: 'Детекция аномалий потребления', desc: 'Резкий рост расхода электричества или воды — агент алертит «возможна утечка или поломка прибора». Анализирует базовый профиль потребления квартиры и выявляет отклонения от нормы. Потенциал: предотвращение аварий (затопление, короткое замыкание) и экономия на коммунальных платежах.' },
  { icon: ThermometerSun, title: 'Предиктивный климат-контроль', desc: 'Адаптация отопления и кондиционирования на основе прогноза погоды, расписания присутствия жильцов и теплоинерции помещения. Агент начинает прогревать квартиру за 30 минут до прихода, а не по факту. Экономия энергии 15-25% при сохранении комфортной температуры.' },
  { icon: Wifi, title: 'Детекция присутствия без датчиков', desc: 'Определение, дома ли кто-то, по косвенным данным: активные WiFi-устройства, паттерны энергопотребления, включение света и воды. Не требует установки дополнительных датчиков движения. Используется для автоматизации: уход всех → режим безопасности, приход → комфортный режим.' },
  { icon: Lock, title: 'Симуляция присутствия', desc: 'При длительном отсутствии жильцов агент воспроизводит типичные паттерны — включает свет в разных комнатах, открывает/закрывает шторы, имитирует активность ТВ по графику, соответствующему реальному поведению семьи. Защита от «наводчиков», наблюдающих за пустующими квартирами.' },
  { icon: Puzzle, title: 'Автоинтеграция новых устройств', desc: 'При подключении нового устройства агент определяет его тип, предлагает подходящие сценарии из библиотеки, проверяет совместимость с существующей экосистемой и настраивает базовую автоматизацию. Сокращение времени настройки нового устройства с 30 минут до 2 минут.' },
  { icon: Bell, title: 'Интеллектуальные уведомления', desc: 'Вместо потока алертов «дверь открыта», «движение на камере» — агрегированные умные уведомления с контекстом. «Ваш ребёнок пришёл из школы в 14:30» вместо «входная дверь открыта + движение в коридоре + камера детектировала человека». Снижение notification fatigue на 70%.' },
]

const keyHypotheses = [
  { icon: Users, title: 'Детекция tailgating', desc: 'Распознавание ситуации, когда по одному открытию двери проходят несколько человек. CV-модель на камере домофона считает количество прошедших и сопоставляет с числом авторизаций. Алерт на подозрительные проходы для повышения безопасности жилых комплексов.' },
  { icon: Fingerprint, title: 'Аналитика аномальных проходов', desc: 'Выявление нетипичных паттернов: ночные визиты в нежилые зоны, аномальная частота проходов, использование ключа в нескольких подъездах за короткий период. Формирование профиля нормального поведения резидента и мягкий алерт при отклонениях для службы безопасности.' },
  { icon: MessageSquare, title: 'Гостевые пропуска через чат-бот', desc: 'Жилец создаёт временный пропуск в мессенджере: «курьер приедет с 14 до 15, пусти его в подъезд». Бот генерирует одноразовый код или QR с ограничением по времени и количеству проходов. Интеграция с домофонией — дверь открывается по предъявлению кода на экране.' },
  { icon: Camera, title: 'Связка с видеонаблюдением', desc: 'При каждом открытии двери — автоматический скриншот с камеры домофона, привязанный к событию прохода. Формируется визуальный лог: кто, когда, как выглядел. Доступ к логу через приложение жильца для собственного подъезда. Дополнительная ценность для УК и служб безопасности.' },
  { icon: Cog, title: 'Предиктивная диагностика оборудования', desc: 'Детекция неисправности замка или домофона по паттернам отказов: 3+ неудачных попытки открытия подряд, рост времени срабатывания, нетипичные звуковые сигналы. Автоматическая заявка в УК с диагностикой «вероятная причина: износ механизма замка, рекомендуется замена».' },
  { icon: Bell, title: 'Режим «тихий час»', desc: 'Автоматическое отключение звукового сигнала домофона по расписанию или по контексту (ночь + ребёнок спит). Звонки переводятся в push-уведомления на телефон с видео от камеры. Гость видит на экране домофона «жилец уведомлён, ожидайте». Повышение комфорта без снижения безопасности.' },
  { icon: TrendingUp, title: 'Аналитика для управляющих компаний', desc: 'Дашборд для УК: процент жильцов с электронными ключами, пиковые нагрузки на домофонию, частота отказов оборудования по подъездам, рейтинг удовлетворённости. Выявление подъездов с низким проникновением цифровых ключей — потенциал для онбординг-кампаний.' },
]

const crossProductHypotheses = [
  { icon: Globe, title: 'Единый профиль «цифрового дома»', desc: 'Объединение данных Wink + Умный дом + Видеонаблюдение + Ключ в единый контекст. Сценарий «ушёл из дома»: ТВ выключается, камеры переходят в режим записи, активируется сценарий безопасности, симуляция присутствия включается через 2 часа. Один триггер — согласованная реакция всех продуктов.' },
  { icon: Activity, title: 'Предиктивный NPS', desc: 'Агент прогнозирует удовлетворённость клиента по совокупности сигналов: частота обращений в ТП, качество стрима в Wink, стабильность IoT-устройств, количество проблем с доступом. Клиенты с падающим «скрытым NPS» получают проактивную поддержку до того, как подадут на отключение.' },
  { icon: Package, title: 'Интеллектуальный upsell', desc: 'Персональные предложения на основе паттернов использования: пользуется видеонаблюдением, но нет умного дома → предложение с прогнозом экономии на электричестве. Смотрит Wink на телефоне, но не на ТВ → предложение приставки. Конверсия предсказательного upsell на 40-60% выше массовых рассылок.' },
  { icon: Bot, title: 'Единый AI-консьерж', desc: 'Один чат-бот/голосовой помощник для всех продуктов, знающий полный контекст подключённых сервисов. «Почему камера не показывает?» → агент проверяет сеть, устройство, облако и даёт конкретную инструкцию. «Включи фильм» → управляет Wink. «Пусти курьера» → генерит гостевой код Ключа.' },
  { icon: Shield, title: 'Кросс-продуктовый антифрод', desc: 'Детекция аномального поведения аккаунта по совокупности продуктов: массовая раздача гостевых ключей, подозрительные паттерны входа, шаринг подписки Wink на множество устройств, нетипичная география подключений. Единая модель фрода эффективнее изолированных проверок в каждом продукте.' },
  { icon: MessageSquare, title: 'Автодиагностика «от симптома к решению»', desc: 'Пользователь описывает проблему обычным языком — агент определяет затронутый продукт, проверяет все слои (сеть, устройство, облако, аккаунт) и выдаёт пошаговую инструкцию решения. Сокращение нагрузки на контакт-центр на 25-35% по типовым обращениям.' },
]

function HypothesisGrid({ items }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {items.map((item, i) => (
        <motion.div key={i} {...stagger(i)} className="glass rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <item.icon className="text-cyan-400" size={20} />
            </div>
            <div>
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default function SoftwareProductDev() {
  return (
    <div className="min-h-screen bg-slate-950">

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/labs/software" className="hover:text-white transition-colors">Лаборатория ПО</Link>
            <span>/</span>
            <span className="text-cyan-400">Развитие продуктов</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <Rocket className="text-cyan-400" size={14} />
            <span className="text-cyan-400 text-sm font-medium">Гипотезы &rarr; Эксперименты &rarr; Внедрение</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Развитие существующих <span className="text-cyan-400">продуктов</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mb-8">
            Реестр гипотез по улучшению ключевых продуктов Ростелекома — Wink, Видеонаблюдение,
            Умный дом, Ключ. Каждая гипотеза предлагает конкретное применение AI, компьютерного
            зрения или аналитики данных для повышения метрик продукта: удержание, конверсия, ARPU,
            снижение оттока и нагрузки на поддержку.
          </p>

          <div className="flex flex-wrap gap-6">
            <div className="glass rounded-xl px-6 py-4 text-center">
              <div className="text-3xl font-bold text-cyan-400">4</div>
              <div className="text-sm text-slate-400">продукта</div>
            </div>
            <div className="glass rounded-xl px-6 py-4 text-center">
              <div className="text-3xl font-bold text-cyan-400">40+</div>
              <div className="text-sm text-slate-400">гипотез</div>
            </div>
            <div className="glass rounded-xl px-6 py-4 text-center">
              <div className="text-3xl font-bold text-cyan-400">6</div>
              <div className="text-sm text-slate-400">направлений AI/CV</div>
            </div>
            <div className="glass rounded-xl px-6 py-4 text-center">
              <div className="text-3xl font-bold text-cyan-400">&infin;</div>
              <div className="text-sm text-slate-400">потенциал масштабирования</div>
            </div>
          </div>
        </div>
      </section>

      {/* Подход */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-8">
              <Target className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold">Подход: от гипотезы к метрике</h2>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                { step: '1', title: 'Гипотеза', desc: 'Формулируем ЕСЛИ → ТО → ПОТОМУ ЧТО с конкретной метрикой' },
                { step: '2', title: 'Прототип', desc: 'Минимальный эксперимент на ограниченной выборке (1 регион, 1000 пользователей)' },
                { step: '3', title: 'Замер', desc: 'A/B-тест, сравнение до/после, статистическая значимость' },
                { step: '4', title: 'Масштабирование', desc: 'Подтверждённая гипотеза → продуктовый бэклог, раскатка на всю базу' },
              ].map((item, i) => (
                <motion.div key={item.step} {...stagger(i)} className="glass rounded-xl p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wink */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-8">
              <Tv className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold">Wink</h2>
              <span className="text-sm text-slate-500">7 гипотез</span>
            </div>
            <HypothesisGrid items={winkHypotheses} />
          </motion.div>
        </div>
      </section>

      {/* Видеонаблюдение */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-8">
              <Camera className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold">Видеонаблюдение</h2>
              <span className="text-sm text-slate-500">7 гипотез</span>
            </div>
            <HypothesisGrid items={cctvHypotheses} />
          </motion.div>
        </div>
      </section>

      {/* Умный дом */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-8">
              <Home className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold">Умный дом</h2>
              <span className="text-sm text-slate-500">7 гипотез</span>
            </div>
            <HypothesisGrid items={smartHomeHypotheses} />
          </motion.div>
        </div>
      </section>

      {/* Ключ */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-8">
              <KeyRound className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold">Ключ</h2>
              <span className="text-sm text-slate-500">7 гипотез</span>
            </div>
            <HypothesisGrid items={keyHypotheses} />
          </motion.div>
        </div>
      </section>

      {/* Кросс-продуктовые гипотезы */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-8">
              <Layers className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold">Кросс-продуктовые гипотезы</h2>
              <span className="text-sm text-slate-500">6 гипотез</span>
            </div>

            <div className="glass rounded-2xl p-8 border border-cyan-500/20">
              <div className="grid md:grid-cols-2 gap-6">
                {crossProductHypotheses.map((item, i) => (
                  <motion.div key={i} {...stagger(i)} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-cyan-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{item.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Итого */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '40+', label: 'гипотез в реестре', colorClass: 'text-cyan-400' },
              { value: '4', label: 'продуктовых направления', colorClass: 'text-blue-400' },
              { value: '6', label: 'кросс-продуктовых связок', colorClass: 'text-purple-400' },
              { value: '\u221E', label: 'комбинаций для A/B-тестов', colorClass: 'text-amber-400' },
            ].map((m, i) => (
              <motion.div key={m.label} {...stagger(i)} className="glass rounded-xl p-4 text-center">
                <div className={`text-3xl font-bold ${m.colorClass}`}>{m.value}</div>
                <div className="text-sm text-slate-400 mt-1">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Оцените приоритеты</h2>
          <p className="text-slate-400 mb-8">
            Каждая гипотеза — это потенциальный эксперимент. Impact Calculator поможет оценить
            приоритеты и потенциальную экономию.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/tools/impact-calculator"
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 transition-colors font-medium flex items-center gap-2"
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
