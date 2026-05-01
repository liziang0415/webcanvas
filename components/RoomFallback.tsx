import Nav      from './fallback/Nav'
import Hero     from './fallback/Hero'
import DevLog   from './fallback/DevLog'
import About    from './fallback/About'
import Projects from './fallback/Projects'
import Skills   from './fallback/Skills'
import Contact  from './fallback/Contact'
import type { DevLogEntry } from '@/lib/devlog'
interface Props { entry: DevLogEntry | null }
export default function RoomFallback({ entry }: Props) {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <DevLog entry={entry} />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  )
}
