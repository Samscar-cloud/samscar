"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShieldCheckIcon,
  StarIcon,
  ClockIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export function Hero() {
  const phoneNumber =
    process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "+32 470 00 00 00";

  return (
    <section className="relative text-white min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-garage.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-carbon-400/90 via-carbon-300/80 to-primary-700/40" />

      <div className="relative container mx-auto px-4 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 text-sm font-semibold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            Service Premium
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight"
        >
          Réparation Voiture <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500 drop-shadow-lg">
            Professionnelle
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl mb-10 text-gray-300 font-light max-w-2xl mx-auto"
        >
          Un service complet, transparent et ultra-rapide pour votre véhicule,
          sans compromis sur la qualité.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/booking"
            className="btn-primary text-lg w-full sm:w-auto text-center px-10 py-4 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            Réserver en ligne
          </Link>
          <a
            href={`tel:${phoneNumber}`}
            className="btn-secondary text-lg w-full sm:w-auto text-center px-10 py-4"
          >
            Appeler maintenant
          </a>
        </motion.div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-secondary-500" />
            <span>Garantie sur interventions</span>
          </div>
          <div className="flex items-center gap-2">
            <StarIcon className="w-5 h-5 text-secondary-500" />
            <span>98% satisfaction client</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-secondary-500" />
            <span>Diagnostic gratuit</span>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="mt-16 flex justify-center"
        >
          <ChevronDownIcon className="w-8 h-8 text-white opacity-80" />
        </motion.div>
      </div>
    </section>
  );
}
