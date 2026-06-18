"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { ShoppingBag, Users, ShieldCheck, HeadphonesIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatItemProps {
  end: number
  suffix?: string
  label: string
  icon: React.ElementType
  delay: number
}

function AnimatedCounter({ end, suffix = "", label, icon: Icon, delay }: StatItemProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const startTime = Date.now()

          const tick = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-2xl p-4 sm:p-6 text-center group hover:border-blue-500/30 transition-all duration-300"
    >
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl gradient-bg mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-7 w-7 text-white" />
      </div>
      <div className="text-3xl sm:text-4xl font-bold gradient-text">
        {count}
        {suffix}
      </div>
      <p className="mt-2 text-sm text-white/60">{label}</p>
    </motion.div>
  )
}

const stats = [
  { end: 5000, suffix: "+", label: "Akun Terjual", icon: ShoppingBag },
  { end: 3000, suffix: "+", label: "Pelanggan Puas", icon: Users },
  { end: 99, suffix: "%", label: "Transaksi Berhasil", icon: ShieldCheck },
  { end: 24, suffix: "/7", label: "Support", icon: HeadphonesIcon },
]

export default function Statistics() {
  return (
    <section className="py-20 relative">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <AnimatedCounter key={stat.label} {...stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
