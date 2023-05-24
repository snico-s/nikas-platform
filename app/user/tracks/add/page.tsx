"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import length from "@turf/length"

import { TravelDayData } from "@/types/geo"
import { LineStringProperties } from "@/lib/geoHelpers"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import Map from "@/components/map"

import GPXInput from "./gpx-input"

export default function AddTrackPage() {
  const [unsuccessful, setUnsuccessful] = useState<string[]>([])
  const [travelDayDataList, setTravelDayDataList] = useState<TravelDayData[]>(
    []
  )
  const [fileReadCompleted, setFileReadCompleted] = useState(false)
  const [removedLayerIds, setRemovedLayerIds] = useState<string[]>([])

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const step = searchParams.get("step") || ""

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const { toast } = useToast()
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
      {step === "show-map" ? (
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
          <div className="h-96 md:h-[calc(100vh-4rem-1px)] md:w-1/3">
            <ScrollArea className="h-full w-full">
              {travelDayDataList
                .filter(filterDeleted)
                .sort(handleSort)
                .map((travelDayData, index) => (
                  <ol className="m-2" key={index}>
                    <TravelDayListItem
                      travelDayData={travelDayData}
                      handleDelete={handleDelete}
                    />
                  </ol>
                ))}
            </ScrollArea>
          </div>
        </div>
      ) : (
        <div className="container m-auto pb-8 pt-6 sm:w-3/5">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            GPX-File Upload
          </h1>
          <div>
            <div className="mt-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <GPXInput
                setUnsuccessful={setUnsuccessful}
                setTravelDayDataList={setTravelDayDataList}
                setFileReadCompleted={setFileReadCompleted}
              />
            </div>
            {fileReadCompleted && (
              <Button
                className="mt-4 w-full"
                onClick={() => {
                  setFileReadCompleted(false)
                  router.push(
                    pathname + "?" + createQueryString("step", "show-map")
                  )
                }}
                autoFocus={fileReadCompleted}
              >
                Show Me On The Map
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

type TravelDayListItemProps = {
  travelDayData: TravelDayData
  handleDelete: (travelDayData: TravelDayData) => void
}

function TravelDayListItem({
  travelDayData,
  handleDelete,
}: TravelDayListItemProps) {
  return (
    <li className="flex place-content-between items-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
      <div className="">
        <div className="text-sm font-medium">
          {travelDayData.date.toDateString()}
        </div>
        <div className="text-sm text-muted-foreground">
          Distance:{" "}
          {length(travelDayData.lineString, {
            units: "kilometers",
          }).toFixed(2)}
        </div>
      </div>

      <div>
        <Button
          className="px-2"
          variant={"ghost"}
          onClick={() => console.log("edit")}
        >
          <Icons.pencil width={16} height={16} />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          className="px-2"
          variant={"ghost"}
          onClick={() => handleDelete(travelDayData)}
        >
          <Icons.trash2 width={16} height={16} />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </li>
  )
}
