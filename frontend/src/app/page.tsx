import dynamic from "next/dynamic"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import DevelopmentBanner from "@/components/sections/DevelopmentBanner"
import Hero from "@/components/sections/Hero"

const Categories = dynamic(() => import("@/components/sections/Categories"), { ssr: true })
const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs"), { ssr: true })
const Process = dynamic(() => import("@/components/sections/Process"), { ssr: true })
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"), { ssr: true })
const FAQ = dynamic(() => import("@/components/sections/FAQ"), { ssr: true })
const CTA = dynamic(() => import("@/components/sections/CTA"), { ssr: true })
const WelcomeModal = dynamic(() => import("@/components/sections/WelcomeModal"))

export default function Home() {
  return (
    <>
      <Navbar />
      <DevelopmentBanner />
      <WelcomeModal />
      <main className="relative overflow-x-clip">
        <Hero />
        <Categories />
        <WhyChooseUs />
        <Process />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
