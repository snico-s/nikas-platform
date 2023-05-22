import { rejects } from "assert"
import { gpx } from "@tmcw/togeojson"
import simplify from "@turf/simplify"
import truncate from "@turf/truncate"
import {
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  LineString,
  MultiLineString,
  Position,
} from "geojson"

export type iProperties = GeoJsonProperties & {
  time: string
}

export type MultiLineStringProperties = iProperties & {
  coordinateProperties: { times: string[][] }
}

export type LineStringProperties = iProperties & {
  coordinateProperties: { times: string[] }
}

export const fromMultiLineToLineString = (
  feature: GeoJSON.Feature<MultiLineString>
) => {
  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: feature.geometry.coordinates.flat(),
    },
    properties: feature.properties,
  }
}

const flatten = (
  feature: GeoJSON.Feature<
    Geometry,
    LineStringProperties | MultiLineStringProperties
  >
): GeoJSON.Feature<LineString, LineStringProperties> | null => {
  if (feature.geometry.type === "LineString")
    return feature as GeoJSON.Feature<LineString, LineStringProperties>

  if (feature.geometry.type === "MultiLineString") {
    const flatCoordinates = feature.geometry.coordinates.flat()
    const flatTimesProperties =
      feature.properties.coordinateProperties.times.flat()
    const newFeature: GeoJSON.Feature<LineString, LineStringProperties> = {
      ...feature,
      geometry: {
        type: "LineString",
        coordinates: flatCoordinates,
      },
      properties: {
        ...feature.properties,
        coordinateProperties: { times: flatTimesProperties },
      },
    }
    return newFeature
  }
  return null
}

export const concatLineStrings = (
  prevLineString: GeoJSON.Feature<LineString, LineStringProperties>,
  newLineString: GeoJSON.Feature<LineString, LineStringProperties>
): GeoJSON.Feature<LineString, LineStringProperties> => {
  const prevCoords = prevLineString.geometry.coordinates
  const newCoords = newLineString.geometry.coordinates
  const prevCoordTimes = prevLineString.properties.coordinateProperties.times
  const newCoordTimes = newLineString.properties.coordinateProperties.times

  const last = prevCoordTimes.at(-1)
  const first = newCoordTimes.at(0)

  if (!last || !first) return prevLineString

  const lastDate = new Date(last)
  const firstDate = new Date(first)

  let coordinates: Position[] = []
  let times: string[] = []

  if (lastDate.getTime() < firstDate.getTime()) {
    coordinates = prevCoords.concat(newCoords)
    times = prevCoordTimes.concat(newCoordTimes)
  } else {
    coordinates = newCoords.concat(prevCoords)
    times = newCoordTimes.concat(prevCoordTimes)
  }

  const lineString = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates,
    },
    properties: {
      ...prevLineString.properties,
      coordinateProperties: {
        times,
      },
    },
  } as GeoJSON.Feature<LineString, LineStringProperties>

  return lineString
}

export const gpxToLineString = (
  result: string
): GeoJSON.Feature<LineString, LineStringProperties> | null => {
  const fc: FeatureCollection<Geometry, GeoJsonProperties> = gpx(
    new DOMParser().parseFromString(result, "text/xml")
  )

  const numberOfFeatures = fc.features.length

  if (numberOfFeatures < 1) {
    return null
  }

  let time = ""
  let coordinates: Position[] = []
  let times: string[] = []

  // Combine all Features from one FC to one LineString
  for (let j = 0; j < numberOfFeatures; j++) {
    const feature = flatten(
      fc.features[j] as GeoJSON.Feature<
        Geometry,
        LineStringProperties | MultiLineStringProperties
      >
    )

    if (!feature) continue

    const coords = feature.geometry.coordinates
    coordinates = coordinates.concat(coords)

    const coordTimes = feature.properties.coordinateProperties.times
    times = times.concat(coordTimes)

    if (time === "") {
      time = feature.properties.time
    }
  }

  const lineString = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates,
    },
    properties: {
      time,
      coordinateProperties: {
        times,
      },
    },
  } as GeoJSON.Feature<LineString, LineStringProperties>

  const trunc = truncate(lineString)
  const simplied = simplify(trunc)

  return lineString
}

export const asyncGpxToLineString = (input: string) => {
  return new Promise((resolve, reject) => {
    const result = gpxToLineString(input)
    resolve(result)
  })
}
