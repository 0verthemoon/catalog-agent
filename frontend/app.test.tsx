import { expect, test } from 'bun:test'

import { renderToStaticMarkup } from 'react-dom/server'

import { App } from './src/App'
import { selectCatalogFile } from './src/catalog-file'

test('renders the application heading', () => {
  const page = renderToStaticMarkup(<App />)
  expect(page).toContain('От файла — к товарам в магазине')
  expect(page).toContain('catalog_november.xlsx')
})

test('accepts a supported file at the limit and rejects invalid selections', () => {
  const limit = 50 * 1024 * 1024
  expect(selectCatalogFile({ name: 'Каталог.XLSX', size: limit })).toHaveProperty(
    'file.format',
    'XLSX',
  )
  for (const file of [
    { name: 'a.csv', size: limit + 1 },
    { name: 'a.pdf', size: 0 },
    { name: 'a.csv.exe', size: 30 },
  ]) {
    expect(selectCatalogFile(file)).toHaveProperty('error')
  }
})
