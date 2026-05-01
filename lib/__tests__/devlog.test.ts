import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { readEntries, prependEntry, getTodayDate, getTodayEntry, DevLogEntry } from '../devlog'

let tmpFile: string
beforeEach(() => { tmpFile = path.join(os.tmpdir(), `devlog-test-${Date.now()}.json`) })
afterEach(async () => { await fs.unlink(tmpFile).catch(() => {}) })

test('readEntries returns [] when file does not exist', async () => {
  expect(await readEntries('/nonexistent.json')).toEqual([])
})
test('prependEntry writes first entry', async () => {
  const e: DevLogEntry = { date: '2026-04-29', title: 'T', body: 'B', tags: ['Node.js'] }
  await prependEntry(e, tmpFile)
  expect((await readEntries(tmpFile))[0]).toEqual(e)
})
test('prependEntry puts newest entry first', async () => {
  await prependEntry({ date: '2026-04-28', title: 'Old', body: 'B', tags: [] }, tmpFile)
  await prependEntry({ date: '2026-04-29', title: 'New', body: 'B', tags: [] }, tmpFile)
  expect((await readEntries(tmpFile))[0].title).toBe('New')
})
test('prependEntry enforces 30 entry limit', async () => {
  for (let i = 0; i < 32; i++)
    await prependEntry({ date: `2026-01-${String(i+1).padStart(2,'0')}`, title: `T${i}`, body: 'B', tags: [] }, tmpFile)
  expect(await readEntries(tmpFile)).toHaveLength(30)
})
test('getTodayDate returns YYYY-MM-DD', () => {
  expect(getTodayDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
})
test('getTodayEntry returns null when no today entry', async () => {
  await prependEntry({ date: '2000-01-01', title: 'Old', body: 'B', tags: [] }, tmpFile)
  expect(await getTodayEntry(tmpFile)).toBeNull()
})
test('getTodayEntry returns today entry', async () => {
  const today = getTodayDate()
  await prependEntry({ date: today, title: 'Today', body: 'B', tags: [] }, tmpFile)
  expect((await getTodayEntry(tmpFile))?.title).toBe('Today')
})
