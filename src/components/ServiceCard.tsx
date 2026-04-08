'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface ServiceCardProps {
  name: string
  icon: string
  slug: string
}

export function ServiceCard({ name, icon, slug }: ServiceCardProps) {
  return (
    <Link href={`/services/${slug}`} className="block h-full cursor-pointer">
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="glass-card p-8 h-full flex flex-col items-center text-center group border border-transparent hover:border-primary-500/30"
      >
        <div className="text-5xl mb-6 bg-carbon-300 p-4 rounded-2xl shadow-inner shadow-black/50 text-secondary-500 group-hover:text-primary-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{name}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Service professionnel pour {name.toLowerCase()} avec garantie de qualité.
        </p>
      </motion.div>
    </Link>
  )
}