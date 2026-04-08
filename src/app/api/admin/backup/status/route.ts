import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin'
import fs from 'fs/promises'
import path from 'path'

const BACKUP_DIR = path.join(process.cwd(), 'backups')
const STATUS_FILE = path.join(BACKUP_DIR, 'backup-status.json')

export async function GET() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const content = await fs.readFile(STATUS_FILE, 'utf-8')
    const status = JSON.parse(content)
    return NextResponse.json({ ok: true, status })
  } catch {
    return NextResponse.json({ ok: true, status: null })
  }
}
