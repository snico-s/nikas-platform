import { useEffect, useRef } from "react"
import maplibregl, { LngLatBounds } from "maplibre-gl"

import "node_modules/maplibre-gl/dist/maplibre-gl.css"
import { LineStringProperties } from "@/lib/geoHelpers"
import { cn, generateRandomString } from "@/lib/utils"

type Props = {
  lineStrings?: GeoJSON.Feature<GeoJSON.LineString, LineStringProperties>[]
  removedLayerIds?: string[]
} & React.HTMLAttributes<HTMLDivElement>

const API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY

export default function Map({
  lineStrings,
  removedLayerIds,
  className,
  ...props
}: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (map.current || !mapContainer.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
    })
    map.current.addControl(new maplibregl.NavigationControl({}))
  }, [])

  useEffect(() => {
    if (!map.current) return
    map.current.on("load", () => {
      if (!map.current || !lineStrings || lineStrings.length === 0) return
      const bounds = new LngLatBounds()

      for (const lineString of lineStrings) {
        addGeoJsonToMap(lineString, map.current)

        lineString.geometry.coordinates.forEach((coordinate) => {
          bounds.extend([coordinate[0], coordinate[1]])
        })
      }

      map.current.fitBounds(bounds, { padding: 20 })
    })
  }, [lineStrings])

  function addGeoJsonToMap(geoJson: GeoJSON.Feature, map: maplibregl.Map) {
    const id = geoJson.id?.toString() || generateRandomString()

    console.log("Hier")
    console.log(map.getLayer(id))
    if (map.getLayer(id)) return

    map.addSource(id, {
      type: "geojson",
      data: geoJson.geometry,
    })

    map.addLayer({
      id: id,
      type: "line",
      source: id,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#888",
        "line-width": 4,
      },
    })
  }

  useEffect(() => {
    if (!map.current || !map.current.loaded() || !removedLayerIds) return
    if (!lineStrings) return

    for (const lineString of lineStrings) {
      addGeoJsonToMap(lineString, map.current)
    }

    for (const id of removedLayerIds) {
      if (map.current.getLayer(id)) map.current.removeLayer(id)
      if (map.current.getSource(id)) map.current.removeSource(id)
    }
  }, [removedLayerIds, lineStrings])

  return (
    <div className={cn("relative h-96 w-full", className)} {...props}>
      <div id="map" ref={mapContainer} className="absolute h-full w-full" />
    </div>
  )
}
