import { useMap, useMapEvents } from 'react-leaflet';
import {Geocoder, geocoders} from 'leaflet-control-geocoder';
import L from 'leaflet';

function LocationMarker(props: any) {
  const customMarkerIcon = new L.Icon({
    iconUrl: "/images/marker-icon.png",
    iconSize: [32, 45],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  const map = useMap()
  new Geocoder({
    geocoder: new geocoders.Nominatim(),
    position: 'topright',
    collapsed: false,
    showResultIcons:false,
    defaultMarkGeocode:false
  }).on('markgeocode', function(e) {
    const latlng = e.geocode.center;
    L.marker(latlng,{icon: customMarkerIcon, zIndexOffset: 1000}).addTo(map);
    map.fitBounds(e.geocode.bbox);
  }).addTo(map);
  const getAddressFromCoordinates = async (latlng: { lat: number; lng: number }) => {
    props.setSelectedPosition(latlng);
  }
  
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      console.log("Data: ", [lat, lng]);
      getAddressFromCoordinates(e.latlng);
    },
  });

  return null;
}

export default LocationMarker;
