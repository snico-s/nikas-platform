"use client"

import { Dispatch, SetStateAction, useState } from "react"
import length from "@turf/length"
import cuid from "cuid"

import { concatLineStrings, gpxToLineString } from "@/lib/geoHelpers"
import { sameDate } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CreateTrack } from "@/app/track/add/page"

type Props = {
  setUnsuccessful: Dispatch<SetStateAction<string[]>>
  setTravelDayDataList: Dispatch<SetStateAction<CreateTrack[]>>
  setFileReadCompleted: Dispatch<SetStateAction<boolean>>
}

export default function GPXInput({
  setUnsuccessful,
  setTravelDayDataList,
  setFileReadCompleted,
}: Props) {
  const [progress, setProgress] = useState(0)
  const [showProgress, setShowProgress] = useState(false)

  const handleGpxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files === null || files.length < 1) {
      return console.error("Error: No Files")
    }

    const totalFiles = files.length

    setShowProgress(true)
    setProgress(0)
    setTravelDayDataList([])
    setFileReadCompleted(false)
    let handledFiles = 0

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.readAsText(file, "UTF-8")

      reader.onload = (e) => handleFileRead(e, file)

      reader.onloadend = () => {
        handledFiles++
        const progressPercentage = Math.floor((handledFiles / totalFiles) * 100)
        setProgress(progressPercentage)
        if (handledFiles === files.length) {
          setFileReadCompleted(true)
        }
      }

      reader.onerror = function (evt) {
        console.error("Fehler beim lesen")
      }
    })
  }

  function handleFileRead(event: ProgressEvent<FileReader>, file: File) {
    if (event.target === null || typeof event.target.result !== "string") {
      return console.error("Error: Reading Error")
    }

    // generate one single LineString from input-file
    const lineString = gpxToLineString(event.target.result)

    if (lineString === null) {
      return setUnsuccessful((prev) => [...prev, file.name])
    }

    const time = lineString.properties.time
    const date = new Date(time.slice(0, 10))
    const distance = Math.round(length(lineString) * 100) / 100

    setTravelDayDataList((prev) => {
      const dateExists =
        prev.findIndex((item) => {
          return sameDate(item.date, date)
        }) > -1

      // new Entry, if Date not exists
      if (prev.length === 0 || !dateExists) {
        return [
          ...prev,
          {
            id: cuid(),
            date,
            track: lineString,
            distance: distance,
          },
        ]
      }

      const next: CreateTrack[] = prev.map((item) => {
        if (!sameDate(item.date, date)) return item

        const newDistance = item.distance + distance
        const newLineString = concatLineStrings(item.track, lineString)
        if (!newLineString) {
          return { ...item }
          setUnsuccessful((prev) => [...prev, file.name])
        }

        return {
          ...item,
          track: newLineString,
          distance: newDistance,
        }
      })

      return next
    })
  }

  return (
    <div>
      <form>
        <Label htmlFor="gpx">Choose one ore more GPX-Files</Label>
        <Input
          className="mt-2"
          type="file"
          name="gpx"
          onChange={handleGpxInput}
          accept=".gpx"
          multiple
        />
      </form>
      {showProgress && (
        <div>
          <Progress value={progress} className="mt-4" />
          <div>{progress} %</div>
        </div>
      )}
    </div>
  )
}
