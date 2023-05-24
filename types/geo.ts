import { Feature } from "maplibre-gl"

import { LineStringProperties } from "@/lib/geoHelpers"

export type FileData = {
  filename: string
  date: Date
  lineString: GeoJSON.Feature<GeoJSON.LineString, LineStringProperties>
}

export type TravelDayData = {
  date: Date
  lineString: GeoJSON.Feature<GeoJSON.LineString, LineStringProperties>
  fileData: FileData[]
  distance: number
}
