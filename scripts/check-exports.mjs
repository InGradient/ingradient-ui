import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const contracts = [
  { directory: '.', exports: {
    '.': ['IngradientThemeProvider', 'IngradientGlobalStyle'],
    './brand': ['BrandMark', 'BrandLogo'],
    './hooks': ['useZoomPan', 'useSelection', 'useClipboard', 'useUndoRedo', 'useDrawingCanvas'],
    './tokens': ['renderTokensCss', 'spacingScale'],
    './primitives': ['Box', 'Text'],
    './components': ['Button', 'Alert', 'ImageCard', 'UploadDropzone'],
    './patterns': ['AppShell', 'CommentThread', 'DrawingLayer', 'ChipGroup'],
    './utils': ['logger'],
  } },
  { directory: 'packages/platform-pages', exports: { '.': ['CatalogView', 'DashboardView', 'LoginView'] } },
  { directory: 'packages/edge-pages', exports: { '.': ['LoginView', 'LicenseView', 'DatasetSelectView'] } },
]

function targets(value) {
  return typeof value === 'string' ? [value] : Object.values(value).flatMap(targets)
}

function exportedNames(file) {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const names = new Set()
  for (const statement of source.statements) {
    if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) names.add(element.name.text)
    }
  }
  return names
}

const errors = []
for (const contract of contracts) {
  const pkg = JSON.parse(readFileSync(path.join(contract.directory, 'package.json'), 'utf8'))
  if (pkg.dependencies?.[pkg.name]) errors.push(`${pkg.name}: package must not depend on itself`)
  for (const subpath of Object.keys(contract.exports)) {
    if (!(subpath in pkg.exports)) errors.push(`${pkg.name}: missing public path ${subpath}`)
  }
  for (const [subpath, entry] of Object.entries(pkg.exports)) {
    for (const target of targets(entry)) {
      if (!existsSync(path.join(contract.directory, target))) errors.push(`${pkg.name}${subpath}: missing ${target}`)
    }
    const modulePath = typeof entry === 'string' ? entry : entry.import
    if (!modulePath?.endsWith('.js') || !existsSync(path.join(contract.directory, modulePath))) continue
    const names = exportedNames(path.join(contract.directory, modulePath))
    for (const name of contract.exports[subpath] ?? []) {
      if (!names.has(name)) errors.push(`${pkg.name}${subpath}: missing named export ${name}`)
    }
  }
  console.log(`${pkg.name}: checked ${Object.keys(pkg.exports).length} public paths`)
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log('All package targets and critical runtime exports verified.')
