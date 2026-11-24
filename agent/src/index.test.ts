import { expect, test } from 'bun:test'
import { fileURLToPath } from 'node:url'

test('runs the CLI entry point', () => {
  const entry = fileURLToPath(new URL('./index.ts', import.meta.url))
  const result = Bun.spawnSync([process.execPath, entry])

  expect(result.exitCode).toBe(0)
  expect(result.stdout.toString().trim()).toBe('AI Catalog Agent')
})
