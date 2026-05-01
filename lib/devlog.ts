import fs from 'fs/promises'
import path from 'path'

export interface DevLogEntry {
  date: string  // YYYY-MM-DD
  title: string
  body: string
  tags: string[]
}

const DEFAULT_PATH = path.join(process.cwd(), 'data', 'devlog.json')
const MAX_ENTRIES = 30

export async function readEntries(filePath = DEFAULT_PATH): Promise<DevLogEntry[]> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw) as DevLogEntry[]
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw err
  }
}

export async function prependEntry(entry: DevLogEntry, filePath = DEFAULT_PATH): Promise<void> {
  const entries = await readEntries(filePath)
  await fs.writeFile(filePath, JSON.stringify([entry, ...entries].slice(0, MAX_ENTRIES), null, 2))
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export async function getTodayEntry(filePath = DEFAULT_PATH): Promise<DevLogEntry | null> {
  const entries = await readEntries(filePath)
  return entries.find(e => e.date === getTodayDate()) ?? null
}
