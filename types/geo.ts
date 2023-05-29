import { Track } from "@prisma/client"

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

export type PgLineString = {
  type: string
  coordinates: number[][]
}

export type TrackWithTrack = {
  track: PgLineString
} & Track

export type TrackWithoutProperties = Omit<Track, "properties">

// types for ts-to-zod

// export type BBox =
//   | [number, number, number, number]
//   | [number, number, number, number, number, number]

// export interface GeoJsonObject {
//   type: "LineString"
//   bbox?: BBox | undefined
// }

// export type Position = number[] // [number, number] | [number, number, number];

// export interface LineString extends GeoJsonObject {
//   type: "LineString"
//   coordinates: Position[]
// }

// export type FeatureWithLineString = {
//   type: "Feature"
//   id?: any
//   properties: {
//     [_: string]: any
//   }
//   geometry: LineString
// }
