"use client";

import { MapComponent } from "@/components/googleMaps";
import { MapProvider } from "@/providers/map-provider";


export default function MapTestPage() {

    
  return (
    <div className="flex flex-col items-center gap-16" >
      
      <span>MAP PAGE</span>

      <div className="flex flex-row items-center gap-2 w-100 h-100"  >
        <MapProvider>
          <MapComponent />
        </MapProvider>
      </div>

    </div>
  );
}