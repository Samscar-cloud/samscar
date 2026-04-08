import Link from 'next/link'

export function CTA() {
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? '+32 470 00 00 00'

  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Prêt à réserver votre service ?</h2>
        <p className="text-xl mb-8">Réservez en ligne ou appelez-nous maintenant</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/booking" className="btn-secondary text-lg px-8 py-3">
            Réserver en ligne
          </Link>
          <a href={`tel:${phoneNumber}`} className="btn-accent text-lg px-8 py-3">
            Appeler maintenant
          </a>
        </div>
      </div>
    </section>
  )
}