import { Track } from "@prisma/client"
import cuid from "cuid"
import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { trackCreateSchema } from "@/types/zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

type TrackWithTrack = {
  track: {
    type: string
    coordinates: number[][]
  }
} & Track

export async function GET() {
  try {
    console.log("/api/track")
    const session = await getServerSession(authOptions)
    // if (!session) {
    //   return new Response("Unauthorized", { status: 403 })
    // }

    // const { user } = session

    const result = await prisma.$queryRaw<
      TrackWithTrack[]
    >`SELECT id, properties, createdBy, createdAt, ST_AsGeoJSON(track)::jsonb as track FROM "Track"`

    if (!result) return new Response(null, { status: 500 })

    return new Response(JSON.stringify({ result }))
  } catch (error) {
    console.error(error)
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    console.log("POST api/track/")

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session

    const json = await req.json()
    console.log(json)
    const readyToParse = { ...json, date: new Date(json.date) }
    const body = trackCreateSchema.parse(readyToParse)

    const newId = cuid()
    const lineString = body.track.geometry

    const result = await prisma.$queryRaw`
        INSERT into "Track" (id, dat, created_by, properties, track)
        values (
          ${newId}, 
          ${body.date},
          ${user.id},
          ${body.track.properties} ,
          ST_GeomFromGeoJSON(${lineString})
        )
     `

    return new Response(JSON.stringify(result))
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}