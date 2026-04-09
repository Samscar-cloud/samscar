import {
  ShieldCheckIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Premier diagnostic gratuit",
    description:
      "Lors de votre visite chez Sam's cars, un premier diagnostic GRATUIT sera effectué sur votre véhicule afin de prioriser le travail.",
    icon: WrenchScrewdriverIcon,
  },
  {
    name: "Avec ou sans rendez-vous",
    description:
      "Pour les petits travaux et si notre agenda le permet, nous prenons directement votre voiture en charge !",
    icon: ClockIcon,
  },
  {
    name: "Garanties constructeurs",
    description:
      "Nous respectons les garanties constructeurs et utilisons des pièces approuvées pour votre sécurité.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Une équipe de passionnés",
    description:
      "De véritables passionnés de mécanique à votre écoute pour vous accompagner et vous conseiller.",
    icon: HeartIcon,
  },
];

export function Features() {
  return (
    <div className="bg-carbon-300 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-secondary-500">
            Pourquoi nous choisir ?
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Votre atelier de réparation automobile réparant toutes marques à
            Hotton
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Une équipe professionnelle, jeune et dynamique. Votre sécurité est
            notre objectif principal.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative pl-16 group hover:bg-white/5 rounded-xl p-4 transition-all duration-300 border-l-2 border-transparent hover:border-secondary-500"
              >
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-300">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
