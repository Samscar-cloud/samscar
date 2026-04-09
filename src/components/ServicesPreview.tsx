import Link from "next/link";
import { ServiceCard } from "./ServiceCard";

const services = [
  { name: "Moteur", slug: "engine" },
  { name: "Transmission", slug: "transmission" },
  { name: "Freins", slug: "brakes" },
  { name: "Suspension", slug: "suspension" },
  { name: "Électrique", slug: "electrical" },
  { name: "Carrosserie", slug: "bodywork" },
];

export function ServicesPreview() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-base font-semibold text-primary-500 uppercase tracking-widest mb-3">
            Ce que nous faisons
          </p>
          <h2 className="text-4xl font-black text-gray-900">Nos Services</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Toutes marques, toutes pannes. Nous intervenons sur l&apos;ensemble
            des systèmes de votre véhicule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {services.map((service) => (
            <ServiceCard key={service.slug} {...service} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/services" className="btn-primary">
            Voir tous les services
          </Link>
        </div>
      </div>
    </section>
  );
}
