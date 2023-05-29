"use client"

import { useEffect, useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { TravelDayData } from "@/types/geo"
import { LineStringProperties } from "@/lib/geoHelpers"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import GPXInput from "@/components/gpx-input"
import { Icons } from "@/components/icons"
import Map from "@/components/map"
import TravelDayListItem from "@/components/travel-day-list-item"

export default function AddTrackPage() {
  const [unsuccessful, setUnsuccessful] = useState<string[]>([])
  const [travelDayDataList, setTravelDayDataList] = useState<TravelDayData[]>(
    []
  )
  const [fileReadCompleted, setFileReadCompleted] = useState(false)
  const [removedLayerIds, setRemovedLayerIds] = useState<string[]>([])
  const [upload, setUpload] = useState(false)

  const [uploading, setUploading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (upload && travelDayDataList.length === 0) router.push("/user/tracks/")
  }, [travelDayDataList, upload, router])

  const { data: session } = useSession()

  const { toast } = useToast()

  if (!session) {
    redirect("/signin")
  }
  const handleDelete = (travelDayData: TravelDayData) => {
    const id = travelDayData.date.toString()

    toast({
      title: "Delete Item from List",
      description: `Deleted: ${travelDayData.date.toDateString()}`,
      action: (
        <ToastAction altText="Undo" onClick={() => handleUndo(id)}>
          Undo
        </ToastAction>
      ),
      variant: "destructive",
    })

    setRemovedLayerIds([...removedLayerIds, id])
  }

  const handleUndo = (id: string) => {
    setRemovedLayerIds(removedLayerIds.filter((item) => item !== id))
  }

  const filterDeleted = (travelDayData: TravelDayData) => {
    const id = travelDayData.date.toString()
    return !removedLayerIds.includes(id)
  }

  const handleSort = (a: TravelDayData, b: TravelDayData) => {
    return a.date.getTime() - b.date.getTime()
  }

  return (
    <div>
      <div className="md:flex">
        <Map
          className="h-[calc(100vh-24rem-4rem-1px)] md:h-[calc(100vh-4rem-1px)] md:w-2/3"
          lineStrings={travelDayDataList.map((travelDayData) => {
            const lineString: GeoJSON.Feature<
              GeoJSON.LineString,
              LineStringProperties
            > = {
              geometry: travelDayData.lineString.geometry,
              properties: travelDayData.lineString.properties,
              type: "Feature",
              id: travelDayData.date.toString(),
              bbox: travelDayData.lineString?.bbox,
            }
            return lineString
          })}
          removedLayerIds={removedLayerIds}
        />
        {fileReadCompleted ? (
          <div className="h-96 md:h-[calc(100vh-4rem-3.5rem-1px)] md:w-1/3">
            <div className=" grid h-14 place-items-center px-2">
              <Button
                className="w-full max-w-xs items-center"
                disabled={uploading}
                onClick={() => {
                  setUploading(true)
                  setTimeout(() => {
                    setUpload(true)
                  }, 500)
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
                  .filter(filterDeleted)
                  .sort(handleSort)
                  .map((travelDayData, index) => (
                    <TravelDayListItem
                      key={index}
                      travelDayData={travelDayData}
                      handleDelete={handleDelete}
                      setTravelDayDataList={setTravelDayDataList}
                      upload={upload}
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
