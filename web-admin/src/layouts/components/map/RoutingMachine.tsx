import L from 'leaflet'
import { createControlComponent } from '@react-leaflet/core'
import 'leaflet-routing-machine'

const createRoutineMachineLayer = () => {
  const waypoints = [L.latLng(10.8991, 106.8769), L.latLng(10.93069, 106.86001), L.latLng(10.94478, 106.87935)]
  const instance = L.Routing.control({
    waypoints: waypoints,

    // router: L.Routing.mapbox('5b3ce3597851110001cf624806ba2182177449d4bd2f61bbe596fa23' || '', {
    //   profile: 'mapbox/cycling'
    // }),
    plan: L.Routing.plan(waypoints, {
      createMarker: function () {
        return false
      }
    }),
    lineOptions: {
      styles: [{ color: '#6FA1EC', weight: 4 }],
      extendToWaypoints: false,
      missingRouteTolerance: 0
    },
    show: false,
    routeWhileDragging: false,
    addWaypoints: false,
    fitSelectedRoutes: true,
    showAlternatives: true,
    autoRoute: true
  })

  return instance
}

const RoutingMachine = createControlComponent(createRoutineMachineLayer)

export default RoutingMachine
