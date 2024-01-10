import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = () => {
  const waypoints= [
    L.latLng(10.8991,106.8769),
    L.latLng(10.93069, 106.86001),
    L.latLng(10.94478, 106.87935),
  ]
  const instance =
    L.Routing.control({
    waypoints: waypoints,
    plan:L.Routing.plan(waypoints, {
      createMarker: function() { return false; },
    }),
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }],
      extendToWaypoints: false,
      missingRouteTolerance: 0
    },
    show: false,
    addWaypoints: false,
    routeWhileDragging: false,
    fitSelectedRoutes: true,
    showAlternatives: false,
  })

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
