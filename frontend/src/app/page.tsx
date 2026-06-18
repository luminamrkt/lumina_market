import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import DevelopmentBanner from "@/components/sections/DevelopmentBanner"
import Hero from "@/components/sections/Hero"
import Statistics from "@/components/sections/Statistics"
import Categories from "@/components/sections/Categories"
import WhyChooseUs from "@/components/sections/WhyChooseUs"
import PremiumAccounts from "@/components/sections/PremiumAccounts"
import Process from "@/components/sections/Process"
import Testimonials from "@/components/sections/Testimonials"
import FAQ from "@/components/sections/FAQ"
import CTA from "@/components/sections/CTA"

export default function Home() {
  return (
    <>
      <Navbar />
      <DevelopmentBanner />
      <main className="relative overflow-x-clip">
        <Hero />
        <Statistics />
        <Categories />
        <WhyChooseUs />
        <PremiumAccounts />
        <Process />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
