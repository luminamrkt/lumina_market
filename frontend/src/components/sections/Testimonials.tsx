"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Rudi Hartono",
    username: "@rudi_h",
    rating: 5,
    text: "Beli akun Mythic di sini, prosesnya cepat banget! 5 menit setelah bayar, akun langsung dikirim. Recommended!",
    fallback: "R",
  },
  {
    name: "Siti Nurhaliza",
    username: "@siti_n",
    rating: 5,
    text: "Awalnya ragu, tapi setelah beli akun sultan, ternyata asli dan lengkap skinnya. Makasih Lumina Market!",
    fallback: "S",
  },
  {
    name: "Ahmad Fauzi",
    username: "@ahmad_f",
    rating: 4,
    text: "Harga bersaing dan pelayanannya ramah. Sudah beli 3x di sini, selalu puas.",
    fallback: "A",
  },
  {
    name: "Dinda Permata",
    username: "@dinda_p",
    rating: 5,
    text: "Akun collector yang saya cari akhirnya ketemu! Harganya worth it banget untuk skin langka.",
    fallback: "D",
  },
  {
    name: "Budi Santoso",
    username: "@budi_s",
    rating: 5,
    text: "Supportnya responsif banget. Saya sempat bingung cara ganti email, dibantu sampai selesai.",
    fallback: "B",
  },
]

export default function Testimonials() {
  const [[current, direction], setCurrent] = useState([0, 0])
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent(([prev]) => [(prev + 1) % testimonials.length, 1])
  }, [])

  const prev = useCallback(() => {
    setCurrent(([prev]) => [(prev - 1 + testimonials.length) % testimonials.length, -1])
  }, [])

  const goTo = useCallback((i: number) => {
    setCurrent(([prev]) => [i, i > prev ? 1 : -1])
  }, [])

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [isPaused, next])

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  }

  return (
    <section id="testimonials" className="py-24 relative">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Apa Kata <span className="gradient-text">Pelanggan</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Ribuan pelanggan telah mempercayai kami. Ini kata mereka
          </p>
        </motion.div>

        <div
          className="max-w-2xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative min-h-[220px] flex items-center">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="glass rounded-2xl p-4 sm:p-6 w-full"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Avatar fallback={testimonials[current].fallback} />
                  <div>
                    <p className="font-semibold text-white">{testimonials[current].name}</p>
                    <p className="text-sm text-white/50">{testimonials[current].username}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: testimonials[current].rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                </div>
                <p className="text-white/70 leading-relaxed">
                  &ldquo;{testimonials[current].text}&rdquo;
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="h-5 w-5 text-white/60" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === current ? "w-8 gradient-bg" : "w-2 bg-white/20"
                  }`}
                  aria-label={`Testimoni ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Selanjutnya"
            >
              <ChevronRight className="h-5 w-5 text-white/60" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
