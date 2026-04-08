export const metadata = {
  title: 'Politique de confidentialité | Auto Service',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Collecte des données</h2>
          <p>
            Nous collectons les informations que vous nous fournissez lors de la prise de rendez-vous :
            nom, prénom, adresse e-mail, numéro de téléphone et informations sur votre véhicule.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Utilisation des données</h2>
          <p>
            Vos données sont utilisées exclusivement pour la gestion de vos rendez-vous, l&apos;envoi de
            confirmations et de rappels, ainsi que pour améliorer nos services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Cookies</h2>
          <p>
            Notre site utilise des cookies de session nécessaires au fonctionnement du service
            (authentification, sécurité). Aucun cookie publicitaire ou de tracking tiers n&apos;est utilisé.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Conservation des données</h2>
          <p>
            Vos données personnelles sont conservées pendant une durée maximale de 3 ans à compter
            du dernier contact, conformément à la réglementation en vigueur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Vos droits (RGPD)</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez
            d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité de vos données.
            Pour exercer ces droits, contactez-nous à l&apos;adresse indiquée ci-dessous.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Contact</h2>
          <p>
            Pour toute question relative à vos données personnelles :{' '}
            <a href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`} className="text-primary-600 hover:underline">
              {process.env.NEXT_PUBLIC_PHONE_NUMBER}
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
