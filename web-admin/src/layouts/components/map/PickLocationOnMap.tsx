// MyMap.tsx
import React, { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import LocationMarker from './LocationMaker';
import L from 'leaflet';

function MyMap({ selectedPosition, setSelectedPosition }: any) {
  const [mapCenter, setMapCenter] =useState<any>(selectedPosition ? selectedPosition : [10.7768, 106.7298]);
  const customMarkerIcon = new L.Icon({
    iconUrl: "/images/marker-icon.png",
    iconSize: [32, 45],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });


  return (
    <MapContainer
      center={mapCenter}
      zoom={14}
      style={{ height: '400px', width: '100%' }}
      
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker
        setMapCenter={setMapCenter}
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}     
      />
     {selectedPosition && <Marker position={selectedPosition} icon={customMarkerIcon}>
     <Popup>Vị trí sẽ diễn ra hoạt động</Popup>
        </Marker>}
    </MapContainer>
  );
}

export default MyMap;
