import { NextResponse } from "next/server"
import { Prisma, Track } from "@prisma/client"
import { getServerSession } from "next-auth"
import * as z from "zod"

import { PgLineString, TrackWithTrack } from "@/types/geo"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

const routeContextSchema = z.object({
  params: z.object({
    trackId: z.string(),
  }),
})

type SqlReturnTypeWithoutTrackAndProperties = {
  created_at: Date
  created_by: string | null
} & Omit<Track, "createdAt" | "createdBy">

type SqlReturnTypeWithTrack = {
  track: PgLineString
  properties: Prisma.JsonValue
} & SqlReturnTypeWithoutTrackAndProperties

export async function GET(
  _req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.trackId))) {
      return new Response(null, { status: 403 })
    }

    const result = await prisma.$queryRaw<
      SqlReturnTypeWithTrack[]
    >`SELECT id, properties, created_by, created_at, ST_AsGeoJSON(track)::jsonb as track
    FROM "Track" WHERE id = ${params.trackId}`

    const res: TrackWithTrack[] = result.map((item) => ({
      id: item.id,
      createdAt: item.created_at,
      createdBy: item.created_by,
      date: item.date,
      properties: item.properties,
      track: item.track,
      distance: item.distance,
    }))

    return NextResponse.json(res)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.trackId))) {
      return new Response(null, { status: 403 })
    }

    // Delete the post.
    await prisma.track.delete({
      where: {
        id: params.trackId as string,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToPost(postId: string) {
  const session = await getServerSession(authOptions)
  const count = await prisma.track.count({
    where: {
      id: postId,
      createdBy: session?.user.id,
    },
  })

  return count > 0
}
