import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { readEntries, prependEntry, getTodayDate, getTodayEntry, DevLogEntry } from '../devlog'

let tmpFile: string

beforeEach(() => {
  tmpFile = path.join(os.tmpdir(), `devlog-test-${Date.now()}.json`)
})

afterEach(async () => {
  await fs.unlink(tmpFile).catch(() => {})
})

test('readEntries returns [] when file does not exist', async () => {
  const result = await readEntries('/nonexistent/devlog.json')
  expect(result).toEqual([])
})

test('prependEntry writes first entry', async () => {
  const entry: DevLogEntry = { date: '2026-04-29', title: 'Test', body: 'Body text', tags: ['Node.js'] }
  await prependEntry(entry, tmpFile)
  const result = await readEntries(tmpFile)
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual(entry)
})

test('prependEntry puts newest entry first', async () => {
  const older: DevLogEntry = { date: '2026-04-28', title: 'Older', body: 'B', tags: [] }
  const newer: DevLogEntry = { date: '2026-04-29', title: 'Newer', body: 'B', tags: [] }
  await prependEntry(older, tmpFile)
  await prependEntry(newer, tmpFile)
  const result = await readEntries(tmpFile)
  expect(result[0].title).toBe('Newer')
})

test('prependEntry enforces 30 entry limit', async () => {
  for (let i = 0; i < 32; i++) {
    const d = String(i + 1).padStart(2, '0')
    await prependEntry({ date: `2026-01-${d}`, title: `T${i}`, body: 'B', tags: [] }, tmpFile)
  }
  const result = await readEntries(tmpFile)
  expect(result).toHaveLength(30)
})

test('getTodayDate returns YYYY-MM-DD format', () => {
  expect(getTodayDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
})

test('getTodayEntry returns null when no entry for today', async () => {
  const entry: DevLogEntry = { date: '2000-01-01', title: 'Old', body: 'B', tags: [] }
  await prependEntry(entry, tmpFile)
  const result = await getTodayEntry(tmpFile)
  expect(result).toBeNull()
})

test('getTodayEntry returns entry matching today', async () => {
  const today = getTodayDate()
  const entry: DevLogEntry = { date: today, title: 'Today', body: 'B', tags: [] }
  await prependEntry(entry, tmpFile)
  const result = await getTodayEntry(tmpFile)
  expect(result?.title).toBe('Today')
})
