import { useEffect, useRef, useState } from "react"
import maplibregl, { LngLatBounds } from "maplibre-gl"

import "node_modules/maplibre-gl/dist/maplibre-gl.css"
import { TravelDayData } from "@/types/geo"

type Props = {
  travelDayDataList: TravelDayData[]
}

const API_KEY = "9V8S1PVf6CfINuabJsSA"

export default function Map({ travelDayDataList }: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (map.current) return
    if (!mapContainer.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
    })

    map.current.addControl(new maplibregl.NavigationControl({}))

    map.current.on("load", () => {
      if (!map.current) return
      const bounds = new LngLatBounds()
      travelDayDataList.forEach((travelDayData) => {
        if (!map.current) return

        travelDayData.lineString.geometry.coordinates.forEach((coordinate) => {
          bounds.extend([coordinate[0], coordinate[1]])
        })

        const id = travelDayData.date.toString()

        map.current.addSource(id, {
          type: "geojson",
          data: travelDayData.lineString.geometry,
        })

        map.current.addLayer({
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
      })
      map.current.fitBounds(bounds, { padding: 20 })
    })
  }, [travelDayDataList])

  return (
    <div className="relative h-96 w-full">
      <div id="map" ref={mapContainer} className="absolute h-full w-full" />
    </div>
  )
}
