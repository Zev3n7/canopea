// src/app/page.tsx
import Hero            from '@/components/sections/Hero'
import About           from '@/components/sections/About'
import TechSection     from '@/components/sections/TechSection'
import SensoresSection from '@/components/sections/SensoresSection'
import MisionSection   from '@/components/sections/MisionSection'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TechSection />
      <About />
      <SensoresSection />
      <MisionSection />
    </main>
  )
}
