import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import WhyChooseUs from '@/components/WhyChooseUs'
import Services from '@/components/Services'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Hero />
      <Services/>
      <HowItWorks/>
      <WhyChooseUs/>
      <CTA/>        
    </main>
  )
}
