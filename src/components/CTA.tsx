import Link from "next/link";

export function CTA() {
  const phoneNumber =
    process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "+32 470 00 00 00";

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800">
      <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]" />
      <div className="relative container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-left max-w-2xl">
            <h2 className="text-4xl font-black text-white mb-4">
              Prêt à nous confier votre véhicule ?
            </h2>
            <p className="text-primary-200 text-lg">
              Réservez en 2 minutes. Diagnostic gratuit à l'arrivée.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/booking"
              className="btn-secondary text-lg px-8 py-4 shadow-lg shadow-black/10"
            >
              Réserver en ligne
            </Link>
            <a
              href={`tel:${phoneNumber}`}
              className="btn-accent text-lg px-8 py-4 shadow-lg shadow-black/20"
            >
              Appeler maintenant
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
