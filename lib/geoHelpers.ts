import { gpx } from "@tmcw/togeojson"
// import simplify from "@turf/simplify"
// import truncate from "@turf/truncate"
import {
  Feature,
  GeoJsonProperties,
  LineString,
  MultiLineString,
  Position,
} from "geojson"

import { LineStringProperties, MultiLineStringProperties } from "@/types/geo"

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
  feature: GeoJSON.Feature<MultiLineString, MultiLineStringProperties>
): GeoJSON.Feature<LineString, LineStringProperties> | null => {
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
) => {
  const { prev: prevLS, new: newLS } = getConcatOrder(
    prevLineString,
    newLineString
  )

  const prevCoords = prevLS.geometry.coordinates
  const newCoords = newLS.geometry.coordinates

  const prevCoordTimes = prevLS.properties.coordinateProperties.times

  const newCoordTimes = newLS.properties?.coordinateProperties.times

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

function getConcatOrder(
  prevLineString: GeoJSON.Feature<LineString, LineStringProperties>,
  newLineString: GeoJSON.Feature<LineString, LineStringProperties>
) {
  let prevDate: Date | null = null
  let newDate: Date | null = null

  const prevTime = prevLineString.properties.time
  const newTime = newLineString.properties.time

  if (prevTime && newTime) {
    prevDate = new Date(prevTime)
    newDate = new Date(newTime)
  } else {
    const prevCoordTimes = prevLineString.properties.coordinateProperties.times
    const newCoordTimes = newLineString.properties.coordinateProperties.times

    if (prevCoordTimes.length === 0 || newCoordTimes.length === 0) {
      return { prev: prevLineString, new: newLineString }
    }

    const prevTimeString = prevCoordTimes.at(-1) //last
    const newTimeString = newCoordTimes.at(0) //first

    if (!prevTimeString || !newTimeString)
      return { prev: prevLineString, new: newLineString }

    prevDate = new Date(prevTimeString)
    newDate = new Date(newTimeString)
  }

  if (!prevDate || !newDate) return { prev: prevLineString, new: newLineString }

  if (prevDate.getTime() < newDate.getTime()) {
    return { prev: prevLineString, new: newLineString }
  } else {
    return { prev: newLineString, new: prevLineString }
  }
}

function addProperties(
  feature: Feature<LineString | MultiLineString, GeoJsonProperties>
): Feature<
  LineString | MultiLineString,
  LineStringProperties | MultiLineStringProperties
> {
  return {
    type: feature.type,
    geometry: feature.geometry,
    properties: {
      ...feature.properties,
      time: feature.properties?.time || "",
      coordinateProperties: {
        times: feature.properties?.coordinateProperties.times || [],
      },
    },
  }
}

export const gpxToLineString = (
  result: string
): GeoJSON.Feature<LineString, LineStringProperties> | null => {
  const gpxData = new DOMParser().parseFromString(result, "text/xml")
  const featureCollection = gpx(gpxData)

  const numberOfFeatures = featureCollection.features.length

  if (numberOfFeatures < 1) {
    return null
  }

  let time: string | null = null
  let coordinates: Position[] = []
  let times: string[] = []

  const allowedFeatures = ["LineString", "MultiLineString"]

  // Combine all Features from one FC to one LineString
  for (let j = 0; j < numberOfFeatures; j++) {
    const feature = featureCollection.features[j]
    const featureType = feature.geometry.type

    if (!allowedFeatures.includes(featureType)) continue

    const featureWithProperties = addProperties(
      feature as GeoJSON.Feature<
        LineString | MultiLineString,
        MultiLineStringProperties
      >
    )

    let lineStringFeature: GeoJSON.Feature<
      LineString,
      LineStringProperties
    > | null = null

    if (feature.geometry.type === "MultiLineString") {
      lineStringFeature = flatten(
        featureWithProperties as GeoJSON.Feature<
          MultiLineString,
          MultiLineStringProperties
        >
      )
    } else {
      lineStringFeature = featureWithProperties as GeoJSON.Feature<
        LineString,
        LineStringProperties
      >
    }

    if (!lineStringFeature) continue

    const coords = lineStringFeature.geometry.coordinates
    coordinates = coordinates.concat(coords)

    const coordTimes = lineStringFeature.properties.coordinateProperties.times
    times = times.concat(coordTimes)

    time = lineStringFeature.properties.time || new Date().toISOString()
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

  // const trunc = truncate(lineString)
  // const simplied = simplify(trunc)

  return lineString
}

function toSingleLineString(featureCollection: GeoJSON.FeatureCollection) {
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
