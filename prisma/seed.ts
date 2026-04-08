import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPasswordPlain = process.env.ADMIN_PASSWORD || 'change-me-to-a-strong-password'
  const adminPassword = await bcrypt.hash(adminPasswordPlain, 10)

  console.log('⛑️ Admin password:', adminPasswordPlain)

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      role: 'ADMIN',
      password: adminPassword,
    },
  })

  const services = [
    {
      name: 'Révision complète',
      description: 'Inspection complète et maintenance générale du véhicule.',
      price: 120,
      category: 'Maintenance',
      slug: 'revision-complete',
    },
    {
      name: 'Réparation moteur',
      description: 'Diagnostic et réparation du moteur.',
      price: 450,
      category: 'Moteur',
      slug: 'reparation-moteur',
    },
    {
      name: 'Changement des freins',
      description: 'Remplacement des plaquettes et disques de frein.',
      price: 220,
      category: 'Freins',
      slug: 'changement-freins',
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    })
  }

  console.log('✅ Seed data created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
