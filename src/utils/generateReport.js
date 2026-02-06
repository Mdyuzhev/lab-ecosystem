import jsPDF from 'jspdf'

export function generateReport(inputs, results, canvasImage) {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = 210
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  function addTitle(text) {
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(text, pageWidth / 2, y, { align: 'center' })
    y += 10
  }

  function addSectionHeader(text) {
    checkPageBreak(15)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
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
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(key, margin, y)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    const valueText = unit ? `${value} ${unit}` : `${value}`
    doc.text(valueText, margin + 90, y)
    y += 7
  }

  function addTable(headers, rows) {
    checkPageBreak(10 + rows.length * 7)
    const colWidth = contentWidth / headers.length

    doc.setFillColor(241, 245, 249)
    doc.rect(margin, y - 4, contentWidth, 8, 'F')
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(71, 85, 105)
    headers.forEach((h, i) => {
      doc.text(h, margin + i * colWidth + 2, y)
    })
    y += 8

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    rows.forEach((row, rowIdx) => {
      if (rowIdx % 2 === 0) {
        doc.setFillColor(248, 250, 252)
        doc.rect(margin, y - 4, contentWidth, 7, 'F')
      }
      row.forEach((cell, i) => {
        doc.text(String(cell), margin + i * colWidth + 2, y)
      })
      y += 7
    })
    y += 4
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

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Lab Ecosystem — Impact Loading Calculator', pageWidth / 2, y, { align: 'center' })
  y += 8

  addTitle('Impact Loading Report')

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 150, 150)
  doc.text(
    `Date: ${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`,
    pageWidth / 2, y, { align: 'center' }
  )
  y += 12

  // === ВХОДНЫЕ ДАННЫЕ ===

  addSectionHeader('Input Parameters')

  const elementNames = {
    'beam-cantilever': 'Cantilever beam',
    'beam-supported': 'Simply supported beam',
    'plate': 'Plate (simplified)',
    'rod': 'Rod (simplified)',
  }
  addKeyValue('Element type', elementNames[inputs.elementType] || inputs.elementType)

  const sectionNames = { rectangular: 'Rectangular', circular: 'Circular', tube: 'Tube' }
  addKeyValue('Cross-section', sectionNames[inputs.sectionType] || inputs.sectionType)
  addKeyValue('Length (L)', inputs.length, 'mm')

  if (inputs.sectionType === 'rectangular') {
    addKeyValue('Width (b)', inputs.width, 'mm')
    addKeyValue('Height (h)', inputs.height, 'mm')
  } else if (inputs.sectionType === 'circular') {
    addKeyValue('Diameter (d)', inputs.diameter, 'mm')
  } else if (inputs.sectionType === 'tube') {
    addKeyValue('Outer diameter (D)', inputs.outerDiameter, 'mm')
    addKeyValue('Inner diameter (d)', inputs.innerDiameter, 'mm')
  }

  y += 4

  const materialNames = {
    'steel-45': 'Steel 45',
    'steel-3': 'Steel 3',
    'aluminum-d16': 'D16 (duralumin)',
    'titanium-vt6': 'VT6 (titanium)',
    'custom': 'Custom material',
  }
  addKeyValue('Material', materialNames[inputs.material] || inputs.material)
  addKeyValue("Young's modulus (E)", inputs.youngModulus, 'GPa')
  addKeyValue('Yield strength', inputs.yieldStrength, 'MPa')
  addKeyValue('Ultimate strength', inputs.ultimateStrength, 'MPa')

  y += 4

  if (inputs.impactType === 'energy') {
    addKeyValue('Impact method', 'Energy')
    addKeyValue('Impact energy', inputs.impactEnergy, 'J')
  } else {
    addKeyValue('Impact method', 'Mass + velocity')
    addKeyValue('Impactor mass', inputs.impactMass, 'kg')
    addKeyValue('Impact velocity', inputs.impactVelocity, 'm/s')
  }

  // === РЕЗУЛЬТАТЫ ===

  addDivider()
  addSectionHeader('Calculation Results')

  const zoneColors = {
    emerald: [16, 185, 129],
    amber: [245, 158, 11],
    red: [239, 68, 68],
  }
  const zoneLabels = {
    emerald: 'ELASTIC ZONE — structure will recover',
    amber: 'PLASTIC ZONE — permanent deformation',
    red: 'FAILURE — structural collapse',
  }
  const zc = zoneColors[results.zoneColor] || zoneColors.emerald

  doc.setFillColor(zc[0], zc[1], zc[2])
  doc.roundedRect(margin, y - 4, contentWidth, 14, 3, 3, 'F')
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text(zoneLabels[results.zoneColor] || results.zone, pageWidth / 2, y + 5, { align: 'center' })
  y += 18
  doc.setTextColor(0, 0, 0)

  addTable(
    ['Parameter', 'Value', 'Unit'],
    [
      ['Impact energy', results.impactEnergy.toFixed(1), 'J'],
      ['Dynamic force', results.dynamicForce.toFixed(1), 'N'],
      ['Bending moment', results.bendingMoment.toFixed(2), 'N*m'],
      ['Dynamic stress', results.dynamicStress.toFixed(1), 'MPa'],
      ['Yield strength', results.yieldStrength.toFixed(0), 'MPa'],
      ['Ultimate strength', results.ultimateStrength.toFixed(0), 'MPa'],
      ['Dynamic deflection', results.dynamicDeflection.toFixed(2), 'mm'],
      ['Dynamic coefficient', results.dynamicCoefficient.toFixed(2), ''],
      ['Safety factor (yield)', results.safetyYield.toFixed(2), ''],
      ['Safety factor (ultimate)', results.safetyUltimate.toFixed(2), ''],
      ['Moment of inertia', results.momentOfInertia.toExponential(3), 'm^4'],
      ['Section modulus', results.sectionModulus.toExponential(3), 'm^3'],
    ]
  )

  // === ДИАГРАММА НАПРЯЖЕНИЙ ===

  addSectionHeader('Stress Diagram')

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
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('0', margin, y)
  doc.text(`Yield = ${results.yieldStrength.toFixed(0)} MPa`, margin + elasticW, y, { align: 'center' })
  doc.text(`Ultimate = ${results.ultimateStrength.toFixed(0)} MPa`, margin + barW, y, { align: 'right' })

  y += 5
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(zc[0], zc[1], zc[2])
  doc.text(`Dynamic stress = ${results.dynamicStress.toFixed(1)} MPa`, markerX, y, { align: 'center' })
  y += 10
  doc.setTextColor(0, 0, 0)

  // === СКРИНШОТ 3D ===

  if (canvasImage) {
    addSectionHeader('3D Visualization')
    checkPageBreak(90)

    const imgWidth = contentWidth
    const imgHeight = contentWidth * 0.56
    doc.addImage(canvasImage, 'PNG', margin, y, imgWidth, imgHeight)
    y += imgHeight + 6

    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Deformed state visualization', pageWidth / 2, y, { align: 'center' })
    y += 10
  }

  // === ПОДВАЛ ===

  addDivider()
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('Generated by Impact Loading Calculator — Lab Ecosystem', pageWidth / 2, y, { align: 'center' })
  y += 4
  doc.text('For complex structures use FEA analysis (ANSYS, SolidWorks Simulation)', pageWidth / 2, y, { align: 'center' })
  y += 4
  doc.text('https://mdyuzhev.github.io/lab-ecosystem/tools/impact-calculator', pageWidth / 2, y, { align: 'center' })

  doc.save(`impact-report-${Date.now()}.pdf`)
}
