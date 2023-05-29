import { redirect } from "next/navigation"
import { Track } from "@prisma/client"

import { TrackWithoutProperties } from "@/types/geo"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

type SqlReturnType = {
  created_at: Date
  created_by: string | null
} & Omit<Track, "createdAt" | "createdBy">

export async function getTracksForDashboard() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const result = await prisma.$queryRaw<
    SqlReturnType[]
  >`SELECT id, created_by, created_at, date
  FROM "Track" 
  WHERE created_by = ${user.id}`

  if (!result) return []

  const res: TrackWithoutProperties[] = result.map((item) => ({
    id: item.id,
    createdAt: item.created_at,
    createdBy: item.created_by,
    date: new Date(item.date),
  }))

  console.log(result)
  console.log(res)

  return res
}
