'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { ThreeElements } from '@react-three/fiber'
import { Torus, Box, Sphere, Cylinder, Float, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { ChevronDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'

function BikeModel() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef} scale={1.5}>
      {/* Front wheel */}
      <Torus args={[1, 0.08, 8, 32]} position={[1.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#FF4D00" wireframe />
      </Torus>
      {/* Front wheel spokes */}
      <Torus args={[0.6, 0.03, 4, 16]} position={[1.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#FF6B30" wireframe />
      </Torus>
      {/* Rear wheel */}
      <Torus args={[1, 0.08, 8, 32]} position={[-1.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#FF4D00" wireframe />
      </Torus>
      {/* Rear wheel spokes */}
      <Torus args={[0.6, 0.03, 4, 16]} position={[-1.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#FF6B30" wireframe />
      </Torus>
      {/* Frame - main tube top */}
      <Box args={[3.2, 0.08, 0.08]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#FF8C42" />
      </Box>
      {/* Frame - down tube */}
      <Box args={[2.2, 0.08, 0.08]} position={[0.3, -0.2, 0]} rotation={[0, 0, -0.4]}>
        <meshStandardMaterial color="#FF8C42" />
      </Box>
      {/* Seat tube */}
      <Cylinder args={[0.05, 0.05, 1.3, 8]} position={[-0.5, 0.2, 0]} rotation={[0, 0, 0.15]}>
        <meshStandardMaterial color="#FF8C42" />
      </Cylinder>
      {/* Fork */}
      <Cylinder args={[0.05, 0.05, 1.3, 8]} position={[1.3, 0.1, 0]} rotation={[0, 0, -0.25]}>
        <meshStandardMaterial color="#FF8C42" />
      </Cylinder>
      {/* Chain stay */}
      <Box args={[2.0, 0.06, 0.06]} position={[0, -0.9, 0]}>
        <meshStandardMaterial color="#FF8C42" />
      </Box>
      {/* Handlebars */}
      <Box args={[0.7, 0.08, 0.08]} position={[1.55, 1.1, 0]}>
        <meshStandardMaterial color="#00D4AA" />
      </Box>
      {/* Stem */}
      <Cylinder args={[0.04, 0.04, 0.6, 8]} position={[1.5, 0.8, 0]}>
        <meshStandardMaterial color="#00D4AA" />
      </Cylinder>
      {/* Saddle */}
      <Box args={[0.55, 0.06, 0.18]} position={[-0.75, 1.35, 0]}>
        <meshStandardMaterial color="#00D4AA" />
      </Box>
      {/* Seat post */}
      <Cylinder args={[0.04, 0.04, 0.5, 8]} position={[-0.7, 1.05, 0]}>
        <meshStandardMaterial color="#00D4AA" />
      </Cylinder>
      {/* Pedal crank */}
      <Sphere args={[0.12, 8, 8]} position={[-0.1, -0.9, 0]}>
        <meshStandardMaterial color="#FF4D00" emissive="#FF4D00" emissiveIntensity={0.3} />
      </Sphere>
    </group>
  )
}

function FloatingParticle({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)
  const speed = 0.3 + Math.random() * 0.5
  const offset = Math.random() * Math.PI * 2

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + offset) * 0.3
      ref.current.rotation.x = state.clock.elapsedTime * 0.5
      ref.current.rotation.z = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.05, 0]} />
      <meshStandardMaterial color="#FF4D00" emissive="#FF4D00" emissiveIntensity={0.8} />
    </mesh>
  )
}

function Scene() {
  const particles: [number, number, number][] = [
    [-4, 2, -2], [4, -1, -3], [-3, -2, -1], [5, 2, -2],
    [-5, 1, -4], [3, 3, -3], [-2, -3, -2], [4, -2, -4],
    [0, 3, -3], [-4, 0, -3],
  ]

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#FF4D00" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#00D4AA" />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#ffffff" />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <BikeModel />
      </Float>
      {particles.map((pos, i) => (
        <FloatingParticle key={i} position={pos} />
      ))}
    </>
  )
}

function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      className="absolute inset-0"
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
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
