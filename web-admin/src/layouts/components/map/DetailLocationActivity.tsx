// MyMap.tsx
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import {Geocoder, geocoders} from 'leaflet-control-geocoder';
import L from 'leaflet';

function MyMap({ selectedPosition }: any) {
  const mapCenter =selectedPosition ? selectedPosition : [10.7768, 106.7298]
  const customMarkerIcon = new L.Icon({
    iconUrl: "/images/marker-icon.png",
    iconSize: [32, 45],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const MarkerLocation = () =>{
      const map = useMap()
      new Geocoder({
        geocoder: new geocoders.Nominatim(),
        position: 'topright',
        collapsed: false,
        showResultIcons:false,
        defaultMarkGeocode:false,
      }).on('markgeocode', function(e) {
        // const layerGroup = L.layerGroup()
        // layerGroup.clearLayers()
        const latlng = e.geocode.center;        
        L.marker(latlng,{icon: customMarkerIcon}).addTo(map);       
      }).addTo(map);
    
      return null;
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={16}
      style={{ height: '400px', width: '100%' }}    
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerLocation/>
     {selectedPosition && <Marker position={selectedPosition} icon={customMarkerIcon}>
        <Popup>Vị trí sẽ diễn ra hoạt động</Popup>
        </Marker>}
    </MapContainer>
  );
}

export default MyMap;
