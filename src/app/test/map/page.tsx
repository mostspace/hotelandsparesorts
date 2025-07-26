"use client";

import { MapComponent } from "@/components/maps/googleMaps";
import { MapProvider } from "@/providers/map-provider";


export default function MapTestPage() {

    
  return (
    <div className="flex flex-col items-center gap-16" >
      
      <span>MAP PAGE</span>

      <div className="flex flex-row items-center gap-2 w-100 h-100"  >
        <MapProvider>
          <MapComponent hotels={[]} lat={53.30473008552272} lng={-6.205546749941808}/>
        </MapProvider>
      </div>

    </div>
  );
}