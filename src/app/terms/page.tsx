export const metadata = {
  title: "Conditions d'utilisation | Auto Service",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">{"Conditions d'utilisation"}</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Objet</h2>
          <p>
            Les présentes conditions régissent l&apos;utilisation du service de prise de rendez-vous en
            ligne proposé par Auto Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Prise de rendez-vous</h2>
          <p>
            La réservation en ligne est confirmée par e-mail. En cas d&apos;annulation, merci de nous
            prévenir au moins 24 heures à l&apos;avance par téléphone ou via votre espace client.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Responsabilité</h2>
          <p>
            Auto Service s&apos;engage à réaliser les prestations dans les règles de l&apos;art. Toute
            réclamation doit être formulée dans les 48 heures suivant la prestation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Tarifs</h2>
          <p>
            Les tarifs affichés sont indicatifs et peuvent varier selon l&apos;état du véhicule et les
            pièces nécessaires. Un devis définitif est établi après diagnostic.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Droit applicable</h2>
          <p>
            Les présentes conditions sont soumises au droit français. Tout litige relève de la
            compétence des tribunaux du ressort du siège social d&apos;Auto Service.
          </p>
        </section>
      </div>
    </div>
  )
}
