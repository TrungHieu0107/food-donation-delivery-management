// MyMap.tsx
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'
import { Skeleton } from '@mui/material'

function MyMap({ selectedPosition }: { selectedPosition?: LatLngExpression }) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [mapCenter, setMapCenter] = useState<LatLngExpression>()
  const customMarkerIcon = new L.Icon({
    iconUrl: '/images/marker-icon.png',
    iconSize: [32, 45],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })

  // useEffect(() => {
  //   try {
  //     if (!selectedPosition) {
  //       if ('geolocation' in navigator) {
  //         navigator.geolocation.getCurrentPosition(position => {
  //           const { latitude, longitude } = position.coords
  //           const cureentLocation = [latitude, longitude] as LatLngExpression
  //           console.log(cureentLocation)
  //           setMapCenter(cureentLocation)
  //         })
  //       } else {
  //         console.error('Geolocation is not available in this browser.')
  //         setMapCenter([10.7768, 106.7298])
  //       }
  //     } else {
  //       setMapCenter(selectedPosition)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }, [])

  useEffect(() => {
    try {
      console.log(selectedPosition, !selectedPosition)

      if (!selectedPosition) {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            const cureentLocation = [latitude, longitude] as LatLngExpression
            console.log(cureentLocation)
            setMapCenter(cureentLocation)
          })
        } else {
          console.error('Geolocation is not available in this browser.')
          setMapCenter([10.7768, 106.7298])
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
    const element = document.querySelector('.leaflet-bottom.leaflet-right');
    if(element){
      element.remove()
    }
  }, [isLoading, mapCenter])

  return !isLoading && mapCenter ? (
    <>
      <MapContainer
        center={mapCenter}
        zoom={20}
        style={{ height: '400px', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {selectedPosition ? (
          <Marker position={mapCenter} icon={customMarkerIcon}>
            <Popup>Vị trí bạn sẽ quyên góp</Popup>
          </Marker>
        ) : null}
      </MapContainer>
    </>
  ) : (
    <Skeleton variant='rectangular' height={150} />
  )
}

export default MyMap
