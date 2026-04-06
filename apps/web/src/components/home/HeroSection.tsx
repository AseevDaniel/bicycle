'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// ─── Bike-wheel loading screen ────────────────────────────────────────────────

function BikeWheelLoader() {
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180
    return {
      x1: 50 + Math.cos(a) * 8,
      y1: 50 + Math.sin(a) * 8,
      x2: 50 + Math.cos(a) * 34,
      y2: 50 + Math.sin(a) * 34,
    }
  })
  return (
    <div className="flex flex-col items-center gap-5">
      <svg
        width="90" height="90" viewBox="0 0 100 100"
        className="animate-spin-slow"
        style={{ animationDuration: '2.4s' }}
      >
        {/* Tire */}
        <circle cx="50" cy="50" r="44" fill="none" stroke="#FF4D00" strokeWidth="7" />
        {/* Rim ring */}
        <circle cx="50" cy="50" r="36" fill="none" stroke="#FF6B30" strokeWidth="1.5" opacity="0.55" />
        {/* Hub */}
        <circle cx="50" cy="50" r="5" fill="#FF4D00" />
        {/* Spokes */}
        {spokes.map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke="#FF8C42" strokeWidth="1.5" opacity="0.65" />
        ))}
      </svg>
      <div className="text-center">
        <div className="text-white font-black text-2xl tracking-tight">
          Bici<span className="text-primary-500">Market</span>
        </div>
        <div className="text-white/30 text-xs mt-1 tracking-[0.2em] uppercase">Loading</div>
      </div>
    </div>
  )
}

// ─── 3D canvas ────────────────────────────────────────────────────────────────

