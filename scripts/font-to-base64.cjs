const fs = require('fs')
const path = require('path')

const fonts = ['PTSans-Regular.ttf', 'PTSans-Bold.ttf']

fonts.forEach(fontFile => {
  const filePath = path.join(__dirname, fontFile)
  const base64 = fs.readFileSync(filePath).toString('base64')
  const varName = fontFile.replace(/[-.]/g, '_').replace('ttf', 'base64')
  const output = `export const ${varName} = '${base64}';\n`
  const outPath = path.join(__dirname, '..', 'src', 'assets', 'fonts', fontFile.replace('.ttf', '.js'))
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, output)
  console.log(`Wrote ${outPath} (${(base64.length / 1024).toFixed(0)} KB)`)
})
