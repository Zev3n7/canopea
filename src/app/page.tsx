// src/app/page.tsx
import Navbar          from '@/components/layout/Navbar'
import Footer          from '@/components/layout/Footer'
import Hero            from '@/components/sections/Hero'
import About           from '@/components/sections/About'
import SensoresSection from '@/components/sections/SensoresSection'
import MisionSection   from '@/components/sections/MisionSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <SensoresSection />
        <MisionSection />
      </main>
      <Footer />
    </>
  )
}
