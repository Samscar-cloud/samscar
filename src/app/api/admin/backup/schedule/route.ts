import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin'
import fs from 'fs/promises'
import path from 'path'

const BACKUP_DIR = path.join(process.cwd(), 'backups')
const STATUS_FILE = path.join(BACKUP_DIR, 'backup-status.json')

async function writeBackupStatus(status: { lastBackupAt: string; ok: boolean; path?: string; error?: string }) {
  await fs.mkdir(BACKUP_DIR, { recursive: true })
  await fs.writeFile(STATUS_FILE, JSON.stringify(status, null, 2), 'utf-8')
}

async function readBackupStatus() {
  try {
    const content = await fs.readFile(STATUS_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const timestamp = new Date().toISOString()

  try {
    const [users, services, vehicles, bookings, listings, testDriveRequests] = await Promise.all([
      prisma.user.findMany(),
      prisma.service.findMany(),
      prisma.vehicle.findMany(),
      prisma.booking.findMany(),
      prisma.listing.findMany(),
      prisma.testDriveRequest.findMany(),
    ])

    const backup = {
      createdAt: timestamp,
      users,
      services,
      vehicles,
      bookings,
      listings,
      testDriveRequests,
    }

    const filename = `backup-${timestamp.slice(0, 10)}-${Date.now()}.json`
    const filePath = path.join(BACKUP_DIR, filename)
    await fs.mkdir(BACKUP_DIR, { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(backup, null, 2), 'utf-8')

    await writeBackupStatus({ lastBackupAt: timestamp, ok: true, path: filePath })

    return NextResponse.json({ ok: true, backupPath: filePath })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await writeBackupStatus({ lastBackupAt: timestamp, ok: false, error: message })
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  // Allow cron scheduler to call via POST too
  return GET(request)
}
