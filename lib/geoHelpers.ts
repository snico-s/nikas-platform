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
  prevLineString: GeoJSON.Feature<
    LineString,
    LineStringProperties | GeoJsonProperties
  >,
  newLineString: GeoJSON.Feature<
    LineString,
    LineStringProperties | GeoJsonProperties
  >
) => {
  const { prev: prevLS, new: newLS } = getConcatOrder(
    prevLineString,
    newLineString
  )

  if (
    prevLineString.properties?.coordinateProperties.times &&
    newLineString.properties?.coordinateProperties.times
  ) {
    const prevCoords = prevLS.geometry.coordinates
    const newCoords = newLS.geometry.coordinates

    const prevCoordTimes = prevLS.properties?.coordinateProperties
      .times as string[]

    const newCoordTimes = newLS.properties?.coordinateProperties
      .times as string[]

    const coordinates = prevCoords.concat(newCoords)
    const times = prevCoordTimes.concat(newCoordTimes)

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
}

function getConcatOrder(
  prevLineString: GeoJSON.Feature<
    LineString,
    LineStringProperties | GeoJsonProperties
  >,
  newLineString: GeoJSON.Feature<
    LineString,
    LineStringProperties | GeoJsonProperties
  >
) {
  if (
    !prevLineString.properties?.coordinateProperties.times ||
    !newLineString.properties?.coordinateProperties.times
  ) {
    return { prev: prevLineString, new: newLineString }
  }

  const prevCoordTimes = prevLineString.properties.coordinateProperties
    .times as string[]

  const newCoordTimes = newLineString.properties.coordinateProperties
    .times as string[]

  const prevTimeString = prevCoordTimes.at(-1) //last
  const newTimeString = newCoordTimes.at(0) //first

  if (!prevTimeString || !newTimeString)
    return { prev: prevLineString, new: newLineString }

  const prevDate = new Date(prevTimeString)
  const newDate = new Date(newTimeString)

  if (prevDate.getTime() < newDate.getTime()) {
    return { prev: prevLineString, new: newLineString }
  } else {
    return { prev: newLineString, new: prevLineString }
  }
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

export function toSingleLineString(
  featureCollection: GeoJSON.FeatureCollection
) {
  const coordinates: Position[] = featureCollection.features.reduce(
    (acc, feature) => {
      const geometry = feature.geometry
      if (geometry.type === "MultiLineString") {
        return acc.concat(geometry.coordinates.flat())
      } else if (geometry.type === "LineString") {
        return acc.concat(geometry.coordinates)
      }
      return acc
    },
    [] as Position[]
  )
  const lineString: GeoJSON.LineString = {
    type: "LineString",
    coordinates,
  }
  return lineString
}

export function getDateFromFeature(feature: GeoJSON.Feature) {
  if (feature.properties && feature.properties.time) {
    const time = feature.properties.properties.time
    return new Date(time.slice(0, 10))
  }
  return null
}

export function makeFeature(
  lineString: GeoJSON.LineString,
  properties?: GeoJSON.GeoJsonProperties,
  id?: string
): GeoJSON.Feature<GeoJSON.LineString, GeoJSON.GeoJsonProperties> {
  return {
    type: "Feature",
    properties: properties || {},
    geometry: lineString,
    id: id || "",
  }
}
