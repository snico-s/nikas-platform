"use client"

import { useState } from "react"

import { TravelDayData } from "@/types/geo"
import { Button } from "@/components/ui/button"

import GPXInput from "./gpx-input"

export default function AddTrackPage() {
  const [unsuccessful, setUnsuccessful] = useState<string[]>([])
  const [travelDayDataList, setTravelDayDataList] = useState<TravelDayData[]>(
    []
  )
  const [fileReadCompleted, setFileReadCompleted] = useState(false)

  return (
    <div className="container pb-8 pt-6">
      <div className="m-auto sm:w-3/5">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          GPX-File Upload
        </h1>
        <div className="mt-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <GPXInput
            setUnsuccessful={setUnsuccessful}
            setTravelDayDataList={setTravelDayDataList}
            setFileReadCompleted={setFileReadCompleted}
          />
        </div>
        {fileReadCompleted && (
          <Button className="mt-4 w-full">Show Me On The Map</Button>
        )}
      </div>
    </div>
  )
}
