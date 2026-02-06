/**
 * Нормализация телефона -> 79XXXXXXXXX (только цифры)
 */
export function normalizePhone(phone) {
  if (!phone) return null
  const digits = String(phone).replace(/\D/g, '')
  if (digits.length === 11 && digits[0] === '8') return '7' + digits.slice(1)
  if (digits.length === 11 && digits[0] === '7') return digits
  if (digits.length === 10) return '7' + digits
  return digits || null
}

/**
 * Нормализация ИНН -> строка фиксированной длины (10 или 12)
 */
export function normalizeInn(inn) {
  if (!inn) return null
  const cleaned = String(inn).replace(/\D/g, '')
  if (!cleaned) return null
  if (cleaned.length <= 10) return cleaned.padStart(10, '0')
  return cleaned.padStart(12, '0')
}

/**
 * Нормализация названия компании -> lowercase без кавычек и лишних пробелов
 */
export function normalizeCompanyName(name) {
  if (!name) return null
  let n = name.toLowerCase().replace(/["«»'']/g, '').replace(/,\s*/g, ' ').replace(/\s+/g, ' ').trim()
  // "ромашка ооо" -> "ооо ромашка"
  n = n.replace(/^(.+?)\s+(ооо|оао|зао|пао|ип|ао)\s*$/, '$2 $1')
  return n
}
