"use client"

import { Dispatch, SetStateAction, useState } from "react"

import { FileData, TravelDayData } from "@/types/geo"
import { concatLineStrings, gpxToLineString } from "@/lib/geoHelpers"
import { sameDate } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

type Props = {
  setUnsuccessful: Dispatch<SetStateAction<string[]>>
  setTravelDayDataList: Dispatch<SetStateAction<TravelDayData[]>>
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

    const lineString = gpxToLineString(event.target.result)

    if (lineString === null) {
      return setUnsuccessful((prev) => [...prev, file.name])
    }

    const time = lineString.properties.time
    const date = new Date(time.slice(0, 10))

    const routeFileData: FileData = {
      filename: file.name,
      date,
      lineString,
    }

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
            date,
            lineString,
            fileData: [routeFileData],
          },
        ]
      }

      const next: TravelDayData[] = prev.map((item) => {
        if (!sameDate(item.date, date)) return item

        const newLineString = concatLineStrings(item.lineString, lineString)
        return {
          ...item,
          lineString: newLineString,
          fileData: [...item.fileData, routeFileData],
        }
      })

      return next
    })

    console.log(lineString)
  }

  return (
    <div>
      <form>
        <Label htmlFor="terms">Choose one ore more GPX-Files</Label>
        <Input
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
