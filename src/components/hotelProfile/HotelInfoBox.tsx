import { MapProvider } from "@/providers/map-provider";
import { useState } from "react";
import { MapComponent } from "../maps/googleMaps";
import { Amenities } from "./Amenities";

interface HotelInfoBoxProps{
    hotel:any
}


export const HotelInfoBox = (props:HotelInfoBoxProps) => {

    const [selectedTab, setSelectedTab] = useState("Key info");
    
    const formatTime = (time:string) => {

        const formatted = new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

        return formatted
    }

    return(
        <div className="w-full px-[49px] py-[37px] flex flex-col items-start gap-10 border border-primary">
            <span className="text-5xl" style={{fontFamily:'Harlow'}}>At a glance</span>

            {/* TABS */}
            <div className="w-full flex flex-col gap-2">
                <div className="flex flex-row gap-4 text-xl">
                    <div className={`relative ${selectedTab=="Key info"?"font-medium":""}`}>
                        <span className='cursor-pointer' onClick={()=>setSelectedTab('Key info')}>Key info</span>
                        {selectedTab=="Key info" && <div className="absolute w-[100%] h-[2px] bg-primary top-[35px]"/>}
                    </div>
                    <div className={`relative ${selectedTab=="Location"?"font-medium":""}`}>
                        <span className='cursor-pointer' onClick={()=>setSelectedTab("Location")}>Location</span>
                        {selectedTab=="Location" && <div className="absolute w-[100%] h-[2px] bg-primary top-[35px]"/>}
                    </div>
                    <div className={`relative ${selectedTab=="Amenities"?"font-medium":""}`}>
                        <span className='cursor-pointer' onClick={()=>setSelectedTab("Amenities")}>Amenities</span>
                        {selectedTab=="Amenities" && <div className="absolute w-[100%] h-[2px] bg-primary top-[35px]"/>}
                    </div>
                    <div className={`relative ${selectedTab=="Fees"?"font-medium":""}`}>
                        <span className='cursor-pointer' onClick={()=>setSelectedTab("Fees")}>Fees</span>
                        {selectedTab=="Fees" && <div className="absolute w-[100%] h-[2px] bg-primary top-[35px]"/>}
                    </div>
                    <div className={`relative ${selectedTab=="Map"?"font-medium":""}`}>
                        <span className='cursor-pointer' onClick={()=>setSelectedTab("Map")}>Map</span>
                        {selectedTab=="Map" && <div className="absolute w-[100%] h-[2px] bg-primary top-[35px]"/>}
                    </div>
                </div>
                <div className="w-full h-px bg-primary/50"/>
            </div>

            {/* MAIN CONTENT */}
            
            {selectedTab=="Key info" && <div className="flex flex-row h-full gap-[67px] items-start text-lg">
                <div className="flex flex-col gap-[30px] items-start  w-[50%]">
                    
                    <div className="flex flex-row gap-[20px] items-end">
                        <span className="text-2xl" style={{fontFamily:'Harlow'}}>Check-in time</span>
                        <span className="font-medium">{formatTime(props.hotel.check_in_time)}</span>
                    </div>

                    <div className="flex flex-row gap-[20px] items-end">
                        <span className="text-2xl" style={{fontFamily:'Harlow'}}>Check-out time</span>
                        <span className="font-medium">{formatTime(props.hotel.check_out_time)}</span>
                    </div>

                    <span className="text-2xl" style={{fontFamily:'Harlow'}}>Arriving/leaving instructions</span>

                    <span> Extra-person charges may apply and vary depending on property policy</span>
                    <span>Government-issued photo identification and a credit card, debit card or cash deposit may be required at check-in for incidental charges</span>
                    <span>Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed</span>
                    <span>Guests must contact this property in advance to reserve on-site parking</span>
                    <span>This property accepts credit cards and cash</span>
                    <span>Cashless transactions are available</span>
                    <span>Safety features at this property include a smoke detector</span>
                    <span>This property has outdoor spaces, such as balconies, patios and terraces, which may not be suitable for children; if you have any concerns, we recommend contacting the property prior to your arrival to confirm that they can accommodate you in a suitable room</span>

                </div>

                <div className="flex flex-col gap-[30px] items-start w-[50%]">
                     <span className="text-2xl" style={{fontFamily:'Harlow'}}>Know before you go</span>
                     <span>Reservations are required for massage services. Reservations can be made by contacting the hotel prior to arrival, using the contact information on the booking confirmation.</span>
                     <span>Only registered guests are allowed in the guest rooms.</span>
                     <span>The property has connecting/adjoining rooms, which are subject to availability and can be requested by contacting the property using the number on the booking confirmation.</span>
                     <span>Parking height restrictions apply.</span>
                     <span>Cashless payment methods are available for all transactions.</span>
                     <span>Contactless check-out is available.</span>

                     <span className="text-2xl" style={{fontFamily:'Harlow'}}>Special instructions</span>
                     <span>Front desk staff will greet guests on arrival at the property.</span>

                     <span className="text-2xl" style={{fontFamily:'Harlow'}}>Minumum age</span>
                     <span>Minimum age: 18</span>

                </div>
            </div>}

            {selectedTab == "Amenities" && <Amenities amenityList={props.hotel.amenities} source="at-a-glance"/>}

            {selectedTab=="Map" && <div className="w-full h-[500px]">
                <MapProvider>
                    <MapComponent hotels={[props.hotel]} lat={+props.hotel.lat||0} lng={+props.hotel.lng||0} newSearch={null} updateVar={2} source="infoBox"/>
                </MapProvider>
            </div>
            }


        </div>
    )
}