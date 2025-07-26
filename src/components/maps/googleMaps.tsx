/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
'use client'

//Map component Component from library
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOMServer from 'react-dom/server';
import { Button } from "../ui/button";
import { useRouter } from 'next/navigation';

//Map's styling
export const defaultMapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '15px',
};

const defaultMapZoom = 12

const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    // mapTypeId: 'satellite',
};


interface MapProps{
    hotels:any[]
    lat:number,
    lng:number,
    newSearch:any,
    updateVar:number
}

const MapComponent = (props:MapProps) => {

const router = useRouter();

const [showSearchAgainButton, setShowSearchAgainButton] = useState<any>(false);

const defaultMapCenter = {
    lat: props.lat,
    lng: props.lng
}

const mapRef = useRef<google.maps.Map | null>(null);
const markersRef = useRef<google.maps.Marker[]>([]);

useEffect( () => {

    if(props.updateVar>1){

        
        placeMarkers()
    }

  }, [props.updateVar]); // eslint-disable-line react-hooks/exhaustive-deps
  
    

const initMap = useCallback((map: google.maps.Map) => {
    
    mapRef.current = map;
    placeMarkers()
    

  }, []);

  const placeMarkers = () => {

    let lat = props.lat
    let lng = props.lng
       
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  

    let map = mapRef.current
    map?.setCenter({ lat, lng });

    let hotels = props.hotels

    hotels.forEach(hotel => {
        const infoWindow = new google.maps.InfoWindow({
            content: "",
            disableAutoPan: false,
          });
        
        const marker = new google.maps.Marker({
          position: { lat: +hotel.lat, lng: +hotel.lng },
          map,
        });

        markersRef.current.push(marker);
    
        marker.addListener("click", () => {
          let hid = hotel.hid
          router.push(`/hotel-profile?hid=${hid}&checkIn=${'2025-10-22'}&checkOut=${'2025-10-25'}`)

        });
    
    
        marker.addListener("mouseover", () => {
    
        
            const contentStr = ReactDOMServer.renderToString(
                <button onClick={() => alert('Clicked!')}>{hotel.hotel_name}</button>
                );
          infoWindow.setContent(contentStr);
          infoWindow.setOptions({disableAutoPan:false})
          infoWindow.open(map, marker);
        });
    
        marker.addListener("mouseout", () => {
            infoWindow.close()
        });
    });
  }

  const handleMapIdle = () => {
    if (!mapRef.current) return null;
    const center = mapRef.current.getCenter();
    if (!center) return null;
    let lat = center.lat()
    let lng = center.lng()

    if(lat!== props.lat && lng != props.lng){
        setShowSearchAgainButton(true)
    }
    console.log("Map idle")
  }

  const getMapDetails = () => {
    if (!mapRef.current) return null;

    const center = mapRef.current.getCenter();
    const bounds = mapRef.current.getBounds();
    if (!center || !bounds) return null;

    const ne = bounds.getNorthEast();
    const radiusMeters = google.maps.geometry.spherical.computeDistanceBetween(center, ne);

    let res = {
      centre: {
        lat: center.lat(),
        lng: center.lng(),
      },
      radiusKm: radiusMeters / 1000,
    }
    
    console.log("Map Details", res)

    props.newSearch(res)

  };

    const showHotels = () => {
        
        let hotels = props.hotels
        
        console.log("MAPS HOTELS",hotels)

        let compArray:any[] = []
        hotels.forEach(hotel => {
            compArray.push(<Marker 
                position={{ lat: +hotel.lat, lng: +hotel.lng }}
                onClick={() => console.log(hotel.hotel_name," is CLICKED")} 
            />)
        });

        return compArray
    }



    return (
        <div className="w-full">
            {showSearchAgainButton && <Button onClick={getMapDetails}>Seach this area</Button>}
            <GoogleMap 
                id="map"
                mapContainerStyle={defaultMapContainerStyle}
                // center={defaultMapCenter}
                zoom={defaultMapZoom}
                options={defaultMapOptions}
                onIdle={handleMapIdle}
                onLoad={initMap}
            >

                {/* {showHotels()} */}


            </GoogleMap>
        </div>
    )
};

export { MapComponent };