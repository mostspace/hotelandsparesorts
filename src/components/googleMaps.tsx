/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
'use client'

//Map component Component from library
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback } from "react";
import ReactDOMServer from 'react-dom/server';

//Map's styling
export const defaultMapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '15px',
};

const defaultMapCenter = {
    lat: 53.30473008552272,
    lng: -6.205546749941808
}

const defaultMapZoom = 18

const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    // mapTypeId: 'satellite',
};



const MapComponent = () => {


const initMap = useCallback((map: google.maps.Map) => {
    
    const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: false,
      });
    
    const marker = new google.maps.Marker({
      position: { lat: 53.30473, lng: -6.20554 },
      map,
    });

    marker.addListener("click", () => {
      console.log("MARKER CLICKED");
    });


    marker.addListener("mouseover", () => {

    
        const contentStr = ReactDOMServer.renderToString(
            <button onClick={() => alert('Clicked!')}>Test</button>
            );
      infoWindow.setContent(contentStr);
      infoWindow.setOptions({disableAutoPan:false})
      infoWindow.open(map, marker);
    });

    marker.addListener("mouseout", () => {
        infoWindow.close()
    });




  }, []);



    return (
        <div className="w-full">
            <GoogleMap 
                id="map"
                mapContainerStyle={defaultMapContainerStyle}
                center={defaultMapCenter}
                zoom={defaultMapZoom}
                options={defaultMapOptions} 
                onLoad={initMap}
            >

                <Marker 
                    position={{ lat: 53.31473, lng: -6.21554 }}
                    onClick={() => console.log("OTHER MARKER CLICKED")} 
                />


            </GoogleMap>
        </div>
    )
};

export { MapComponent };