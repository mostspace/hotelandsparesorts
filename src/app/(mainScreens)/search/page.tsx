"use client";

import { MapComponent } from "@/components/maps/googleMaps";
import { HotelTile } from "@/components/search/HotelTile";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFilters } from "@/components/search/SearchFilters";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MapProvider } from "@/providers/map-provider";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";

export default function SearchScreen() {

  const searchParams = useSearchParams();

  const latP = searchParams.get('lat');
  const lngP = searchParams.get('lng');

  const checkIn = searchParams.get('check-in');
  const checkOut = searchParams.get('check-out');

  const adults = +(searchParams.get('adults')||1);
  const children = +(searchParams.get('children')||1);


  const latNum = latP ? parseFloat(latP) : null;
  const lngNum = lngP ? parseFloat(lngP) : null;

  console.log("COORDS",latNum,lngNum)

    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState<any[]>([]);
    const [mapOpen, setMapOpen] = useState(false);
    const [updateVar, setUpdateVar] = useState(0);

    const [lat, setLat] = useState(latNum);
    const [lng, setLng] = useState(lngNum);
    const [radius, setRadius] = useState(3000);
    const [filters, setFilters] = useState<any[]>([]);


  useEffect( () => {

    loadHotels(latNum||0,lngNum||0,3000,[])

  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  
  const loadHotels = async (latNum:number,lngNum:number,radiusM:number,filters:any[]) => {

    console.log("LOAD HOTELS",latNum,lngNum,radiusM,filters)

    setLoading(true)
    const res = await fetch("/api/ratehawk/search/geo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        lat: latNum,
        lng:lngNum, 
        checkIn:checkIn, 
        checkOut:checkOut,
        radius:radiusM,
        adults:adults,
        children:children,
        filters:filters
      }),
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    console.log("Hotels:", data);

    setHotels(data)
    setLoading(false)
    setUpdateVar(updateVar+1)
  }

  const showHotels = () => {

    let compArray:any[] = []

    compArray.push(<span className="text-5xl" style={{fontFamily:'Harlow'}}>{`Showing ${hotels.length} results`}</span>)

    hotels.forEach(hotel => {

      compArray.push(<HotelTile hotel={hotel} checkIn={checkIn+""} checkOut={checkOut+""} adults={+adults} children={+children}/>)
    });

    return compArray

  }

  

  const mapMovedNewSearch = (data:any) => {
    let lat = data.centre.lat
    let lng = data.centre.lng

    let radiusKm = data.radiusKm

    let radius = Math.floor(radiusKm*1000)

    setLat(lat)
    setLng(lng)
    setRadius(radius)
    loadHotels(lat,lng,radius,filters)

  }

  const applyFilters = (filters:any[]) => {
    loadHotels(lat||0,lng||0,radius,filters)
    setFilters(filters)
  }
    
  return (
    <div className="w-full flex flex-col gap-[60px] py-10 text-primary" >
      
      <div className="flex flex-col items-start px-[120px] gap-10">
        <span className="text-lg">{'Home > Hotel Stays'}</span>
        <span className="text-6xl">BOOK A HOTEL STAY</span>
        <SearchBar showLocation={true} showBorders={true} existingData={{checkInDate:checkIn,checkOutDate:checkOut}}/>
      </div>
      


      <div className="flex flex-row justify-between items-center px-[120px] py-[40px] bg-accentDark text-light">
          
          <div className="flex flex-row gap-5 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="54" viewBox="0 0 44 54" fill="none">
              <path d="M25.3357 32.2371L20.4331 37.0914L18.2697 34.9493C17.9407 34.6398 17.4224 34.648 17.1099 34.9738C16.8055 35.2914 16.8055 35.7883 17.1099 36.1059L19.8491 38.8181C20.1699 39.1358 20.6881 39.1358 21.0089 38.8181L26.4955 33.3855C26.8081 33.0598 26.7999 32.5466 26.4709 32.2371C26.1501 31.9358 25.6483 31.9358 25.3275 32.2371H25.3357Z" fill="#D5B18D"/>
              <path d="M28.2063 30.3475C28.5271 30.0299 28.5271 29.5167 28.2063 29.1991C19.3717 21.1276 7.25507 33.1493 15.4069 41.8643C21.9958 48.3557 33.0431 41.8968 30.5013 33.0516C30.3697 32.6199 29.909 32.3837 29.4731 32.514C29.0535 32.6443 28.8068 33.0842 28.9219 33.5077C30.0571 37.4009 27.7868 41.4652 23.8548 42.581C19.9229 43.6968 15.8182 41.457 14.6912 37.5638C14.3046 36.2362 14.3046 34.8272 14.6912 33.4996C16.0896 28.2543 23.2379 26.3973 27.0382 30.3475C27.359 30.6652 27.8772 30.6652 28.198 30.3475H28.2063Z" fill="#D5B18D"/>
              <path d="M39.0811 39.6C39.5335 39.6 39.9036 39.2335 39.9036 38.7855V26.5683C39.9036 24.3204 38.0611 22.4959 35.7907 22.4959H34.1456V15.1656C33.471 -1.03437 10.1426 -1.04252 9.46805 15.1656V22.4959H7.82288C5.55255 22.4959 3.70996 24.3204 3.70996 26.5683V44.4869C3.70996 46.7349 5.55255 48.5593 7.82288 48.5593H35.7907C38.0611 48.5593 39.9036 46.7349 39.9036 44.4869V42.8579C39.9036 42.41 39.5335 42.0435 39.0811 42.0435C38.6286 42.0435 38.2585 42.41 38.2585 42.8579V44.4869C38.2585 45.8389 37.1562 46.9303 35.7907 46.9303H7.82288C6.45739 46.9303 5.35513 45.8389 5.35513 44.4869V26.5683C5.35513 25.2163 6.45739 24.1249 7.82288 24.1249H16.0487C16.5011 24.1249 16.8631 23.7502 16.8631 23.3023C16.8631 22.8625 16.5011 22.5041 16.0487 22.4959H14.4035V15.1656C14.4035 11.1177 17.7186 7.83531 21.8068 7.83531C25.895 7.83531 29.2101 11.1177 29.2101 15.1656V22.4959H20.1616C19.7092 22.4959 19.339 22.8625 19.339 23.3104C19.339 23.7584 19.7092 24.1249 20.1616 24.1249H35.7907C37.1562 24.1249 38.2585 25.2163 38.2585 26.5683V38.7855C38.2585 39.2335 38.6286 39.6 39.0811 39.6ZM21.8068 6.20635C16.8137 6.20635 12.7666 10.2217 12.7584 15.1656V22.4959H11.1132V15.1656C11.1132 9.31766 15.9007 4.57739 21.8068 4.57739C27.7129 4.57739 32.5004 9.31766 32.5004 15.1656V22.4959H30.8552V15.1656C30.8552 10.2217 26.7999 6.2145 21.8068 6.20635Z" fill="#D5B18D"/>
            </svg>
            <span className="text-3xl">Unlock exclusive discounts at hundreds of top hotels</span>
          </div>

          <Button className="h-13 border border-light bg-accentDark">UNLOCK FOR FREE</Button>
      </div>


      <div className="w-full flex flex-row gap-[70px] justify-start px-[120px]">
          
          {/* FILTERS */}
          <SearchFilters applyFilters={applyFilters}/>


          {/* RESULTS SECTION */}
          <div className="w-full flex flex-col gap-10">

            


            <div className="w-full flex flex-row justify-between">
              {/* <Button onClick={()=>setMapOpen(!mapOpen)}>Show {mapOpen?"List":"Map"}</Button> */}


              {/* TOGGLE */}
              <div className="flex flex-row border border-primary font-medium text-lg">
                  
                  <div className={`flex flex-row items-center gap-2.5 p-2.5 cursor-pointer bg-${mapOpen?'light':'accent'} text-${mapOpen?'primary':'light'}`} onClick={()=>setMapOpen(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                      <path d="M19.353 11.9137H6.64686C5.77332 11.9137 5.05859 12.6196 5.05859 13.4823C5.05859 14.3451 5.77332 15.051 6.64686 15.051H19.353C20.2266 15.051 20.9413 14.3451 20.9413 13.4823C20.9413 12.6196 20.2266 11.9137 19.353 11.9137Z" fill={mapOpen?'#4D4D4D':'#FFF'}/>
                      <path d="M6.64686 10.3451H16.1765C17.05 10.3451 17.7648 9.6392 17.7648 8.77645C17.7648 7.91371 17.05 7.20782 16.1765 7.20782H6.64686C5.77332 7.20782 5.05859 7.91371 5.05859 8.77645C5.05859 9.6392 5.77332 10.3451 6.64686 10.3451Z" fill={mapOpen?'#4D4D4D':'#FFF'}/>
                      <path d="M16.1765 16.6196H6.64686C5.77332 16.6196 5.05859 17.3255 5.05859 18.1882C5.05859 19.0509 5.77332 19.7568 6.64686 19.7568H16.1765C17.05 19.7568 17.7648 19.0509 17.7648 18.1882C17.7648 17.3255 17.05 16.6196 16.1765 16.6196Z" fill={mapOpen?'#4D4D4D':'#FFF'}/>
                    </svg>
                    <span>List View</span>
                  </div>

                  <div className={`flex flex-row items-center gap-2.5 p-2.5 cursor-pointer bg-${mapOpen?'accent':'light'} text-${mapOpen?'light':'primary'}`} onClick={()=>setMapOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="26" viewBox="0 0 27 26" fill="none">
                      <path d="M13.5 21.6314C13.3173 21.6314 13.1346 21.5687 12.9838 21.4432C12.7932 21.2785 8.2666 17.4432 6.37655 13.2549C6.20184 12.8628 6.37655 12.3922 6.78156 12.2196C7.17863 12.0471 7.65511 12.2196 7.82982 12.6196C9.21162 15.6863 12.2611 18.6589 13.4841 19.7804C15.6521 17.702 19.853 13.0589 19.853 10.0471C19.853 6.4863 17.0021 3.59219 13.5 3.59219C9.99781 3.59219 7.14686 6.4863 7.14686 10.0471C7.14686 10.4785 6.7895 10.8314 6.35273 10.8314C5.91595 10.8314 5.55859 10.4785 5.55859 10.0471C5.55859 5.62356 9.12426 2.02356 13.5 2.02356C17.8756 2.02356 21.4413 5.62356 21.4413 10.0471C21.4413 14.4706 14.3417 21.153 14.032 21.4275C13.8811 21.5608 13.6905 21.6314 13.5 21.6314Z" fill={mapOpen?'#FFF':'#4D4D4D'}/>
                      <path d="M13.4998 13.0039C11.7447 13.0039 10.3232 11.6 10.3232 9.86669C10.3232 8.13335 11.7447 6.72943 13.4998 6.72943C15.2548 6.72943 16.6763 8.13335 16.6763 9.86669C16.6763 11.6 15.2548 13.0039 13.4998 13.0039ZM13.4998 8.29806C12.6262 8.29806 11.9115 9.00394 11.9115 9.86669C11.9115 10.7294 12.6262 11.4353 13.4998 11.4353C14.3733 11.4353 15.0881 10.7294 15.0881 9.86669C15.0881 9.00394 14.3733 8.29806 13.4998 8.29806Z" fill={mapOpen?'#FFF':'#4D4D4D'}/>
                      <path d="M23.8236 23.9843H3.17604C2.89015 23.9843 2.62808 23.8353 2.48514 23.5921C2.34219 23.349 2.34219 23.051 2.48514 22.8078L5.66168 17.3176C5.8761 16.9412 6.36846 16.8078 6.7417 17.0274C7.12289 17.2392 7.25789 17.7255 7.03553 18.0941L4.54195 22.4078H22.4497L19.9482 18.0941C19.7338 17.7176 19.8608 17.2392 20.242 17.0274C20.6232 16.8078 21.1076 16.9412 21.322 17.3176L24.4986 22.8078C24.6415 23.051 24.6415 23.349 24.4986 23.5921C24.3556 23.8353 24.0936 23.9843 23.8156 23.9843H23.8236Z" fill={mapOpen?'#FFF':'#4D4D4D'}/>
                    </svg>
                    <span>Map View</span>
                  </div>
              </div>

              <div className="flex flex-row gap-7">
                  <div className="w-[200px] flex flex-row border border-primary justify-between items-center px-[20px] py-[10px]">
                    <span>Sort By</span>
                    
                    <div className="flex flex-col">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M10.8445 9.625L11.375 9.05898L7 4.375L2.625 9.05898L3.15273 9.625L7 5.50977L10.8445 9.625Z" fill="black"/>
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3.15547 4.375L2.625 4.94101L7 9.625L11.375 4.94102L10.8473 4.375L7 8.49023L3.15547 4.375Z" fill="black"/>
                      </svg>
                    </div>

                  </div>

                  <div className="flex flex-row items-start gap-2">
                      <Switch className="h-5 w-8 mt-[5px] data-[state=checked]:bg-accent"/>
                      <div className="flex flex-col justify-start items-start gap-2">
                        <span className="font-medium text-lg">Member Discounts</span>
                        <span className="font-light">Save up to 15%</span>
                      </div>
                  </div>
              </div>

            </div>



            <div className="w-full h-[100%] flex flex-col gap-9">
             
              {(!mapOpen && !loading) && showHotels()}
              {(!mapOpen && loading) && <span>Loading...</span>}
             
              {mapOpen && <div className="w-full h-[100%] flex flex-row gap-2 "  >
                <MapProvider>
                  <MapComponent hotels={hotels} lat={lat||0} lng={lng||0} newSearch={mapMovedNewSearch} updateVar={updateVar}/>
                </MapProvider>
              </div>}

            </div>

          </div>



      </div>



    </div>
  );
}
