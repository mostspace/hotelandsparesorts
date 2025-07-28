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
import { HotelTile } from "../search/HotelTile";

//Map's styling
export const defaultMapContainerStyle = {
    width: '100%',
    height: '60%',
    borderRadius: '15px',
};

const defaultMapZoom = 12

const defaultMapOptions = {
    mapTypeControl: false,
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    // mapTypeId: 'satellite',
    clickableIcons: false, // disables clicks on POIs (businesses, parks, etc.)
    styles: [
      {
        featureType: "poi", // Points of Interest
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit", // Bus/train stations
        stylers: [{ visibility: "off" }],
      },
    ],
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
          icon: {
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z", // classic pin shape
            fillColor: "#A56658", // your accent color
            fillOpacity: 1,
            strokeColor: "#000",
            strokeWeight: 1,
            scale: 2, // adjust size as needed
            anchor: new google.maps.Point(12, 24), // bottom center of pin
          },
        });

        markersRef.current.push(marker);
    
        marker.addListener("click", () => {
          let hid = hotel.hid
          router.push(`/hotel-profile?hid=${hid}&checkIn=${'2025-10-22'}&checkOut=${'2025-10-25'}`)

        });
    
    
        marker.addListener("mouseover", () => {
    
        
          const contentStr = ReactDOMServer.renderToString(
            <div className="flex flex-row max-w-[350px] items-start gap-3 rounded-2">
                <img className="h-[100px]" src={hotel.images[0].url.replace('{size}','240x240')}/>
                <div className="flex flex-col gap-2">
                    <span className="text-lg font-bold">{hotel.hotel_name}</span>
                    <span>{hotel.address}</span>
                </div>
            </div>
          );
          infoWindow.setContent(contentStr);
          infoWindow.setOptions({
            headerDisabled: true,
            disableAutoPan: false,
          });
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
        <div className="w-full h-full relative">
            {showSearchAgainButton && <Button className="absolute top-10 left-1/2 -translate-x-1/2 z-10 bg-accent border border-light " onClick={getMapDetails}>Search this area</Button>}
            <GoogleMap 
                id="map"
                mapContainerStyle={defaultMapContainerStyle}
                // center={defaultMapCenter}
                zoom={defaultMapZoom}
                options={defaultMapOptions}
                onIdle={handleMapIdle}
                onLoad={initMap}
            />
        </div>
    )
};

export { MapComponent };