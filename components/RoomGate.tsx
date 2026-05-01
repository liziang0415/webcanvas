'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import RoomFallback from './RoomFallback'
import type { DevLogEntry } from '@/lib/devlog'

const RoomExperience = dynamic(() => import('./RoomExperience'), { ssr: false })

interface Props { todayEntry: DevLogEntry | null }
export default function RoomGate({ todayEntry }: Props) {
  const [supported, setSupported] = useState<boolean | null>(null)
  useEffect(() => {
    setSupported('drawElementImage' in CanvasRenderingContext2D.prototype)
  }, [])

  if (supported === null) return <div className="min-h-screen bg-background" />
  if (!supported)         return <RoomFallback entry={todayEntry} />
  return                         <RoomExperience todayEntry={todayEntry} />
}
