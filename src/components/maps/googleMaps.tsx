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
    height: '100%',
    borderRadius: '15px',
};

const defaultMapZoom = 12



interface MapProps{
    hotels:any[]
    lat:number,
    lng:number,
    newSearch:any,
    mini:boolean
    updateVar:number,
    source:string
}

const MapComponent = (props:MapProps) => {


const defaultMapOptions = {
  mapTypeControl: false,
  zoomControl: !props.mini,
  disableDefaultUI: props.mini,
  tilt: 0,
  gestureHandling: 'greedy',
  draggable: !props.mini,
  streetViewControl: false,
  fullscreenControl: false,
  rotateControl: false,
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

        const contentDiv = document.createElement("div");
        contentDiv.className = "flex flex-row max-w-[350px] items-start gap-3 rounded-2";

        // Image
        const img = document.createElement("img");
        img.src = hotel.images[0].url.replace("{size}", "240x240");
        img.className = "h-[100px]";
        contentDiv.appendChild(img);

        // Text container
        const textDiv = document.createElement("div");
        textDiv.className = "flex flex-col gap-2";

        const nameSpan = document.createElement("span");
        nameSpan.className = "text-lg font-bold";
        nameSpan.innerText = hotel.hotel_name;

        const addressSpan = document.createElement("span");
        addressSpan.innerText = hotel.address;

        textDiv.appendChild(nameSpan);
        textDiv.appendChild(addressSpan);

        // Optional button
        if (props.source === "infoBox") {
          const btn = document.createElement("button");
          btn.innerText = "Get directions";
          btn.className = "bg-accent text-white p-2 mt-2 rounded cursor-pointer"; // Make sure cursor is shown
          btn.onclick = () => getDirections(hotel.lat, hotel.lng);
          textDiv.appendChild(btn);
        }

        contentDiv.appendChild(textDiv);

        infoWindow.setContent(contentDiv);
        infoWindow.setOptions({
          headerDisabled: true,
          disableAutoPan: false,
        });

        if (props.source === "infoBox") {
          infoWindow.open(map, marker);
        } else {
          marker.addListener("mouseover", () => {
            infoWindow.open(map, marker);
          });

          marker.addListener("mouseout", () => {
            infoWindow.close();
          });
        }


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

    const getDirections = (lat:number,lng:number) => {
      console.log("OPEN DIRECTIONS",lat,lng)
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, "_blank");
    }



    return (
        <div className="w-full h-full relative">
            {showSearchAgainButton && <Button className="absolute top-10 left-1/2 -translate-x-1/2 z-10 bg-accent border border-light " onClick={getMapDetails}>Search this area</Button>}
            {props.mini && <Button className="absolute top-1/2 left-1/2 -translate-x-1/2 z-10 bg-accent border border-light ">SHOW ON MAP</Button>}
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