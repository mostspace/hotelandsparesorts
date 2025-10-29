"use client";

import { FAQs } from "@/components/general/FAQs";
import { Amenities } from "@/components/hotelProfile/Amenities";
import { HotelImageGallery } from "@/components/hotelProfile/HotelImageGallery";
import { HotelInfoBox } from "@/components/hotelProfile/HotelInfoBox";
import { HotelReview } from "@/components/hotelProfile/HotelReview";
import { RoomTile } from "@/components/hotelProfile/RoomTile";
import { SimilarHotelTile } from "@/components/hotelProfile/SimilarHotelTile";
import { MapComponent } from "@/components/maps/googleMaps";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { MapProvider } from "@/providers/map-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { LoadingPopUp } from "@/components/LoadingPopUp";
import { auth } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ErrorPopUp from "@/components/general/ErrorPopUp";
import { trackViewItem } from "@/utils/dataLayer";



export default function HotelProfileScreen() {

  const router = useRouter();
  // eslint-disable-next-line @next/next/no-async-client-component
  const searchParams = useSearchParams();

  const hidStr = searchParams.get('hid');
  const locationName = searchParams.get('location') || "";

  const checkInDateP = searchParams.get('check-in');
  const checkOutDateP = searchParams.get('check-out');

  const rooms = (searchParams.has('rooms')?JSON.parse(searchParams.get('rooms')||""):[]);

  console.log("SEARCH PARAMS",checkInDateP,checkOutDateP)

  const hid = hidStr ? parseInt(hidStr) : null;

  const [loading, setLoading] = useState(false);

  const [hotel, setHotel] = useState<any>(null);
  const [similarHotels, setSimilarHotels] = useState([]);
  const [tripAdvisorID, setTripAdvisorID] = useState<any>("");

  const [showReviews, setShowReviews] = useState<any>(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<any>(0);

  const [checkInDate, setCheckInDate] = useState<String>(checkInDateP||"");
  const [checkOutDate, setCheckoutDate] = useState<String>(checkOutDateP||"");
  const [loggedIn, setLoggedIn] = useState<any>(false);
  const [tab, setTab] = useState<any>("Key info");

  const [roomIndex, setRoomIndex] = useState(0);
  const [showAllDescription, setShowAllDescription] = useState(false);

  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);


  const reviewsRef = useRef<any>(null);
  const infoBoxRef = useRef<any>(null);


    useEffect(() => {
      let checkIn = searchParams.get('check-in')||"";
      let checkOut = searchParams.get('check-out')||"";
      const hidStr = searchParams.get('hid');

      if(checkIn === ""){
        checkIn = getTodayPlusDay(10)
        setCheckInDate(checkIn)
      }

      if(checkOut === ""){
        checkOut = getTodayPlusDay(12)
        setCheckoutDate(checkOut)
      }
      
      console.log("NEW PARAMS", checkIn,checkOut)
      loadHotel(checkIn,checkOut)


      setCheckInDate(checkIn || "");
      setCheckoutDate(checkOut || "");
    }, [searchParams]);

  useEffect(() => {
        if(auth){
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              setLoggedIn(true)
            }else{
              setLoggedIn(false)
            }
          })
          return () => unsubscribe();
        }
    }, [auth]);// eslint-disable-line react-hooks/exhaustive-deps


  const loadHotel = async (checkIn:string,checkout:string) => {
    setLoading(true)
    const res = await fetch("/api/ratehawk/hotel-page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hid:hid,checkIn:checkIn,checkOut:checkout,rooms}),
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    console.log("Hotel:", data);

    setHotel(data)
    window.scrollTo({
      top: 0,
      behavior: "smooth" // or "auto" for instant jump
    });

    loadSimilarHotels(checkIn,checkout,+data.lat,+data.lng)

    setLat(+data.lat)
    setLng(+data.lng)
  
    if(data.tripadvisor_id != null && data.tripadvisor_id!==0){
      loadReviews(data.tripadvisor_id)
      setTripAdvisorID(data.tripadvisor_id)
    }
    
    // Track view_item event - get lowest price from rates
    if(data.rates && data.rates.length > 0) {
      const lowestRate = data.rates[0];
      const price = lowestRate.payment_options?.payment_types?.[0]?.show_amount || 0;
      trackViewItem(
        data.hid.toString(),
        data.hotel_name,
        parseFloat(price),
        'EUR'
      );
    }
    
    setLoading(false)
    
  }

  const loadSimilarHotels = async (checkIn:string,checkOut:string,lat:number,lng:number) => {
    const res = await fetch("/api/ratehawk/search/geo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        lat:lat,
        lng:lng, 
        checkIn:checkIn, 
        checkOut:checkOut,
        radius:30000,
        rooms:rooms,
        filters:[],
        excludedHid:hid,
        type:"premium"
      }),
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    console.log("Similar Hotels:", data);

    let filteredHotels = data.filter((item: { hid: any; }) => item.hid !== hid);

    setSimilarHotels(filteredHotels)
  }

  const loadReviews = async (locationID:number) => {
    const res = await fetch(`/api/trip-advisor/reviews?locationID=${locationID}`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();

    console.log("REVIEW DATA",data)
    setReviews(data.reviews)
    setRating(data.general.rating)
    setShowReviews(true)
  }


  const showDescriptions = (descArray:any[]) => {

    let compArray:any[] = []
    let paragraphCount = 0

    let structuredArray = []
    let currentTitle = "STARTVALUE"
    var currentParagraphs:any[] = []
    descArray.forEach(element => {
      if(currentTitle!=element.title){
        if(currentTitle!="STARTVALUE"){
          structuredArray.push({
            title:currentTitle,
            paragraphs:currentParagraphs
          })
        }
        currentTitle = element.title
        currentParagraphs = []
      }
      currentParagraphs.push(element.paragraph)
      paragraphCount++
    });

    structuredArray.push({
      title:currentTitle,
      paragraphs:currentParagraphs
    })

    

    structuredArray.forEach(element => {

      let paragraphArray:any[] = []
      element.paragraphs.forEach(paragraph => {
        paragraphArray.push(<span className="leading-snug">{paragraph}</span>)
      });

      compArray.push(<div className="flex flex-col mt-2 w-full h-full">
        {/* <span className="text-lg">{element.title}</span> */}
        <div className="flex flex-col gap-2 w-full h-full leading-snug">
          {paragraphArray}
        </div>
      </div>)
    });


    
    return compArray

  }

  const showStars = () => {
    let compArray:any[] = []

    let stars = hotel.star_rating || 5

    for(var i=0; i<stars; i++){
        compArray.push(<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.65752 0.367798L10.5951 6.3311L16.8653 6.3311L11.7926 10.0166L13.7302 15.9799L8.65752 12.2944L3.58483 15.9799L5.52242 10.0166L0.449735 6.3311L6.71992 6.3311L8.65752 0.367798Z" fill="#A56658"/>
          </svg>)
    }

    return compArray
  }

  const showRates = () => {

    let compArray:any = []

    let rates:any[] = hotel.rates

    if(rates.length>0){compArray.push(<RoomTile images={sortedImages()} rooms={hotel.rooms} rateObj={rates[roomIndex % rates.length]} amountRooms={rooms.length}/>)}
    if(rates.length>1){compArray.push(<RoomTile images={sortedImages()} rooms={hotel.rooms} rateObj={rates[(roomIndex+1) % rates.length]} amountRooms={rooms.length}/>)}
    if(rates.length>2){compArray.push(<RoomTile images={sortedImages()} rooms={hotel.rooms} rateObj={rates[(roomIndex+2) % rates.length]} amountRooms={rooms.length}/>)}
    // if(rates.length>3){compArray.push(<RoomTile images={hotel.images} rateObj={rates[(roomIndex+3) % rates.length]}/>)}


    return compArray
  }
  const showAllRates = () => {

    let compArray:any = []

    let rates:any[] = hotel.rates

    rates.forEach(rate => {
      compArray.push(<RoomTile images={sortedImages()} rooms={hotel.rooms} rateObj={rate} amountRooms={rooms.length}/>)
    });
    return compArray
  }

  const scrollRooms = (direction:number) => {

    if(direction>0){

      if((roomIndex+3)<hotel.rates.length-2){setRoomIndex(roomIndex+3)}
      else if(roomIndex!= hotel.rates.length-2){setRoomIndex(hotel.rates.length-3)}

    }else{
      if((roomIndex-3)>=0){setRoomIndex(roomIndex-3)}
      else if(roomIndex != 0){setRoomIndex(0)}
    }
  }




  const openTripAdvisor = () => {
    window.open("https://tripadvisor.com/"+tripAdvisorID, "_blank", "noopener,noreferrer");
  }


  const showOnMap = () => {
    setTab("Map")
    infoBoxRef.current?.scrollIntoView({ behavior: 'smooth' })
  }


  const getTodayPlusDay = (days: number) => {
    const today = new Date();

    // add days
    today.setDate(today.getDate() + days);

    // format YYYY-MM-DD
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); 
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  const getRatingTitle = () => {

    if(rating>4.5){return "Excellent"}
    else if(rating>3.9){return "Very Good"}
    else if(rating>2.9){return "Average"}
    else if(rating>1.9){return "Poor"}
    else{return "Terrible"}

  }

  const sortedImages = () => {
    let images: any[] = hotel.images;

    const priorityOrder: Record<string, number> = {
      lead: 0,        // highest priority (by image_type)
      lobby: 1,       // next
      exterior: 2,    // then
    };

    const sorted = images.slice().sort((a, b) => {
      // First check if image_type is "lead"
      const rankA =
        a.image_type?.toLowerCase() === "lead"
          ? priorityOrder["lead"]
          : priorityOrder[a.title?.toLowerCase()] || 99;

      const rankB =
        b.image_type?.toLowerCase() === "lead"
          ? priorityOrder["lead"]
          : priorityOrder[b.title?.toLowerCase()] || 99;

      if (rankA !== rankB) return rankA - rankB; // sort by rank
      return 0; // keep original order if rank same
    });

    return sorted;
  };


  const goHome = () => {
    router.push(`/`)
  }

  const goBackToSearch = () => {
    let searchID = Math.random().toString(16).slice(-8)
    router.push(`/search?searchID=${searchID}&location=${locationName}&lat=${lat}&lng=${lng}&check-in=${checkInDate}&check-out=${checkOutDate}&rooms=${JSON.stringify(rooms)}`)
  }

    
  return (
    <>
    <Head>
      <meta name="robots" content="noindex, nofollow" />
    </Head>

    <div className="w-full flex flex-col items-center text-primary gap-[1000px] bg-light" >
      
      {/* <span>HOTEL PROFILE PAGE</span> */}

      {loading && <span>Loading...</span>}
      {loading && <LoadingPopUp title="Step Inside…" subtitle="Sit back while we open the doors to this luxury destination."/>}

   
      {hotel &&<div className="w-full flex flex-col items-center" >
        
        {/* TOP SECTION */}
        <div className="w-full bg-muted flex justify-center">

        <div className="w-full lg:px-[11%] xl:px-[5.5%] 2xl:px-[7%] px-5 py-[55px] flex flex-col gap-[60px] items-start breakingPoint">
            
            {/* BREADCRUMBS */}
            <div className="flex flex-row items-center gap-2 flex-wrap">
                <span className="hover:underline cursor-pointer" onClick={goHome}>Home</span>
                <span>{">"}</span>
                {locationName!=="" && <span className="line-clamp-1 hover:underline cursor-pointer" onClick={goBackToSearch}>Hotels in {locationName}</span>}
                {locationName!=="" && <span>{">"}</span>}
                <span className="line-clamp-1">{hotel.hotel_name}</span>
            </div>

            {/* Hotel Basic Details */}
            <div className="w-full flex flex-col gap-5 items-start">
                <span className="text-5xl" style={{fontFamily:'Harlow'}}>{(hotel.hotel_name).toUpperCase()}</span>
                <div className="w-full flex md:flex-row flex-col justify-between md:items-center items-start">
                    <div className="flex md:flex-row flex-col gap-10 text-lg md:items-center items-start">
                        
                        <div className="flex flex-row gap-2.5 items-center">
                          <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 7.79413C15 3.63972 11.6544 0.294128 7.5 0.294128C3.34559 0.294128 0 3.63972 0 7.79413C0 11.9485 7.5 19.7059 7.5 19.7059C7.5 19.7059 15 11.9485 15 7.79413ZM4.00735 7.64707C4.00735 5.73531 5.58823 4.15442 7.5 4.15442C9.41176 4.15442 10.9926 5.69854 10.9926 7.64707C10.9926 9.55883 9.44853 11.1397 7.5 11.1397C5.58823 11.1397 4.00735 9.55883 4.00735 7.64707Z" fill="#A56658"/>
                          </svg>
                          <span>{hotel.address}</span>
                          <span className="underline ml-2 cursor-pointer text-right"  onClick={showOnMap}>View on Map</span>
                        </div>

                        <div className="hidden md:block h-[20px] w-px bg-primary"/>

                        <div className="flex flex-row items-center gap-4">
                            <span>{hotel.star_rating} Star</span>
                            <div className="flex flex-row items-center gap-1">
                            {showStars()}
                            </div>
                        </div>
                    </div>

                    {showReviews&& <div className="flex flex-row items-center gap-3.5">
                      <span className="text-lg underline cursor-pointer" onClick={()=>(reviewsRef.current?.scrollIntoView({ behavior: 'smooth' }))}>See Reviews</span>
                      <div className="bg-accent p-[8px] font-medium text-xl text-light rounded-[10px]">{rating}</div>
                      {/* <div className="cursor-pointer w-[42px] h-[42px] rounded-full bg-accent flex items-center justify-center">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.9688 5.76563C22.9395 5.76563 25.3535 8.18555 25.3535 11.1738C25.3535 12.709 24.7148 14.0918 23.6953 15.0762L15 23.8535L6.15234 14.918C5.22656 13.9453 4.65234 12.627 4.65234 11.1738C4.65234 8.18555 7.06055 5.76563 10.0371 5.76563C12.2754 5.76563 14.1914 7.13672 15.0059 9.09375C15.8086 7.14258 17.7305 5.76563 19.9688 5.76563ZM19.9688 4.86328C17.9883 4.86328 16.1719 5.78906 15 7.3125C13.8281 5.78906 12.0117 4.86328 10.0312 4.86328C6.56836 4.86328 3.75 7.69336 3.75 11.1738C3.75 12.8086 4.37109 14.3613 5.50195 15.5449L14.3613 24.4922L15 25.1367L15.6387 24.4922L24.3281 15.7148C25.5586 14.5254 26.25 12.9082 26.25 11.1738C26.25 7.69336 23.4316 4.86328 19.9688 4.86328Z" fill="white"/>
                        </svg>
                      </div> */}
                    </div>}

                </div>
            </div>


            {/* Image Gallery */}
            <HotelImageGallery images={sortedImages()}/>

            
        </div>
        </div>

        {/* MAIN SECTION */}
        <div className="w-full lg:px-[11%] xl:px-[5.5%] 2xl:px-[7%] px-5 py-[100px] flex flex-col gap-[80px] bg-light breakingPoint">

            {/* BIO SECTION */}
            <div className=" flex md:flex-row flex-col items-start gap-12">
              
              <div className="w-full flex flex-col gap-[60px] items-start">
                  <Amenities amenityList={hotel.amenities} source="profile"/>

                  <div className="w-full flex flex-col gap-8 items-start">
                      <span className="text-5xl" style={{fontFamily:'Harlow'}}>Overview</span>
                      <span className={`text-lg max-w-[975px] ${showAllDescription?"":"max-h-[170px]"} overflow-hidden`}>{ 
                        showDescriptions(hotel.hotelDescriptions.filter((descr: { kind: string; }) => descr.kind === "description")
                        .sort((a:any, b:any) => (a.title === "Location" ? -1 : b.title === "Location" ? 1 : 0)))
                        }</span>
                      <span className="text-lg font-bold underline cursor-pointer" onClick={()=>setShowAllDescription(!showAllDescription)}>{showAllDescription?"Read less":"Read more"}</span>
                  </div>

              </div>

              <div className="flex flex-col w-full md:w-[600px] gap-5">

                <div className="relative h-[280px] w-full p-[10px] rounded-[20px] bg-muted">
                  <MapProvider>
                    <MapComponent hotels={[hotel]} lat={+hotel.lat||0} lng={+hotel.lng||0} newSearch={null} updateVar={2} mini={true} source={"profileMini"}/>
                  </MapProvider>
                  <Button className="absolute top-1/2 left-1/2 -translate-x-1/2 z-10 bg-accent hover:bg-accent/90 border border-light" onClick={showOnMap}>VIEW ON MAP</Button>

                </div>
                
                {!loggedIn && <div className="w-full flex flex-col p-[30px] gap-8 items-center text-light bg-[#774D46]">
                  <span className="text-4xl text-center" style={{fontFamily:'Harlow'}}>Unlock exclusive discounts at thousands of top hotels</span>
                  <Button className="bg-transparent hover:bg-light/10 border border-light" onClick={()=>router.push('/login')}>UNLOCK FOR FREE</Button>
                </div>}
              </div>


              

            </div>

            {/* DATES SECTION */}
            <div className="w-full flex flex-col gap-10 items-start">
                <span className="text-5xl" style={{fontFamily:'Harlow'}}>Modify your dates:</span>
                <SearchBar showLocation={false} showBorders={true} existingData={{hid,checkInDate,checkOutDate,rooms}}/>
            </div>

            {/* ROOMS SECTION */}
            <div className="w-full flex flex-col gap-10 items-start">
                <span className="text-5xl" style={{fontFamily:'Harlow'}}>Select your room:</span>
                {hotel.rates.length>0 && <div className="w-full flex flex-row gap-5 items-center">
                  <Button className="hidden md:block h-[42px] w-[42px] z-5 bg-light/78 hover:bg-primary/5 rounded-[10px]  border border-primary" onClick={()=>scrollRooms(-1)} disabled={roomIndex===0}>
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M25.002 16.0001C25.002 16.5523 24.5547 17.0001 24.002 17.0001H9.8672L14.8301 24.4454C15.1367 24.9049 15.0127 25.526 14.5528 25.8321C14.3818 25.9459 14.1895 26.0001 13.999 26.0001C13.6758 26.0001 13.3584 25.8438 13.166 25.5548L6.7959 16.0001L13.166 6.44538C13.4717 5.98538 14.0908 5.86088 14.5527 6.16808C15.0127 6.47428 15.1367 7.09528 14.83 7.55478L9.8672 15.0001H24.002C24.5547 15.0001 25.002 15.4479 25.002 16.0001Z" fill="#333337"/>
                      </svg>
                  </Button>
                  <div className="w-full hidden md:flex flex-row gap-5 justify-center items-center flex-wrap">
                    {showRates()}
                  </div>
                  <div className="w-full md:hidden flex flex-col gap-10 items-center">
                      {showAllRates()}
                  </div>
                  <Button className="hidden md:block h-[42px] w-[42px] z-5 bg-light/78 hover:bg-primary/5 rounded-[10px]  border border-primary" onClick={()=>scrollRooms(1)} disabled={roomIndex===hotel.rates.length-4 || hotel.rates.length<4}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.998 15.9999C6.998 15.4477 7.4453 14.9999 7.998 14.9999L22.1328 14.9999L17.1699 7.55462C16.8633 7.09512 16.9873 6.47402 17.4472 6.16792C17.6182 6.05412 17.8105 5.99992 18.001 5.99992C18.3242 5.99992 18.6416 6.15622 18.834 6.44522L25.2041 15.9999L18.834 25.5546C18.5283 26.0146 17.9092 26.1391 17.4473 25.8319C16.9873 25.5257 16.8633 24.9047 17.17 24.4452L22.1328 16.9999L7.998 16.9999C7.4453 16.9999 6.998 16.5521 6.998 15.9999Z" fill="#333337"/>
                        </svg>
                    </Button>
                </div>}
                {hotel.rates.length === 0 && <span className="text-4xl font-medium text-accent">Unfortunately, there are no rooms available for the dates you have selected.</span>}
            </div>

            {/* INFO SECTION */}
            <div className="mt-[20px] mb-[20px]" ref={infoBoxRef}>
                <HotelInfoBox hotel={hotel} tab={tab} setTab={setTab}/>
            </div>

            {/* REVIEWS SECTION */}
            {showReviews && <div className="w-full flex flex-col gap-10 items-start" ref={reviewsRef}>
                <span className="text-5xl" style={{fontFamily:'Harlow'}}>REVIEWS</span>

                <div className="p-[21px] flex flex-row gap-5 items-center bg-muted/50 border border-accent rounded-[10px] cursor-pointer" onClick={openTripAdvisor}>
                    <span className="text-5xl" style={{fontFamily:'Harlow'}}>{rating}</span>
                    <div className="flex flex-col items-start">
                        <span className="text-lg font-bold">{getRatingTitle()}</span>
                        <span>Verified Reviews</span>
                    </div>
                    <svg width="46" height="47" viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="22.8687" cy="23.5" r="22.8687" fill="#34E0A1"/>
                      <path d="M30.3498 22.8763C29.8339 22.8743 29.329 23.0255 28.8992 23.3108C28.4693 23.5961 28.1339 24.0027 27.9355 24.479C27.7372 24.9552 27.6847 25.4797 27.7848 25.9858C27.885 26.4919 28.1332 26.9568 28.498 27.3216C28.8628 27.6864 29.3278 27.9346 29.8339 28.0348C30.34 28.1349 30.8644 28.0825 31.3407 27.8841C31.8169 27.6857 32.2235 27.3503 32.5088 26.9205C32.7942 26.4906 32.9454 25.9857 32.9433 25.4698C32.9405 24.7828 32.6664 24.1248 32.1806 23.639C31.6948 23.1532 31.0368 22.8791 30.3498 22.8763ZM35.3268 20.0623L37.6998 17.4478H32.3448C29.5946 15.559 26.3362 14.5485 22.9998 14.5498C19.6316 14.5433 16.3391 15.5493 13.5498 17.4373H8.2998L10.6518 20.0098C10.3071 20.3258 9.99732 20.6778 9.7278 21.0598C8.62976 22.5283 8.12025 24.3542 8.2993 26.179C8.47835 28.0039 9.33302 29.6959 10.6955 30.923C12.0581 32.15 13.83 32.8235 15.6636 32.8112C17.4972 32.7988 19.2599 32.1016 20.6058 30.8563L22.9998 33.4498L25.3413 30.8878C26.7228 32.1856 28.5522 32.8995 30.4476 32.8804C32.3429 32.8613 34.1576 32.1108 35.5127 30.7855C36.8679 29.4602 37.6586 27.6626 37.7198 25.7682C37.781 23.8737 37.108 22.0289 35.8413 20.6188C35.6705 20.4227 35.4881 20.2369 35.2953 20.0623H35.3268ZM15.6498 30.4258C14.6696 30.4258 13.7114 30.1352 12.8964 29.5906C12.0814 29.046 11.4462 28.272 11.0711 27.3664C10.6959 26.4608 10.5978 25.4643 10.789 24.503C10.9803 23.5416 11.4523 22.6585 12.1454 21.9654C12.8385 21.2723 13.7216 20.8003 14.6829 20.6091C15.6443 20.4178 16.6408 20.516 17.5464 20.8911C18.452 21.2662 19.226 21.9014 19.7706 22.7164C20.3151 23.5314 20.6058 24.4896 20.6058 25.4698C20.6058 26.7842 20.0837 28.0448 19.1542 28.9743C18.2248 29.9037 16.9642 30.4258 15.6498 30.4258ZM22.9998 25.4698C22.9998 21.9103 20.6058 19.3168 17.5188 18.1198C19.2332 17.3222 21.1096 16.934 22.9998 16.9858C24.8785 16.9234 26.7455 17.3047 28.4493 18.0988C26.9125 18.6488 25.574 19.6432 24.6037 20.9556C23.6333 22.2681 23.0751 23.8394 22.9998 25.4698ZM30.3498 30.4573C29.3696 30.4573 28.4114 30.1667 27.5964 29.6221C26.7814 29.0775 26.1462 28.3035 25.7711 27.3979C25.3959 26.4923 25.2978 25.4958 25.489 24.5345C25.6803 23.5731 26.1523 22.69 26.8454 21.9969C27.5385 21.3038 28.4216 20.8318 29.3829 20.6406C30.3443 20.4493 31.3408 20.5475 32.2464 20.9226C33.152 21.2977 33.926 21.9329 34.4706 22.7479C35.0151 23.5629 35.3058 24.5211 35.3058 25.5013C35.3058 26.8157 34.7837 28.0763 33.8542 29.0058C32.9248 29.9352 31.6642 30.4573 30.3498 30.4573ZM18.2433 25.4698C18.2433 25.9828 18.0912 26.4842 17.8062 26.9107C17.5212 27.3372 17.1162 27.6696 16.6423 27.8659C16.1684 28.0622 15.6469 28.1136 15.1438 28.0135C14.6407 27.9134 14.1786 27.6664 13.8159 27.3037C13.4532 26.941 13.2062 26.4789 13.1061 25.9758C13.0061 25.4727 13.0574 24.9512 13.2537 24.4773C13.45 24.0034 13.7824 23.5984 14.2089 23.3134C14.6354 23.0284 15.1369 22.8763 15.6498 22.8763C15.9904 22.8763 16.3276 22.9434 16.6423 23.0738C16.9569 23.2041 17.2429 23.3951 17.4837 23.636C17.7245 23.8768 17.9155 24.1627 18.0459 24.4773C18.1762 24.792 18.2433 25.1293 18.2433 25.4698Z" fill="black"/>
                    </svg>
                </div>


                <div className="w-full flex md:flex-row flex-col md:gap-[150px] gap-[50px] items-start">
                  {reviews.length>0 && <HotelReview review={reviews[0]}/>}
                  {reviews.length>1 && <HotelReview review={reviews[1]}/>}
                  {reviews.length>2 && <HotelReview review={reviews[2]}/>}
                  {reviews.length>3 && <HotelReview review={reviews[3]}/>}

                </div>


            </div>}


            {/* FAQ SECTION */}
            <FAQs />

        </div>

         {/* SIMILAR HOTELS */}
         <div className="w-full bg-[#D6C6B9] flex justify-center">
          <div className="w-full lg:px-[11%] xl:px-[5.5%] 2xl:px-[7%] px-5 py-[120px] flex flex-col gap-[80px] bg-[#D6C6B9] breakingPoint"> 
            <span className="text-5xl" style={{fontFamily:'Harlow'}}>SIMILAR HOTELS IN {locationName.toUpperCase()}</span>
            <div className="w-full flex md:flex-row flex-col gap-[50px]">
              {similarHotels.length > 0 && <SimilarHotelTile hotel={similarHotels[0]} checkIn={checkInDateP+""} checkOut={checkOutDateP+""} rooms={rooms} source="similarHotel" locationName={locationName} />}
              {similarHotels.length > 1 && <SimilarHotelTile hotel={similarHotels[1]} checkIn={checkInDateP+""} checkOut={checkOutDateP+""} rooms={rooms} source="similarHotel" locationName={locationName} />}
              {similarHotels.length > 2 && <SimilarHotelTile hotel={similarHotels[2]} checkIn={checkInDateP+""} checkOut={checkOutDateP+""} rooms={rooms} source="similarHotel" locationName={locationName} />}

            </div>
         </div>
         </div>

      </div>}
















    </div>
    </>
  );
}
