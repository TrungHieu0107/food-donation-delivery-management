'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import L, { LatLngTuple } from 'leaflet'
import RoadMapMachine from './RoadMapMachine'
import MapFly from './MapFly'

import 'leaflet-routing-machine/dist/leaflet-routing-machine.css' // Import CSS cho Leaflet Routing Machine
import { Box, CircularProgress, Typography } from '@mui/material'

interface RoadMapProps {
  start: LatLngTuple | undefined
  waypoints?: { location: LatLngTuple; address: string }[]
  end: LatLngTuple | undefined
  height? : number
}

const RoadMap: React.FC<RoadMapProps> = props => {
  const routineMachine = useRef<L.Routing.Control>(null)

  // Assuming routineMachine is an object that holds a reference to a DOM element

  const [mapCenter, setMapCenter] = useState<LatLngTuple>()
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    console.log({ props })

    if (routineMachine.current && ((props.start && props.end) || !!props.waypoints)) {
      if (!!props.waypoints) {
        console.log(props.waypoints)

        routineMachine.current.setWaypoints([...props.waypoints?.map(item => L.latLng(item.location))])
      } else if (props.start && props.end) {
        routineMachine.current.setWaypoints([L.latLng(props.start), L.latLng(props.end)])
      }
    }
  }, [props])

  useEffect(() => {
    try {
      if (!props.start) {
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
        setMapCenter(props.start)
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  const handleLoading = (value: boolean) => {
    setLoading(value)
  }

  const checkData = () => {
    if (!props.waypoints) {
      if (!props.end || !props.start) return true
      else return false
    }

    return false
  }

  return (
    <Fragment>
      <MapContainer
        center={props.start || mapCenter || [0, 0]}
        style={{
          height: props.height ? `${props.height}px` : '500px',
          width: '100%',
          zIndex: 2,
          position: 'relative',
          display: isLoading ? 'none' : 'block'
        }}
        zoom={5}
        scrollWheelZoom={false}
        doubleClickZoom={false}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapFly center={props.start || mapCenter || ([0, 0] as LatLngTuple)} />

        {props.start && props.end && (
          <RoadMapMachine
            setLoading={handleLoading}
            ref={routineMachine}
            waypoints={[L.latLng(props.start), L.latLng(props.end)]}
          />
        )}

        {props.waypoints && <RoadMapMachine setLoading={handleLoading} ref={routineMachine} waypoints={[]} />}
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
            {!props.start || !props.end ? (
              <Typography>Không tìm thấy vị trí!</Typography>
            ) : (
              <CircularProgress color='primary' />
            )}
          </Box>
        )}
      </MapContainer>
    </Fragment>
  )
}

export default RoadMap
