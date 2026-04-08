'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services' },
  { href: '/cars', label: 'Catalogue' },
  { href: '/booking', label: 'Réserver' },
  { href: '/account', label: 'Mon compte' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <header className="fixed w-full top-0 z-40 glass">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>SAM&apos;S</span><span className="text-secondary-500">CARS</span>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-gray-300 hover:text-white transition-colors uppercase tracking-wider"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors uppercase tracking-wider">
              Admin
            </Link>
          )}
          <Link href="/booking" className="btn-primary text-xs py-2 px-4 shadow-none">
            Prendre RDV
          </Link>
          <div className="h-5 w-px bg-white/20" />
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm font-semibold text-gray-300 hover:text-white transition-colors uppercase tracking-wider"
            >
              Déconnexion
            </button>
          ) : (
            <Link href="/auth/signin" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors uppercase tracking-wider">
              Connexion
            </Link>
          )}
          <div className="h-5 w-px bg-white/20" />
          <LocaleSwitcher />
        </nav>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="text-sm font-semibold text-gray-300 hover:text-white transition-colors uppercase tracking-wider"
                >
                  {item.label}
                </Link>
              ))}
              {isAdmin && (
                <Link href="/admin" onClick={closeMenu} className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors uppercase tracking-wider">
                  Admin
                </Link>
              )}
              <Link
                href="/booking"
                onClick={closeMenu}
                className="btn-primary text-xs py-2 px-4 shadow-none self-start"
              >
                Prendre RDV
              </Link>
              {session ? (
                <button
                  onClick={() => { closeMenu(); signOut({ callbackUrl: '/' }) }}
                  className="text-sm font-semibold text-gray-300 hover:text-white transition-colors uppercase tracking-wider text-left"
                >
                  Déconnexion
                </button>
              ) : (
                <Link href="/auth/signin" onClick={closeMenu} className="text-sm font-semibold text-gray-300 hover:text-white transition-colors uppercase tracking-wider">
                  Connexion
                </Link>
              )}
              <div className="flex justify-start">
                <LocaleSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
