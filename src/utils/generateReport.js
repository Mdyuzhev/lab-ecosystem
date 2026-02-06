import jsPDF from 'jspdf'
import { PTSans_Regular_base64 } from '../assets/fonts/PTSans-Regular.js'
import { PTSans_Bold_base64 } from '../assets/fonts/PTSans-Bold.js'

export function generateReport(inputs, results, canvasImage) {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = 210
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // --- Регистрация кириллического шрифта ---
  doc.addFileToVFS('PTSans-Regular.ttf', PTSans_Regular_base64)
  doc.addFont('PTSans-Regular.ttf', 'PTSans', 'normal')
  doc.addFileToVFS('PTSans-Bold.ttf', PTSans_Bold_base64)
  doc.addFont('PTSans-Bold.ttf', 'PTSans', 'bold')
  doc.setFont('PTSans', 'normal')

  // --- Вспомогательные ---

  function setNormal(size = 10) {
    doc.setFont('PTSans', 'normal')
    doc.setFontSize(size)
    doc.setTextColor(0, 0, 0)
  }

  function setBold(size = 10) {
    doc.setFont('PTSans', 'bold')
    doc.setFontSize(size)
    doc.setTextColor(0, 0, 0)
  }

  function addTitle(text) {
    setBold(18)
    doc.text(text, pageWidth / 2, y, { align: 'center' })
    y += 10
  }

  function addSectionHeader(text) {
    checkPageBreak(15)
    setBold(13)
    doc.setTextColor(16, 185, 129)
    doc.text(text, margin, y)
    y += 2
    doc.setDrawColor(16, 185, 129)
    doc.setLineWidth(0.5)
    doc.line(margin, y, margin + contentWidth, y)
    y += 8
    doc.setTextColor(0, 0, 0)
  }

  function addKeyValue(key, value, unit = '') {
    checkPageBreak(8)
    setNormal(10)
    doc.setTextColor(100, 100, 100)
    doc.text(key, margin, y)
    setBold(10)
    const valueText = unit ? `${value} ${unit}` : `${value}`
    doc.text(valueText, margin + 95, y)
    y += 7
  }

  function addTable(headers, rows) {
    checkPageBreak(10 + rows.length * 7)
    const colWidths = headers.map((_, i) => {
      if (i === 0) return contentWidth * 0.5
      if (i === 1) return contentWidth * 0.3
      return contentWidth * 0.2
    })

    doc.setFillColor(241, 245, 249)
    doc.rect(margin, y - 4, contentWidth, 8, 'F')
    setBold(9)
    doc.setTextColor(71, 85, 105)
    let xOffset = margin + 2
    headers.forEach((h, i) => {
      doc.text(h, xOffset, y)
      xOffset += colWidths[i]
    })
    y += 8

    setNormal(9)
    rows.forEach((row, rowIdx) => {
      checkPageBreak(8)
      if (rowIdx % 2 === 0) {
        doc.setFillColor(248, 250, 252)
        doc.rect(margin, y - 4, contentWidth, 7, 'F')
      }
      xOffset = margin + 2
      row.forEach((cell, i) => {
        doc.text(String(cell), xOffset, y)
        xOffset += colWidths[i]
      })
      y += 7
    })
    y += 4
  }

  function addFormula(formulaText, description) {
    checkPageBreak(18)
    doc.setFillColor(245, 245, 250)
    doc.roundedRect(margin, y - 4, contentWidth, 12, 2, 2, 'F')
    setBold(11)
    doc.setTextColor(50, 50, 80)
    doc.text(formulaText, margin + 6, y + 3)
    y += 14
    if (description) {
      setNormal(8)
      doc.setTextColor(120, 120, 120)
      doc.text(description, margin + 6, y)
      y += 6
    }
  }

  function addDivider() {
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.2)
    doc.line(margin, y, margin + contentWidth, y)
    y += 6
  }

  function checkPageBreak(needed) {
    if (y + needed > 280) {
      doc.addPage()
      y = margin
    }
  }

  // === ШАПКА ===

  setNormal(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Lab Ecosystem \u2014 \u041a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440 \u0443\u0434\u0430\u0440\u043d\u044b\u0445 \u043d\u0430\u0433\u0440\u0443\u0437\u043e\u043a', pageWidth / 2, y, { align: 'center' })
  y += 8

  addTitle('\u041e\u0442\u0447\u0451\u0442 \u043f\u043e \u0440\u0430\u0441\u0447\u0451\u0442\u0443 \u0443\u0434\u0430\u0440\u043d\u043e\u0433\u043e \u043d\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u0438\u044f')

  setNormal(9)
  doc.setTextColor(150, 150, 150)
  const now = new Date()
  doc.text(
    `\u0414\u0430\u0442\u0430: ${now.toLocaleDateString('ru-RU')} ${now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`,
    pageWidth / 2, y, { align: 'center' }
  )
  y += 12

  // === ВХОДНЫЕ ДАННЫЕ ===

  addSectionHeader('\u0412\u0445\u043e\u0434\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435')

  const elementNames = {
    'beam-cantilever': '\u041a\u043e\u043d\u0441\u043e\u043b\u044c\u043d\u0430\u044f \u0431\u0430\u043b\u043a\u0430',
    'beam-supported': '\u0411\u0430\u043b\u043a\u0430 \u043d\u0430 \u0434\u0432\u0443\u0445 \u043e\u043f\u043e\u0440\u0430\u0445',
    'plate': '\u041f\u043b\u0430\u0441\u0442\u0438\u043d\u0430 (\u0443\u043f\u0440\u043e\u0449\u0451\u043d\u043d\u0430\u044f \u043c\u043e\u0434\u0435\u043b\u044c)',
    'rod': '\u0421\u0442\u0435\u0440\u0436\u0435\u043d\u044c (\u0443\u043f\u0440\u043e\u0449\u0451\u043d\u043d\u0430\u044f \u043c\u043e\u0434\u0435\u043b\u044c)',
  }
  addKeyValue('\u0422\u0438\u043f \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u0430', elementNames[inputs.elementType] || inputs.elementType)

  const sectionNames = { rectangular: '\u041f\u0440\u044f\u043c\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u043e\u0435', circular: '\u041a\u0440\u0443\u0433\u043b\u043e\u0435', tube: '\u0422\u0440\u0443\u0431\u043d\u043e\u0435' }
  addKeyValue('\u0422\u0438\u043f \u0441\u0435\u0447\u0435\u043d\u0438\u044f', sectionNames[inputs.sectionType] || inputs.sectionType)
  addKeyValue('\u0414\u043b\u0438\u043d\u0430 (L)', inputs.length, '\u043c\u043c')

  if (inputs.sectionType === 'rectangular') {
    addKeyValue('\u0428\u0438\u0440\u0438\u043d\u0430 (b)', inputs.width, '\u043c\u043c')
    addKeyValue('\u0412\u044b\u0441\u043e\u0442\u0430 (h)', inputs.height, '\u043c\u043c')
  } else if (inputs.sectionType === 'circular') {
    addKeyValue('\u0414\u0438\u0430\u043c\u0435\u0442\u0440 (d)', inputs.diameter, '\u043c\u043c')
  } else if (inputs.sectionType === 'tube') {
    addKeyValue('\u0412\u043d\u0435\u0448\u043d\u0438\u0439 \u0434\u0438\u0430\u043c\u0435\u0442\u0440 (D)', inputs.outerDiameter, '\u043c\u043c')
    addKeyValue('\u0412\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0438\u0439 \u0434\u0438\u0430\u043c\u0435\u0442\u0440 (d)', inputs.innerDiameter, '\u043c\u043c')
  }

  y += 3

  const materialNames = {
    'steel-45': '\u0421\u0442\u0430\u043b\u044c 45',
    'steel-3': '\u0421\u0442\u0430\u043b\u044c 3',
    'aluminum-d16': '\u041416 (\u0434\u044e\u0440\u0430\u043b\u044c)',
    'titanium-vt6': '\u04126 (\u0442\u0438\u0442\u0430\u043d)',
    'custom': '\u0421\u0432\u043e\u0439 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b',
  }
  addKeyValue('\u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b', materialNames[inputs.material] || inputs.material)
  addKeyValue('\u041c\u043e\u0434\u0443\u043b\u044c \u042e\u043d\u0433\u0430 (E)', inputs.youngModulus, '\u0413\u041f\u0430')
  addKeyValue('\u041f\u0440\u0435\u0434\u0435\u043b \u0442\u0435\u043a\u0443\u0447\u0435\u0441\u0442\u0438 (\u03C3\u0442)', inputs.yieldStrength, '\u041c\u041f\u0430')
  addKeyValue('\u041f\u0440\u0435\u0434\u0435\u043b \u043f\u0440\u043e\u0447\u043d\u043e\u0441\u0442\u0438 (\u03C3\u0432)', inputs.ultimateStrength, '\u041c\u041f\u0430')

  y += 3

  if (inputs.impactType === 'energy') {
    addKeyValue('\u0421\u043f\u043e\u0441\u043e\u0431 \u0437\u0430\u0434\u0430\u043d\u0438\u044f \u0443\u0434\u0430\u0440\u0430', '\u042d\u043d\u0435\u0440\u0433\u0438\u044f')
    addKeyValue('\u042d\u043d\u0435\u0440\u0433\u0438\u044f \u0443\u0434\u0430\u0440\u0430 (W)', inputs.impactEnergy, '\u0414\u0436')
  } else {
    addKeyValue('\u0421\u043f\u043e\u0441\u043e\u0431 \u0437\u0430\u0434\u0430\u043d\u0438\u044f \u0443\u0434\u0430\u0440\u0430', '\u041c\u0430\u0441\u0441\u0430 + \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u044c')
    addKeyValue('\u041c\u0430\u0441\u0441\u0430 \u0443\u0434\u0430\u0440\u043d\u0438\u043a\u0430 (m)', inputs.impactMass, '\u043a\u0433')
    addKeyValue('\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c \u0443\u0434\u0430\u0440\u0430 (v)', inputs.impactVelocity, '\u043c/\u0441')
  }

  // === МЕТОДИКА РАСЧЁТА ===

  addDivider()
  addSectionHeader('\u041c\u0435\u0442\u043e\u0434\u0438\u043a\u0430 \u0440\u0430\u0441\u0447\u0451\u0442\u0430')

  setNormal(10)
  doc.text('\u0420\u0430\u0441\u0447\u0451\u0442 \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d \u044d\u043d\u0435\u0440\u0433\u0435\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u043c \u043c\u0435\u0442\u043e\u0434\u043e\u043c \u0442\u0435\u043e\u0440\u0438\u0438 \u0443\u0434\u0430\u0440\u0430 \u043f\u043e \u0431\u0430\u043b\u043a\u0435.', margin, y)
  y += 8

  // 1. Момент инерции
  setBold(10)
  doc.text('1. \u041c\u043e\u043c\u0435\u043d\u0442 \u0438\u043d\u0435\u0440\u0446\u0438\u0438 \u0441\u0435\u0447\u0435\u043d\u0438\u044f (I)', margin, y)
  y += 7

  if (inputs.sectionType === 'rectangular') {
    addFormula('I = b \u00B7 h\u00B3 / 12', 'b \u2014 \u0448\u0438\u0440\u0438\u043d\u0430, h \u2014 \u0432\u044b\u0441\u043e\u0442\u0430 \u043f\u0440\u044f\u043c\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u043e\u0433\u043e \u0441\u0435\u0447\u0435\u043d\u0438\u044f')
  } else if (inputs.sectionType === 'circular') {
    addFormula('I = \u03C0 \u00B7 d\u2074 / 64', 'd \u2014 \u0434\u0438\u0430\u043c\u0435\u0442\u0440 \u043a\u0440\u0443\u0433\u043b\u043e\u0433\u043e \u0441\u0435\u0447\u0435\u043d\u0438\u044f')
  } else {
    addFormula('I = \u03C0 \u00B7 (D\u2074 \u2212 d\u2074) / 64', 'D \u2014 \u0432\u043d\u0435\u0448\u043d\u0438\u0439 \u0434\u0438\u0430\u043c\u0435\u0442\u0440, d \u2014 \u0432\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0438\u0439 \u0434\u0438\u0430\u043c\u0435\u0442\u0440 \u0442\u0440\u0443\u0431\u044b')
  }

  // 2. Момент сопротивления
  setBold(10)
  doc.text('2. \u041c\u043e\u043c\u0435\u043d\u0442 \u0441\u043e\u043f\u0440\u043e\u0442\u0438\u0432\u043b\u0435\u043d\u0438\u044f (W)', margin, y)
  y += 7
  addFormula('W = I / y_max', 'y_max \u2014 \u0440\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u043e\u0442 \u043d\u0435\u0439\u0442\u0440\u0430\u043b\u044c\u043d\u043e\u0439 \u043e\u0441\u0438 \u0434\u043e \u043d\u0430\u0438\u0431\u043e\u043b\u0435\u0435 \u0443\u0434\u0430\u043b\u0451\u043d\u043d\u043e\u0433\u043e \u0432\u043e\u043b\u043e\u043a\u043d\u0430')

  // 3. Энергия удара
  setBold(10)
  doc.text('3. \u042d\u043d\u0435\u0440\u0433\u0438\u044f \u0443\u0434\u0430\u0440\u0430', margin, y)
  y += 7

  if (inputs.impactType === 'energy') {
    addFormula('W_\u0443\u0434 = ' + inputs.impactEnergy + ' \u0414\u0436 (\u0437\u0430\u0434\u0430\u043d\u0430 \u043d\u0430\u043f\u0440\u044f\u043c\u0443\u044e)', null)
  } else {
    addFormula('W_\u0443\u0434 = m \u00B7 v\u00B2 / 2', 'm \u2014 \u043c\u0430\u0441\u0441\u0430 \u0443\u0434\u0430\u0440\u043d\u0438\u043a\u0430, v \u2014 \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u044c \u0432 \u043c\u043e\u043c\u0435\u043d\u0442 \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u0430')
  }

  // 4. Жёсткость
  setBold(10)
  doc.text('4. \u0421\u0442\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0436\u0451\u0441\u0442\u043a\u043e\u0441\u0442\u044c (k)', margin, y)
  y += 7

  if (inputs.elementType === 'beam-cantilever' || inputs.elementType === 'plate' || inputs.elementType === 'rod') {
    addFormula('k = 3 \u00B7 E \u00B7 I / L\u00B3', '\u041a\u043e\u043d\u0441\u043e\u043b\u044c\u043d\u0430\u044f \u0431\u0430\u043b\u043a\u0430: \u0441\u0438\u043b\u0430 \u043d\u0430 \u0441\u0432\u043e\u0431\u043e\u0434\u043d\u043e\u043c \u043a\u043e\u043d\u0446\u0435')
  } else {
    addFormula('k = 48 \u00B7 E \u00B7 I / L\u00B3', '\u0411\u0430\u043b\u043a\u0430 \u043d\u0430 \u0434\u0432\u0443\u0445 \u043e\u043f\u043e\u0440\u0430\u0445: \u0441\u0438\u043b\u0430 \u0432 \u0441\u0435\u0440\u0435\u0434\u0438\u043d\u0435 \u043f\u0440\u043e\u043b\u0451\u0442\u0430')
  }

  // 5. Прогиб
  setBold(10)
  doc.text('5. \u0414\u0438\u043d\u0430\u043c\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u043f\u0440\u043e\u0433\u0438\u0431 (\u03B4)', margin, y)
  y += 7
  addFormula('\u03B4 = \u221A(2 \u00B7 W_\u0443\u0434 / k)', '\u0418\u0437 \u044d\u043d\u0435\u0440\u0433\u0435\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0433\u043e \u0431\u0430\u043b\u0430\u043d\u0441\u0430: W_\u0443\u0434 = k \u00B7 \u03B4\u00B2 / 2')

  // 6. Динамическая сила
  setBold(10)
  doc.text('6. \u0414\u0438\u043d\u0430\u043c\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0441\u0438\u043b\u0430 (P_\u0434)', margin, y)
  y += 7
  addFormula('P_\u0434 = k \u00B7 \u03B4', '\u0421\u0438\u043b\u0430, \u044d\u043a\u0432\u0438\u0432\u0430\u043b\u0435\u043d\u0442\u043d\u0430\u044f \u0443\u0434\u0430\u0440\u043d\u043e\u043c\u0443 \u0432\u043e\u0437\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044e')

  // 7. Изгибающий момент
  setBold(10)
  doc.text('7. \u0418\u0437\u0433\u0438\u0431\u0430\u044e\u0449\u0438\u0439 \u043c\u043e\u043c\u0435\u043d\u0442 (M)', margin, y)
  y += 7

  if (inputs.elementType === 'beam-cantilever' || inputs.elementType === 'plate' || inputs.elementType === 'rod') {
    addFormula('M = P_\u0434 \u00B7 L', '\u041c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u044b\u0439 \u043c\u043e\u043c\u0435\u043d\u0442 \u0432 \u0437\u0430\u0434\u0435\u043b\u043a\u0435 \u043a\u043e\u043d\u0441\u043e\u043b\u044c\u043d\u043e\u0439 \u0431\u0430\u043b\u043a\u0438')
  } else {
    addFormula('M = P_\u0434 \u00B7 L / 4', '\u041c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u044b\u0439 \u043c\u043e\u043c\u0435\u043d\u0442 \u0432 \u0441\u0435\u0440\u0435\u0434\u0438\u043d\u0435 \u043f\u0440\u043e\u043b\u0451\u0442\u0430')
  }

  // 8. Напряжение
  setBold(10)
  doc.text('8. \u0414\u0438\u043d\u0430\u043c\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u043d\u0430\u043f\u0440\u044f\u0436\u0435\u043d\u0438\u0435 (\u03C3_\u0434)', margin, y)
  y += 7
  addFormula('\u03C3_\u0434 = M / W', '\u041c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u043e\u0435 \u043d\u043e\u0440\u043c\u0430\u043b\u044c\u043d\u043e\u0435 \u043d\u0430\u043f\u0440\u044f\u0436\u0435\u043d\u0438\u0435 \u043f\u0440\u0438 \u0438\u0437\u0433\u0438\u0431\u0435')

  // 9. Критерий оценки
  setBold(10)
  doc.text('9. \u041a\u0440\u0438\u0442\u0435\u0440\u0438\u0439 \u043e\u0446\u0435\u043d\u043a\u0438', margin, y)
  y += 7
  setNormal(9)
  doc.text('\u03C3_\u0434 < \u03C3\u0442  \u2192  \u0423\u043f\u0440\u0443\u0433\u0430\u044f \u0434\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f (\u043a\u043e\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u044f \u0432\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u0441\u044f)', margin + 6, y)
  y += 5
  doc.text('\u03C3\u0442 \u2264 \u03C3_\u0434 < \u03C3\u0432  \u2192  \u041f\u043b\u0430\u0441\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0434\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f (\u043e\u0441\u0442\u0430\u0442\u043e\u0447\u043d\u0430\u044f \u0434\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f)', margin + 6, y)
  y += 5
  doc.text('\u03C3_\u0434 \u2265 \u03C3\u0432  \u2192  \u0420\u0430\u0437\u0440\u0443\u0448\u0435\u043d\u0438\u0435', margin + 6, y)
  y += 8

  // 10. Коэффициенты запаса
  setBold(10)
  doc.text('10. \u041a\u043e\u044d\u0444\u0444\u0438\u0446\u0438\u0435\u043d\u0442\u044b \u0437\u0430\u043f\u0430\u0441\u0430', margin, y)
  y += 7
  addFormula('n_\u0442 = \u03C3\u0442 / \u03C3_\u0434       n_\u0432 = \u03C3\u0432 / \u03C3_\u0434', 'n_\u0442 \u2014 \u0437\u0430\u043f\u0430\u0441 \u043f\u043e \u0442\u0435\u043a\u0443\u0447\u0435\u0441\u0442\u0438, n_\u0432 \u2014 \u0437\u0430\u043f\u0430\u0441 \u043f\u043e \u043f\u0440\u043e\u0447\u043d\u043e\u0441\u0442\u0438. \u041f\u0440\u0438 n < 1 \u2014 \u043a\u043e\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u044f \u043d\u0435 \u0432\u044b\u0434\u0435\u0440\u0436\u0438\u0442')

  // === РЕЗУЛЬТАТЫ ===

  addDivider()
  addSectionHeader('\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u0440\u0430\u0441\u0447\u0451\u0442\u0430')

  const zoneColors = {
    emerald: [16, 185, 129],
    amber: [245, 158, 11],
    red: [239, 68, 68],
  }
  const zoneLabels = {
    emerald: '\u0423\u041f\u0420\u0423\u0413\u0410\u042f \u0414\u0415\u0424\u041e\u0420\u041c\u0410\u0426\u0418\u042f \u2014 \u043a\u043e\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u044f \u0432\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u0441\u044f',
    amber: '\u041f\u041b\u0410\u0421\u0422\u0418\u0427\u0415\u0421\u041a\u0410\u042f \u0414\u0415\u0424\u041e\u0420\u041c\u0410\u0426\u0418\u042f \u2014 \u043e\u0441\u0442\u0430\u0442\u043e\u0447\u043d\u0430\u044f \u0434\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f',
    red: '\u0420\u0410\u0417\u0420\u0423\u0428\u0415\u041d\u0418\u0415 \u2014 \u043a\u043e\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u044f \u043d\u0435 \u0432\u044b\u0434\u0435\u0440\u0436\u0438\u0442',
  }
  const zc = zoneColors[results.zoneColor] || zoneColors.emerald

  doc.setFillColor(zc[0], zc[1], zc[2])
  doc.roundedRect(margin, y - 4, contentWidth, 14, 3, 3, 'F')
  setBold(12)
  doc.setTextColor(255, 255, 255)
  doc.text(zoneLabels[results.zoneColor] || results.zone, pageWidth / 2, y + 5, { align: 'center' })
  y += 18
  doc.setTextColor(0, 0, 0)

  addTable(
    ['\u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440', '\u0417\u043d\u0430\u0447\u0435\u043d\u0438\u0435', '\u0415\u0434. \u0438\u0437\u043c.'],
    [
      ['\u042d\u043d\u0435\u0440\u0433\u0438\u044f \u0443\u0434\u0430\u0440\u0430 (W_\u0443\u0434)', results.impactEnergy.toFixed(1), '\u0414\u0436'],
      ['\u0414\u0438\u043d\u0430\u043c\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0441\u0438\u043b\u0430 (P_\u0434)', results.dynamicForce.toFixed(1), '\u041d'],
      ['\u0418\u0437\u0433\u0438\u0431\u0430\u044e\u0449\u0438\u0439 \u043c\u043e\u043c\u0435\u043d\u0442 (M)', results.bendingMoment.toFixed(2), '\u041d\u00B7\u043c'],
      ['\u0414\u0438\u043d\u0430\u043c\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u043d\u0430\u043f\u0440\u044f\u0436\u0435\u043d\u0438\u0435 (\u03C3_\u0434)', results.dynamicStress.toFixed(1), '\u041c\u041f\u0430'],
      ['\u041f\u0440\u0435\u0434\u0435\u043b \u0442\u0435\u043a\u0443\u0447\u0435\u0441\u0442\u0438 (\u03C3\u0442)', results.yieldStrength.toFixed(0), '\u041c\u041f\u0430'],
      ['\u041f\u0440\u0435\u0434\u0435\u043b \u043f\u0440\u043e\u0447\u043d\u043e\u0441\u0442\u0438 (\u03C3\u0432)', results.ultimateStrength.toFixed(0), '\u041c\u041f\u0430'],
      ['\u0414\u0438\u043d\u0430\u043c\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u043f\u0440\u043e\u0433\u0438\u0431 (\u03B4)', results.dynamicDeflection.toFixed(2), '\u043c\u043c'],
      ['\u041a\u043e\u044d\u0444\u0444. \u0434\u0438\u043d\u0430\u043c\u0438\u0447\u043d\u043e\u0441\u0442\u0438 (K_\u0434)', results.dynamicCoefficient.toFixed(2), '\u2014'],
      ['\u0417\u0430\u043f\u0430\u0441 \u043f\u043e \u0442\u0435\u043a\u0443\u0447\u0435\u0441\u0442\u0438 (n_\u0442)', results.safetyYield.toFixed(2), '\u2014'],
      ['\u0417\u0430\u043f\u0430\u0441 \u043f\u043e \u043f\u0440\u043e\u0447\u043d\u043e\u0441\u0442\u0438 (n_\u0432)', results.safetyUltimate.toFixed(2), '\u2014'],
      ['\u041c\u043e\u043c\u0435\u043d\u0442 \u0438\u043d\u0435\u0440\u0446\u0438\u0438 (I)', results.momentOfInertia.toExponential(3), '\u043c\u2074'],
      ['\u041c\u043e\u043c\u0435\u043d\u0442 \u0441\u043e\u043f\u0440\u043e\u0442\u0438\u0432\u043b\u0435\u043d\u0438\u044f (W)', results.sectionModulus.toExponential(3), '\u043c\u00B3'],
    ]
  )

  // === ДИАГРАММА НАПРЯЖЕНИЙ ===

  addSectionHeader('\u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 \u043d\u0430\u043f\u0440\u044f\u0436\u0435\u043d\u0438\u0439')

  const barY = y
  const barH = 8
  const barW = contentWidth

  const elasticW = (results.yieldStrength / results.ultimateStrength) * barW
  doc.setFillColor(16, 185, 129)
  doc.roundedRect(margin, barY, elasticW, barH, 1, 1, 'F')

  doc.setFillColor(245, 158, 11)
  doc.rect(margin + elasticW, barY, barW - elasticW, barH, 'F')
  doc.setDrawColor(150, 150, 150)
  doc.roundedRect(margin, barY, barW, barH, 1, 1, 'S')

  const markerX = margin + Math.min((results.dynamicStress / results.ultimateStrength), 1) * barW
  doc.setFillColor(zc[0], zc[1], zc[2])
  doc.rect(markerX - 0.8, barY - 2, 1.6, barH + 4, 'F')

  y = barY + barH + 6
  setNormal(8)
  doc.setTextColor(100, 100, 100)
  doc.text('0', margin, y)
  doc.text('\u03C3\u0442 = ' + results.yieldStrength.toFixed(0) + ' \u041c\u041f\u0430', margin + elasticW, y, { align: 'center' })
  doc.text('\u03C3\u0432 = ' + results.ultimateStrength.toFixed(0) + ' \u041c\u041f\u0430', margin + barW, y, { align: 'right' })

  y += 5
  setBold(9)
  doc.setTextColor(zc[0], zc[1], zc[2])
  doc.text('\u03C3_\u0434 = ' + results.dynamicStress.toFixed(1) + ' \u041c\u041f\u0430', markerX, y, { align: 'center' })
  y += 10
  doc.setTextColor(0, 0, 0)

  // === СКРИНШОТ 3D ===

  if (canvasImage) {
    addSectionHeader('\u0412\u0438\u0437\u0443\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f \u043d\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u0438\u044f')
    checkPageBreak(90)

    const imgWidth = contentWidth
    const imgHeight = contentWidth * 0.56
    doc.addImage(canvasImage, 'PNG', margin, y, imgWidth, imgHeight)
    y += imgHeight + 6

    setNormal(8)
    doc.setTextColor(150, 150, 150)
    doc.text('3D-\u0432\u0438\u0437\u0443\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f \u0434\u0435\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u043e\u0433\u043e \u0441\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u044f', pageWidth / 2, y, { align: 'center' })
    y += 10
  }

  // === ПОДВАЛ ===

  addDivider()
  setNormal(8)
  doc.setTextColor(150, 150, 150)
  doc.text('\u0421\u0433\u0435\u043d\u0435\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u043e \u043a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440\u043e\u043c \u0443\u0434\u0430\u0440\u043d\u044b\u0445 \u043d\u0430\u0433\u0440\u0443\u0437\u043e\u043a \u2014 Lab Ecosystem', pageWidth / 2, y, { align: 'center' })
  y += 4
  doc.text('\u0414\u043b\u044f \u0441\u043b\u043e\u0436\u043d\u044b\u0445 \u043a\u043e\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0439 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u041c\u041a\u042d-\u0430\u043d\u0430\u043b\u0438\u0437 (ANSYS, SolidWorks Simulation)', pageWidth / 2, y, { align: 'center' })
  y += 4
  doc.text('https://mdyuzhev.github.io/lab-ecosystem/tools/impact-calculator', pageWidth / 2, y, { align: 'center' })

  doc.save(`otchet-udar-${Date.now()}.pdf`)
}
