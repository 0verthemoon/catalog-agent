import { expect, test } from 'bun:test'

import { renderToStaticMarkup } from 'react-dom/server'

import { App } from './src/App'

test('renders the application heading', () => {
  expect(renderToStaticMarkup(<App />)).toContain('<h1>AI Catalog Agent</h1>')
})
