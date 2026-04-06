'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import * as THREE from 'three'

function HeroCanvas() {
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
    camera.position.set(0, 0, 6)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const orangeLight = new THREE.PointLight(0xFF4D00, 2, 20)
    orangeLight.position.set(5, 5, 5)
    scene.add(orangeLight)
    const tealLight = new THREE.PointLight(0x00D4AA, 1, 20)
    tealLight.position.set(-5, -5, -5)
    scene.add(tealLight)

    // Stars
    const starGeo = new THREE.BufferGeometry()
    const starCount = 3000
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 200
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, sizeAttenuation: true })
    scene.add(new THREE.Points(starGeo, starMat))

    // Bike model group
    const bikeGroup = new THREE.Group()
    bikeGroup.scale.setScalar(1.5)
    scene.add(bikeGroup)

    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xFF8C42 })
    const tealMat = new THREE.MeshStandardMaterial({ color: 0x00D4AA })
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0xFF4D00, wireframe: true })

    // Wheels
    const wheelGeo = new THREE.TorusGeometry(1, 0.08, 8, 32)
    const fw = new THREE.Mesh(wheelGeo, wheelMat)
    fw.position.set(1.5, 0, 0); fw.rotation.y = Math.PI / 2
    bikeGroup.add(fw)
    const rw = new THREE.Mesh(wheelGeo, wheelMat)
    rw.position.set(-1.5, 0, 0); rw.rotation.y = Math.PI / 2
    bikeGroup.add(rw)

    // Frame tubes
    const addBox = (w: number, h: number, d: number, x: number, y: number, z: number, mat: THREE.Material, rx = 0, ry = 0, rz = 0) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
      mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz)
      bikeGroup.add(mesh)
    }
    const addCyl = (r: number, h: number, x: number, y: number, z: number, mat: THREE.Material, rz = 0) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 8), mat)
      mesh.position.set(x, y, z); mesh.rotation.z = rz
      bikeGroup.add(mesh)
    }

    addBox(3.2, 0.08, 0.08, 0, 0.5, 0, orangeMat)        // top tube
    addBox(2.2, 0.08, 0.08, 0.3, -0.2, 0, orangeMat, 0, 0, -0.4) // down tube
    addBox(2.0, 0.06, 0.06, 0, -0.9, 0, orangeMat)         // chainstay
    addBox(0.7, 0.08, 0.08, 1.55, 1.1, 0, tealMat)         // handlebars
    addBox(0.55, 0.06, 0.18, -0.75, 1.35, 0, tealMat)      // saddle
    addCyl(0.05, 1.3, -0.5, 0.2, 0, orangeMat, 0.15)       // seat tube
    addCyl(0.05, 1.3, 1.3, 0.1, 0, orangeMat, -0.25)       // fork
    addCyl(0.04, 0.6, 1.5, 0.8, 0, tealMat)                // stem
    addCyl(0.04, 0.5, -0.7, 1.05, 0, tealMat)              // seatpost

    // BB
    const bbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xFF4D00, emissive: 0xFF4D00, emissiveIntensity: 0.3 }))
    bbMesh.position.set(-0.1, -0.9, 0)
    bikeGroup.add(bbMesh)

    // Floating particles
    const particles: { mesh: THREE.Mesh; baseY: number; speed: number; offset: number }[] = []
    const particlePositions: [number, number, number][] = [
      [-4, 2, -2], [4, -1, -3], [-3, -2, -1], [5, 2, -2],
      [-5, 1, -4], [3, 3, -3], [-2, -3, -2], [4, -2, -4],
      [0, 3, -3], [-4, 0, -3],
    ]
    const particleMat = new THREE.MeshStandardMaterial({ color: 0xFF4D00, emissive: 0xFF4D00, emissiveIntensity: 0.8 })
    particlePositions.forEach(([px, py, pz]) => {
      const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.05, 0), particleMat)
      mesh.position.set(px, py, pz)
      scene.add(mesh)
      particles.push({ mesh, baseY: py, speed: 0.3 + Math.random() * 0.5, offset: Math.random() * Math.PI * 2 })
    })

    // Animation loop
    let animId: number
    let time = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      time += 0.016
      bikeGroup.rotation.y = Math.sin(time * 0.3) * 0.3
      bikeGroup.position.y = Math.sin(time * 0.5) * 0.1
      particles.forEach(p => {
        p.mesh.position.y = p.baseY + Math.sin(time * p.speed + p.offset) * 0.3
        p.mesh.rotation.x = time * 0.5
        p.mesh.rotation.z = time * 0.3
      })
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight
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
  { value: '847', label: 'Active Listings' },
  { value: '12', label: 'Cities' },
  { value: '43', label: 'Expert Mechanics' },
  { value: '1,200+', label: 'Happy Renters' },
]

export function HeroSection() {
  const locale = useLocale()

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-secondary-500">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas />
        {/* Dark overlay for text readability - reduced opacity to show 3D bike more */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/75 via-secondary-900/40 to-secondary-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-transparent to-secondary-900/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8"
          >
            <span className="text-lg">🇪🇸</span>
            <span className="text-white/90 text-sm font-medium">Costa del Sol</span>
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
            <span className="text-accent-400 text-sm">Live marketplace</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Find Your{' '}
            <span className="relative inline-block">
              <span className="text-primary-400">Perfect Bike</span>
              <motion.span
                className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </span>
            {' '}in{' '}
            <span className="text-accent-400">Costa del Sol</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl text-white/70 mb-10 max-w-2xl leading-relaxed"
          >
            The premier cycling marketplace for the Costa del Sol. Buy, sell, rent, and service bikes with verified local sellers and expert mechanics across 12 cities.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Link
              href={`/${locale}/listings`}
              className="group flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105"
            >
              Browse Bikes
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={`/${locale}/sell`}
              className="flex items-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
            >
              Sell Your Bike
            </Link>
            <Link
              href={`/${locale}/rentals`}
              className="flex items-center gap-2 text-accent-400 hover:text-accent-300 font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200 hover:bg-accent-400/10"
            >
              Rent a Bike →
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex flex-wrap gap-8"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-3xl font-bold text-white">{stat.value}</span>
                <span className="text-white/50 text-sm">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary-900 to-transparent z-5" />
    </section>
  )
}
