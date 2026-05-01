import { getTodayEntry } from '@/lib/devlog'
import RoomGate from '@/components/RoomGate'

export default async function Home() {
  const todayEntry = await getTodayEntry()
  return <RoomGate todayEntry={todayEntry} />
}
