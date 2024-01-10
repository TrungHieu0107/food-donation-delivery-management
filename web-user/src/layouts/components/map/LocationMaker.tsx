import { useMap, useMapEvents } from 'react-leaflet'
import { useEffect } from 'react'
import { LatLngExpression } from 'leaflet';

function LocationMarker(props: any) {
  // const customMarkerIcon = new L.Icon({
  //   iconUrl: '/images/location-icon.png',
  //   iconSize: [32, 45],
  //   iconAnchor: [16, 32],
  //   popupAnchor: [0, -32]
  // })

  const map = useMap()

  useEffect(() => {
    // new Geocoder({
    //   geocoder: new geocoders.Nominatim(),
    //   position: 'topright',
    //   collapsed: false,
    //   showResultIcons: true,
    //   defaultMarkGeocode: false
    // })
    //   .on('markgeocode', function (e) {
    //     const latlng = e.geocode.center
    //     L.marker(latlng, { icon: customMarkerIcon, zIndexOffset: 1000 }).addTo(map)
    //     map.fitBounds(e.geocode.bbox)
    //   })
    //   .addTo(map)
    if (props.selectedPosition) {
      map.flyTo(props.selectedPosition, map.getMaxZoom())
    } else {
      if (props.center) {
        map.setZoom(8)
        map.flyTo(props.center, 15)
      }
    }
  }, [props.selectedPosition, props.center])

  const getAddressFromCoordinates = async (latlng: LatLngExpression) => {
    props.setSelectedPosition(latlng)
    map.setZoom(map.getMaxZoom())
  }

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      getAddressFromCoordinates([lat, lng])
    }
  })

  return null
}

export default LocationMarker
