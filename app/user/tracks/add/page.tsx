"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { TravelDayData } from "@/types/geo"
import { LineStringProperties } from "@/lib/geoHelpers"
import { formatDateWithoutSpaces } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Map from "@/components/map"

import GPXInput from "./gpx-input"

export default function AddTrackPage() {
  const [unsuccessful, setUnsuccessful] = useState<string[]>([])
  const [travelDayDataList, setTravelDayDataList] = useState<TravelDayData[]>(
    []
  )
  const [showMap, setShowMap] = useState(false)
  const [fileReadCompleted, setFileReadCompleted] = useState(false)

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

  return (
    <div>
      {true && step === "show-map" ? (
        <div>
          <Map
            className="h-96"
            lineStrings={travelDayDataList.map((item) => {
              const lineString: GeoJSON.Feature<
                GeoJSON.LineString,
                LineStringProperties
              > = {
                geometry: item.lineString.geometry,
                properties: item.lineString.properties,
                type: "Feature",
                id: item.date.toString(),
                bbox: item.lineString?.bbox,
              }
              return lineString
            })}
          />
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
                  setShowMap(true)
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
