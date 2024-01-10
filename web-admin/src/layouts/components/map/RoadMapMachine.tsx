import { createControlComponent } from '@react-leaflet/core'
import L, { ControlOptions } from 'leaflet' // Only import L, as ControlOptions is not directly used
import 'leaflet-routing-machine'

interface P extends ControlOptions {
  waypoints: L.LatLng[]
  setLoading: (value: boolean) => void
}

const createRoutingMachineLayer = (props: P) => {
  const customMarkerIcon = new L.Icon({
    iconUrl: '/images/marker-icon.png', // Đường dẫn đến hình ảnh icon tùy chỉnh
    iconSize: [32, 45], // Kích thước icon (width, height)
    iconAnchor: [16, 32], // Vị trí neo (anchor) của icon
    popupAnchor: [0, -32] // Vị trí neo của popup khi hiển thị
  })

  const instance = L.Routing.control({
    waypoints: props.waypoints,
    
    // router: L.Routing.mapbox('5b3ce3597851110001cf624806ba2182177449d4bd2f61bbe596fa23', {
    //   profile: 'mapbox/cycling'
    // }),
    plan: L.Routing.plan(props.waypoints, {
      createMarker: function (i, wp) {
        return L.marker(wp.latLng, {
          icon: customMarkerIcon
        }).bindPopup(i === 0 ? 'Bắt đầu' : 'Kết thúc')
      }
    }),
    lineOptions: {
      styles: [{ color: '#6FA1EC', weight: 4, className: 'animate' }],
      extendToWaypoints: false,
      missingRouteTolerance: 0
    },
    autoRoute: true,
    fitSelectedRoutes: true,
    showAlternatives: true,
    show: false
  })

  // Event listener for routing start
  instance.on('routingstart', () => {
    props.setLoading(true)
  })

  // Event listener for routes found
  instance.on('routesfound', () => {
    props.setLoading(false)
  })

  // Event listener for routing error
  instance.on('routingerror', () => {
    props.setLoading(false)
  })

  return instance
}

const RoutingMachine = createControlComponent(createRoutingMachineLayer)

export default RoutingMachine
