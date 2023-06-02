"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"

import { trackCreateSchema } from "@/types/zod"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import GPXInput from "@/components/gpx-input"
import { Icons } from "@/components/icons"
import Map from "@/components/map"
import TravelDayListItem from "@/components/travel-day-list-item"

export type CreateTrack = z.infer<typeof trackCreateSchema>

async function postTrack(data: CreateTrack) {
  const response = await fetch("/api/tracks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return response
}

export function AddTrack() {
  const [unsuccessful, setUnsuccessful] = useState<string[]>([])
  const [travelDayDataList, setTravelDayDataList] = useState<CreateTrack[]>([])
  const [fileReadCompleted, setFileReadCompleted] = useState(false)
  const [uploading, setUploading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSort = (a: CreateTrack, b: CreateTrack) => {
    return a.date.getTime() - b.date.getTime()
  }

  async function handleUpload() {
    const responseList = await Promise.all(
      travelDayDataList.map(async (data) => {
        const response = await postTrack(data)
        return response
      })
    )

    responseList.forEach((response) => {
      if (!response.ok) {
        return toast({
          title: "Something went wrong.",
          description: "Please refresh the page and try again.",
          variant: "destructive",
        })
      }
    })
    router.refresh()
    router.push("/user/tracks")
  }

  return (
    <div>
      <div className="md:flex">
        <Map
          className="h-[calc(100vh-24rem-4rem-1px)] md:h-[calc(100vh-4rem-1px)] md:w-2/3"
          lineStrings={
            fileReadCompleted
              ? travelDayDataList.map((travelDayData) => {
                  const lineString: GeoJSON.Feature<
                    GeoJSON.LineString,
                    GeoJSON.GeoJsonProperties
                  > = {
                    geometry: travelDayData.track.geometry,
                    properties: travelDayData.track.properties,
                    type: "Feature",
                    id: travelDayData.date.toString(),
                  }
                  return lineString
                })
              : []
          }
          fileReadCompleted={fileReadCompleted}
        />
        {fileReadCompleted ? (
          <div className="h-96 md:h-[calc(100vh-4rem-3.5rem-1px)] md:w-1/3">
            <div className=" grid h-14 place-items-center px-2">
              <Button
                className="w-full max-w-xs items-center"
                disabled={uploading}
                onClick={() => {
                  setUploading(true)
                  handleUpload()
                }}
              >
                {uploading ? (
                  <Icons.loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Icons.upload className="mr-2 h-4 w-4" /> Upload
                  </>
                )}
              </Button>
            </div>
            <ScrollArea className="h-full w-full">
              <ol className="m-2">
                {travelDayDataList
                  // .filter(filterDeleted)
                  .sort(handleSort)
                  .map((travelDayData, index) => (
                    <TravelDayListItem
                      key={index}
                      travelDayData={travelDayData}
                      setTravelDayDataList={setTravelDayDataList}
                    />
                  ))}
              </ol>
            </ScrollArea>
          </div>
        ) : (
          <div className="p-2">
            <h3 className="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
              GPX-Upload
            </h3>
            <GPXInput
              setUnsuccessful={setUnsuccessful}
              setTravelDayDataList={setTravelDayDataList}
              setFileReadCompleted={setFileReadCompleted}
            />
          </div>
        )}
      </div>
    </div>
  )
}
