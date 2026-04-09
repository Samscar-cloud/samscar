import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Prendre RDV en Ligne | Sam's Cars Hotton",
  description: "Réservez votre rendez-vous en ligne chez Sam's Cars Hotton. Rapide, simple et gratuit. Disponible 24h/24.",
  keywords: ["rendez-vous garage", "réservation en ligne", "RDV mécanicien Hotton", "booking auto Belgique"],
  openGraph: {
    title: "Prendre RDV — Sam's Cars Hotton",
    description: "Réservez votre rendez-vous en ligne. Rapide, simple et gratuit.",
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
