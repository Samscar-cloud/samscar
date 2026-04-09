"use client";

import type { ComponentType, SVGProps } from 'react'
import Link from "next/link";
import { motion } from "framer-motion";

interface ServiceCardProps {
  readonly name: string
  readonly icon: ComponentType<SVGProps<SVGSVGElement>>
  readonly slug: string
}

export function ServiceCard({ name, icon: Icon, slug }: ServiceCardProps) {
  return (
    <Link href={`/services/${slug}`} className="block h-full">
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="group h-full rounded-3xl border border-gray-200 bg-white p-8 text-left shadow-sm transition-all duration-300 hover:shadow-lg"
      >
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900">{name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          Service professionnel pour {name.toLowerCase()} avec garantie de
          qualité.
        </p>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-all duration-300 group-hover:translate-x-1">
          <span>En savoir plus</span>
          <span aria-hidden="true">→</span>
        </div>
      </motion.div>
    </Link>
  );
}
