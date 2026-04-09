import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Prendre RDV en Ligne | Sam's Cars Hotton",
  description: "Réservez votre rendez-vous en ligne chez Sam's Cars Hotton. Rapide, simple et gratuit. Disponible 24h/24.",
  keywords: ["rendez-vous garage", "réservation en ligne", "RDV mécanicien Hotton", "booking auto Belgique"],
  openGraph: {
    title: "Prendre RDV en Ligne — Garage Sam's Cars Hotton Belgique",
    description: "Réservez votre rendez-vous au garage Sam's Cars à Hotton en 2 minutes. Service rapide, diagnostic gratuit à l'arrivée, disponible du lundi au samedi.",
    url: "https://samscargarage.be/booking",
    siteName: "Sam's Cars",
    locale: "fr_BE",
    type: "website",
  },
  alternates: { canonical: "https://samscargarage.be/booking" },
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
