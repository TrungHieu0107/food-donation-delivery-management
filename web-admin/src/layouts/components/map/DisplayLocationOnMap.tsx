'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L, { LatLngTuple } from 'leaflet'
import MapFly from './MapFly'

import 'leaflet-routing-machine/dist/leaflet-routing-machine.css' // Import CSS cho Leaflet Routing Machine
import { Box, Typography } from '@mui/material'

interface DisplayLocationOnMapProps {
  waypoints?: {
    location: LatLngTuple
    address: string
  }[]
  height?: number
}

const DisplayLocationOnMap: React.FC<DisplayLocationOnMapProps> = props => {

  const [mapCenter, setMapCenter] = useState<LatLngTuple>()

  useEffect(() => {

      if (!!props.waypoints) {
        console.log(props.waypoints)

      }

      try {
        if (!props.waypoints) {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
              const { latitude, longitude } = position.coords
              const cureentLocation = [latitude, longitude] as LatLngTuple
              setMapCenter(cureentLocation)
            })
          } else {
            console.error('Geolocation is not available in this browser.')
            setMapCenter([10.7768, 106.7298])
          }
        } else {
          setMapCenter(props.waypoints.at(0)?.location || [0, 0])
        }
      } catch (error) {
        console.log(error)
      }
  }, [props])


  const checkData = () => {
    if (!props.waypoints) {
       return true
    }

    return false
  }

  const customMarkerIcon = new L.Icon({
    iconUrl: '/images/marker-icon.png', // Đường dẫn đến hình ảnh icon tùy chỉnh
    iconSize: [32, 45], // Kích thước icon (width, height)
    iconAnchor: [16, 32], // Vị trí neo (anchor) của icon
    popupAnchor: [0, -32] // Vị trí neo của popup khi hiển thị
  })

  return (
      <MapContainer
        center={mapCenter || [0, 0]}
        style={{
          height :props.height ? `${props.height}px` : '500px',
          width: '100%',
          zIndex: 2,
          position: 'relative',
        }}
        zoom={5}
        scrollWheelZoom={false}
        doubleClickZoom={false}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapFly center={mapCenter || ([0, 0] as LatLngTuple)} />
        {props.waypoints?.map((position, index) => (
          <Marker key={index} position={position.location} icon={customMarkerIcon}>
            <Popup >
              {position.address}
            </Popup>
          </Marker>
        ))}
        {checkData() && (
          <Box
            sx={{
              position: 'absolute',
              backgroundColor: theme => theme.palette.grey[300],
              width: '100%',
              height: '100%',
              zIndex: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography>Không tìm thấy vị trí!</Typography>
          </Box>
        )}
      </MapContainer>
  )
}

export default DisplayLocationOnMap
