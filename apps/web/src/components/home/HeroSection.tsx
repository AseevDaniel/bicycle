'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function BikeModelCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Renderer setup — high quality
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    mount.appendChild(renderer.domElement)

    // Scene
    const scene = new THREE.Scene()

    // Camera — 3/4 angle view, slightly elevated, looking at bike center
    const camera = new THREE.PerspectiveCamera(40, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(3.5, 1.8, 5)
    camera.lookAt(0, 0.5, 0)

    // Lighting — like a product shoot
    // Key light: warm directional from upper-front-right
    const keyLight = new THREE.DirectionalLight(0xfff5e0, 2.5)
    keyLight.position.set(5, 8, 6)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    scene.add(keyLight)

    // Fill light: soft cool from left
    const fillLight = new THREE.DirectionalLight(0xd0e8ff, 0.8)
    fillLight.position.set(-5, 3, 2)
    scene.add(fillLight)

    // Rim light: orange from behind-right (brand accent)
    const rimLight = new THREE.PointLight(0xFF4D00, 1.5, 20)
    rimLight.position.set(-2, 2, -5)
    scene.add(rimLight)

    // Ambient: very soft to avoid pure blacks
    scene.add(new THREE.AmbientLight(0xffffff, 0.3))

    // Ground plane — subtle shadow catcher
    const groundGeo = new THREE.PlaneGeometry(20, 20)
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.3 })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -1.5
    ground.receiveShadow = true
    scene.add(ground)

    // Model group for rotation
    const modelGroup = new THREE.Group()
    scene.add(modelGroup)

    // Loading state - simple rotating ring while loading
    const loadingRingGeo = new THREE.TorusGeometry(0.5, 0.04, 8, 32)
    const loadingRingMat = new THREE.MeshBasicMaterial({ color: 0xFF4D00, transparent: true, opacity: 0.7 })
    const loadingRing = new THREE.Mesh(loadingRingGeo, loadingRingMat)
    scene.add(loadingRing)

    // Load the GLTF model
    // basePath is /bicycle, so URL is /bicycle/models/bmx_bike/scene.gltf
    const loader = new GLTFLoader()
    loader.load(
      '/bicycle/models/bmx_bike/scene.gltf',
      (gltf) => {
        // Remove loading indicator
        scene.remove(loadingRing)

        const model = gltf.scene

        // Enable shadows on all meshes
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })

        // Auto-scale and center the model
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const targetSize = 3.5
        const scale = targetSize / maxDim
        model.scale.setScalar(scale)

        // Center the model
        model.position.x = -center.x * scale
        model.position.y = -center.y * scale + 0.2 // slight vertical adjustment
        model.position.z = -center.z * scale

        modelGroup.add(model)
      },
      undefined,
      (error) => {
        console.error('Failed to load bike model:', error)
        // Fallback: keep showing a nicer placeholder
        scene.remove(loadingRing)
        // Simple bike silhouette fallback
        const fallbackGeo = new THREE.TorusGeometry(1.2, 0.08, 12, 48)
        const fallbackMat = new THREE.MeshStandardMaterial({ color: 0xFF4D00, metalness: 0.5, roughness: 0.3 })
        const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat)
        fallbackMesh.rotation.y = Math.PI / 2
        modelGroup.add(fallbackMesh)
      }
    )

    // Animation loop
    let animId: number
    let t = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      t += 0.016

      // Loading ring spin
      loadingRing.rotation.z += 0.05
      loadingRing.rotation.x = Math.PI / 4

      // Slow model rotation — full turn every ~40 seconds
      modelGroup.rotation.y = t * 0.025

      // Very subtle floating
      modelGroup.position.y = Math.sin(t * 0.4) * 0.08

      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      if (!mount) return
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

  return (
    <div ref={mountRef} className="w-full h-full" />
  )
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
      {/* Radial glow behind bike area */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[90%] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-[40%] h-[50%] bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full container mx-auto px-6 lg:px-8">
        <div className="flex items-center min-h-screen gap-4">

          {/* Left: text */}
          <div className="flex-1 max-w-2xl pt-24 pb-20">

            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-white/55 text-sm tracking-wide">Costa del Sol, Spain</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.92] tracking-tight mb-7"
            >
              Buy.<br />
              <span className="text-primary-500">Sell.</span><br />
              Ride.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-white/45 text-lg leading-relaxed mb-10 max-w-md"
            >
              Costa del Sol's premier cycling marketplace. Buy, sell, rent and service bikes — locally, safely, simply.
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
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all hover:scale-105 shadow-xl shadow-primary-500/20"
              >
                Browse Bikes
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/sell`}
                className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-all hover:bg-white/5"
              >
                Sell Your Bike
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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

          {/* Right: 3D Bike Model */}
          <div className="hidden lg:block flex-shrink-0 w-[48%] h-[85vh] relative">
            <BikeModelCanvas />
            {/* Bottom fade so bike blends with page */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
          </div>

        </div>
      </div>

      {/* Bottom page fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent z-20 pointer-events-none" />
    </section>
  )
}
