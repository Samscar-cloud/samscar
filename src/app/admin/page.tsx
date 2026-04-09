import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "EN ATTENTE",
  CONFIRMED: "CONFIRMÉ",
  COMPLETED: "TERMINÉ",
  CANCELLED: "ANNULÉ",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const [userCount, serviceCount, vehicleCount] = await Promise.all([
    prisma.user.count(),
    prisma.service.count(),
    prisma.vehicle.count(),
  ]);

  const bookingsCounts = await prisma.booking.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const bookingStatusCounts = bookingsCounts.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    },
    {},
  );

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const bookingsLast7Days = await prisma.booking.findMany({
    where: { createdAt: { gte: startDate } },
    orderBy: { createdAt: "asc" },
  });

  const bookingsByDay = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const label = d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
    return { label, date: d.toISOString().slice(0, 10), count: 0 };
  });

  for (const booking of bookingsLast7Days) {
    const dayKey = booking.createdAt.toISOString().slice(0, 10);
    const bucket = bookingsByDay.find((d) => d.date === dayKey);
    if (bucket) bucket.count += 1;
  }

  const maxBookingCount = Math.max(...bookingsByDay.map((d) => d.count), 1);

  return (
    <main className="min-h-screen bg-gray-100 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Utilisateurs</p>
            <p className="text-3xl font-semibold text-gray-900">{userCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Services</p>
            <p className="text-3xl font-semibold text-gray-900">
              {serviceCount}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-indigo-500">
            <p className="text-sm text-gray-500">Véhicules</p>
            <p className="text-3xl font-semibold text-gray-900">
              {vehicleCount}
            </p>
          </div>
        </div>

        <div className="mb-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Réservations par statut
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(
              (status) => (
                <a
                  key={status}
                  href={`/admin/bookings?status=${status}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <p className="text-sm text-gray-500">
                    {STATUS_LABELS[status]}
                  </p>
                  <p className="text-2xl font-semibold">
                    {bookingStatusCounts[status] ?? 0}
                  </p>
                </a>
              ),
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                Réservations (7 derniers jours)
              </h2>
              <p className="text-sm text-gray-500">
                Trend journalier des réservations
              </p>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {bookingsByDay.map((day) => (
              <div key={day.date} className="text-center">
                <div className="h-24 flex items-end justify-center mb-2">
                  <div
                    className="w-full bg-blue-500 rounded-t-lg"
                    style={{
                      height: `${(day.count / maxBookingCount) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-600">{day.label}</div>
                <div className="text-xs font-semibold">{day.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <a href="/admin/services" className="block">
              <CardHeader className="space-y-2 px-0">
                <CardTitle className="text-gray-900">Services</CardTitle>
                <CardDescription className="text-gray-600">
                  Ajouter / éditer / supprimer des services.
                </CardDescription>
              </CardHeader>
              <CardFooter className="px-0 pt-0">
                <Badge variant="secondary">Voir</Badge>
              </CardFooter>
            </a>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <a href="/admin/bookings" className="block">
              <CardHeader className="space-y-2 px-0">
                <CardTitle className="text-gray-900">Réservations</CardTitle>
                <CardDescription className="text-gray-600">
                  Voir, confirmer ou annuler les réservations.
                </CardDescription>
              </CardHeader>
              <CardFooter className="px-0 pt-0">
                <Badge variant="secondary">Voir</Badge>
              </CardFooter>
            </a>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <a href="/admin/users" className="block">
              <CardHeader className="space-y-2 px-0">
                <CardTitle className="text-gray-900">Clients</CardTitle>
                <CardDescription className="text-gray-600">
                  Voir les comptes utilisateurs.
                </CardDescription>
              </CardHeader>
              <CardFooter className="px-0 pt-0">
                <Badge variant="secondary">Voir</Badge>
              </CardFooter>
            </a>
          </Card>
        </div>
      </div>
    </main>
  );
}
