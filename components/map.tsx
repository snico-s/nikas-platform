import { useEffect, useRef } from "react"
import maplibregl, { LngLatBounds } from "maplibre-gl"

import "node_modules/maplibre-gl/dist/maplibre-gl.css"
import { LineStringProperties } from "@/lib/geoHelpers"
import { cn, generateRandomString } from "@/lib/utils"

type newProps = {
  lineStrings?: GeoJSON.Feature<GeoJSON.LineString, LineStringProperties>[]
} & React.HTMLAttributes<HTMLDivElement>

const API_KEY = "9V8S1PVf6CfINuabJsSA"

export default function Map({ lineStrings, className, ...props }: newProps) {
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
        if (!map.current) return
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

  return (
    <div className={cn("relative h-96 w-full", className)} {...props}>
      <div id="map" ref={mapContainer} className="absolute h-full w-full" />
    </div>
  )
}
