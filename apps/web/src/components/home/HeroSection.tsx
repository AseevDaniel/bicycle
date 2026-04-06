'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import * as THREE from 'three'

function WheelCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const mount = mountRef.current
    const width = mount.clientWidth
    const height = mount.clientHeight

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.set(0, 0, 7)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const orangeLight = new THREE.PointLight(0xFF4D00, 2, 30)
    orangeLight.position.set(3, 3, 4)
    scene.add(orangeLight)
    const tealLight = new THREE.PointLight(0x00D4AA, 1, 30)
    tealLight.position.set(-4, -2, -3)
    scene.add(tealLight)

    // Wheel group
    const wheelGroup = new THREE.Group()
    scene.add(wheelGroup)

    // Outer tire
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.7 })
    const tireGeo = new THREE.TorusGeometry(2.2, 0.22, 20, 80)
    wheelGroup.add(new THREE.Mesh(tireGeo, tireMat))

    // Rim
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xFF4D00, metalness: 0.8, roughness: 0.2 })
    const rimGeo = new THREE.TorusGeometry(2.05, 0.07, 16, 80)
    wheelGroup.add(new THREE.Mesh(rimGeo, rimMat))

    // Inner rim ring
    const innerRimMat = new THREE.MeshStandardMaterial({ color: 0xFF6B30, metalness: 0.7, roughness: 0.3 })
    const innerRimGeo = new THREE.TorusGeometry(1.7, 0.04, 12, 80)
    wheelGroup.add(new THREE.Mesh(innerRimGeo, innerRimMat))

    // Hub
    const hubMat = new THREE.MeshStandardMaterial({ color: 0xFF4D00, metalness: 0.9, roughness: 0.1 })
    const hubGeo = new THREE.SphereGeometry(0.18, 16, 16)
    wheelGroup.add(new THREE.Mesh(hubGeo, hubMat))

    // 16 spokes
    const spokeMat = new THREE.MeshStandardMaterial({ color: 0xFF8C42, metalness: 0.6, roughness: 0.4 })
    const spokeCount = 16
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2
      const spokeGeo = new THREE.CylinderGeometry(0.018, 0.018, 1.85, 6)
      const spoke = new THREE.Mesh(spokeGeo, spokeMat)
      // Position at midpoint between hub and inner rim (~0.92 from center)
      spoke.position.x = Math.cos(angle) * 0.92
      spoke.position.y = Math.sin(angle) * 0.92
      // Rotate so the cylinder points radially outward
      spoke.rotation.z = angle + Math.PI / 2
      wheelGroup.add(spoke)
    }

    // Animation loop
    let animId: number
    let t = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      t += 0.016
      // Spin on Z axis like a real wheel
      wheelGroup.rotation.z -= 0.005
      // Subtle Y oscillation for 3D perspective feel
      wheelGroup.rotation.y = Math.sin(t * 0.4) * 0.25
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0" />
}

const stats = [
  { value: '847', label: 'Active listings' },
  { value: '12', label: 'Cities' },
  { value: '43', label: 'Mechanics' },
  { value: '1,200+', label: 'Happy renters' },
]

export function HeroSection() {
  const locale = useLocale()

  return (
    <section className="relative min-h-screen bg-[#0A0A0A] flex items-center overflow-hidden">
      {/* Subtle radial glow behind wheel */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-[80%] bg-primary-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full container mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-8 min-h-screen">

          {/* Left: text content */}
          <div className="flex-1 max-w-2xl pt-20 pb-16">
            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-white/60 text-sm tracking-wide">Costa del Sol, Spain</span>
            </motion.div>

            {/* Headline - very large */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6"
            >
              Buy.<br />
              <span className="text-primary-500">Sell.</span><br />
              Ride.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-white/50 text-xl leading-relaxed mb-10 max-w-lg"
            >
              Costa del Sol&apos;s premier cycling marketplace. Buy, sell, rent and service bikes — locally, safely, simply.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3 mb-14"
            >
              <Link
                href={`/${locale}/listings`}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all hover:scale-105 shadow-lg shadow-primary-500/25"
              >
                Browse Bikes <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/sell`}
                className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-all hover:bg-white/5"
              >
                Sell Your Bike
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex gap-8 border-t border-white/10 pt-8"
            >
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D Wheel */}
          <div className="hidden lg:block flex-shrink-0 w-[45%] h-screen relative">
            <WheelCanvas />
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10" />
    </section>
  )
}
