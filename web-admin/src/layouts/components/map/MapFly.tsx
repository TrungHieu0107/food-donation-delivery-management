import { LatLngTuple } from 'leaflet'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export interface IMapFlyProps {
  center: LatLngTuple
}

export default function MapFly(props: IMapFlyProps) {
  const map = useMap()

  useEffect(() => {
    // Check if the map object is ready before using it
    if (map && props.center) {
      map.setView(props.center, 11) // Set initial center and zoom level
    }
  }, [props.center, map])

  return null
}
