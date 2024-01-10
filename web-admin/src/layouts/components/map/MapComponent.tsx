import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import RoutingMachine from './RoutingMachine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import CSS cho Leaflet Routing Machine

const MapComponent: React.FC = () => {
  const markerPositions: [number, number][] = [
    [10.8991, 106.8769],
    [10.93069, 106.86001],
    [10.94478, 106.87935],
  ];

  const customMarkerIcon = new L.Icon({
    iconUrl: "/images/marker-icon.png", // Đường dẫn đến hình ảnh icon tùy chỉnh
    iconSize: [32, 45], // Kích thước icon (width, height)
    iconAnchor: [16, 32], // Vị trí neo (anchor) của icon
    popupAnchor: [0, -32], // Vị trí neo của popup khi hiển thị
  });

  return (
    <MapContainer center={[10.8991, 106.8769]} zoom={13} style={{ height: '1000px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markerPositions.map((position, index) => (
        <Marker key={index} position={position} 
        icon={customMarkerIcon}>
          <Popup>
            Vị trí Marker {index + 1}: {position[0]}, {position[1]}
          </Popup>
        </Marker>
      ))}
      <RoutingMachine />
    </MapContainer>
  );
};

export default MapComponent;
