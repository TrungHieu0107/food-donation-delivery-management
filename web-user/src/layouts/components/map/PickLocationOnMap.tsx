// MyMap.tsx
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import LocationMarker from './LocationMaker'
import { LatLngExpression, Icon } from 'leaflet'
import { Skeleton } from '@mui/material'

function MyMap({ selectedPosition, setSelectedPosition, listMarkers, center }: any) {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(center)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const customMarkerIcon = new Icon({
    iconUrl: '/images/marker-icon.png',
    iconSize: [32, 45],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })

  useEffect(() => {
    try {
      if (!selectedPosition) {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            const initialPosition = [latitude, longitude] as LatLngExpression
            console.log(initialPosition)
            setMapCenter(initialPosition)
          })
        } else {
          console.error('Geolocation is not available in this browser.')
        }
      } else {
        setMapCenter(selectedPosition)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (listMarkers.length > 0) {
      setMapCenter([listMarkers[0]?.lat, listMarkers[0]?.lon])
    }
  }, [listMarkers])

  return (
    <>
      {!isLoading ? (
        <MapContainer
          center={mapCenter ?? [10.6397696, 106.430464]}
          zoom={10}
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
            center={center}
          />
          {selectedPosition ? (
            <Marker position={selectedPosition} icon={customMarkerIcon}>
              <Popup>Vị trí bạn đang chọn</Popup>
            </Marker>
          ) : (
            listMarkers?.map((item: { lat: number; lon: number }, index: number) => (
              <Marker
                key={index}
                position={[item.lat, item.lon]}
                icon={customMarkerIcon}
                eventHandlers={{
                  click: () => {
                    console.log('click')
                    setSelectedPosition([item.lat, item.lon])
                  }
                }}
              ></Marker>
            ))
          )}
        </MapContainer>
      ) : (
        <Skeleton variant='rectangular' height={'400px'} width={'100%'} />
      )}
    </>
  )
}

export default MyMap