function BikeModelCanvas({ onLoaded }: { onLoaded: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.85          // less blown-out than 1.2
    mount.appendChild(renderer.domElement)

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(3.5, 1.8, 5)
    camera.lookAt(0, 0.5, 0)

    // ── Lighting ──────────────────────────────────────────────────────────────
    // Natural sky/ground base — replaces flat AmbientLight
    scene.add(new THREE.HemisphereLight(0xddeeff, 0x111122, 0.65))

    // Key light — warm, front-left-high, casts shadows
    const key = new THREE.DirectionalLight(0xffffff, 1.4)
    key.position.set(-3, 6, 8)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.camera.near = 0.5
    key.shadow.camera.far = 30
    scene.add(key)

    // Rim / separation light — subtle orange from behind-right
    const rim = new THREE.DirectionalLight(0xFF7744, 0.55)
    rim.position.set(5, 1, -6)
    scene.add(rim)

    // ── Ground shadow catcher ─────────────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.25 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -1.5
    ground.receiveShadow = true
    scene.add(ground)

    // ── Model group ───────────────────────────────────────────────────────────
    const modelGroup = new THREE.Group()
    scene.add(modelGroup)

    // ── Load GLTF ─────────────────────────────────────────────────────────────
    const loader = new GLTFLoader()
    loader.load(
      '/bicycle/models/bmx_bike/scene.gltf',
      (gltf) => {
        const model = gltf.scene
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        // Auto-scale & center
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const scale = 3.5 / Math.max(size.x, size.y, size.z)
        model.scale.setScalar(scale)
        model.position.set(
          -center.x * scale,
          -center.y * scale + 0.15,
          -center.z * scale,
        )
        modelGroup.add(model)
        onLoaded()
      },
      undefined,
      (err) => {
        console.error('GLTF load error:', err)
        // Fallback: simple wheel so something shows
        const fb = new THREE.Mesh(
          new THREE.TorusGeometry(1.2, 0.1, 12, 48),
          new THREE.MeshStandardMaterial({ color: 0xFF4D00, metalness: 0.5, roughness: 0.3 })
        )
        fb.rotation.y = Math.PI / 2
        modelGroup.add(fb)
        onLoaded()
      }
    )

    // ── Mouse parallax ────────────────────────────────────────────────────────
    let targetY = 0.12
    let targetX = 0.04
    let curY = 0.12
    let curX = 0.04
    let lastMove = 0

    const onMouseMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5   // -0.5 … +0.5
      const ny = e.clientY / window.innerHeight - 0.5
      targetY = -nx * 0.38    // ±0.19 rad  (was 0.9 — too much)
      targetX =  ny * 0.12    // ±0.06 rad  (was 0.25 — too much)
      lastMove = Date.now()
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Animation loop ────────────────────────────────────────────────────────
    let animId: number
    let t = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      t += 0.016

      // Idle gentle sway when mouse hasn't moved for 2 s
      if (Date.now() - lastMove > 2000) {
        targetY = Math.sin(t * 0.22) * 0.14
        targetX = Math.sin(t * 0.15) * 0.04
      }

      // Smooth spring — 0.022 = noticeably slower & softer than 0.04
      curY += (targetY - curY) * 0.022
      curX += (targetX - curX) * 0.022
      modelGroup.rotation.y = curY
      modelGroup.rotation.x = curX
      modelGroup.position.y = Math.sin(t * 0.38) * 0.07

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return
      const w = mount.clientWidth, h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [onLoaded])

  return <div ref={mountRef} className="w-full h-full" />
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = [
  { value: '847',    label: 'Active listings' },
  { value: '12',     label: 'Cities' },
  { value: '43',     label: 'Mechanics' },
  { value: '1,200+', label: 'Happy renters' },
]

// ─── Hero ─────────────────────────────────────────────────────────────────────

export function HeroSection() {
  const locale = useLocale()
  const [loaded, setLoaded] = useState(false)
  const [hideLoader, setHideLoader] = useState(false)

  // When model is ready: start fade-out, then unmount loader
  const handleLoaded = () => {
    setLoaded(true)
    setTimeout(() => setHideLoader(true), 750)   // remove after transition
  }

  return (
    <section className="relative min-h-screen bg-[#0A0A0A] flex items-center overflow-hidden">
      {/* ── Full-page loading overlay ─────────────────────────────────────── */}
      {!hideLoader && (
        <div
          className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex items-center justify-center
                     transition-opacity duration-700 pointer-events-none"
          style={{ opacity: loaded ? 0 : 1 }}
        >
          <BikeWheelLoader />
        </div>
      )}

      {/* ── Background glows ──────────────────────────────────────────────── */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[90%]
                      bg-primary-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-[40%] h-[50%]
                      bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full container mx-auto px-6 lg:px-8">
        <div className="flex items-center min-h-screen gap-4">

          {/* ── Left: text ────────────────────────────────────────────────── */}
          <div className="flex-1 max-w-2xl pt-24 pb-20">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : -16 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-white/55 text-sm tracking-wide">Costa del Sol, Spain</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 24 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.92] tracking-tight mb-7"
            >
              Buy.<br />
              <span className="text-primary-500">Sell.</span><br />
              Ride.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 16 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-white/45 text-lg leading-relaxed mb-10 max-w-md"
            >
              Costa del Sol's premier cycling marketplace. Buy, sell, rent and
              service bikes — locally, safely, simply.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 16 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3 mb-14"
            >
              <Link
                href={`/${locale}/listings`}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white
                           font-bold px-7 py-3.5 rounded-xl text-base transition-all hover:scale-105
                           shadow-xl shadow-primary-500/20"
              >
                Browse Bikes <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/sell`}
                className="flex items-center gap-2 border border-white/20 hover:border-white/40
                           text-white font-semibold px-7 py-3.5 rounded-xl text-base
                           transition-all hover:bg-white/5"
              >
                Sell Your Bike
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: loaded ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-8 border-t border-white/10 pt-8"
            >
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-white/35 text-xs mt-0.5 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: 3D model ───────────────────────────────────────────── */}
          <div
            className="hidden lg:block flex-shrink-0 w-[48%] h-[85vh] relative
                       transition-opacity duration-1000"
            style={{ opacity: loaded ? 1 : 0 }}
          >
            <BikeModelCanvas onLoaded={handleLoaded} />
            <div className="absolute bottom-0 left-0 right-0 h-32
                            bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24
                      bg-gradient-to-t from-[#0A0A0A] to-transparent z-20 pointer-events-none" />
    </section>
  )
}
