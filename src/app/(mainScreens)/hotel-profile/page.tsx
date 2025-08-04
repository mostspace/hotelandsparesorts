"use client";

import { FAQs } from "@/components/general/FAQs";
import { Amenities } from "@/components/hotelProfile/Amenities";
import { HotelImageGallery } from "@/components/hotelProfile/HotelImageGallery";
import { HotelInfoBox } from "@/components/hotelProfile/HotelInfoBox";
import { HotelReview } from "@/components/hotelProfile/HotelReview";
import { RoomTile } from "@/components/hotelProfile/RoomTile";
import { SimiilarHotelTile } from "@/components/hotelProfile/SimilarHotelTile";
import { MapComponent } from "@/components/maps/googleMaps";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { MapProvider } from "@/providers/map-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HotelProfileScreen() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const hidStr = searchParams.get('hid');

  const checkInDateP = searchParams.get('check-in');
  const checkOutDateP = searchParams.get('check-out');

  const adults = +(searchParams.get('adults')||1);
  const children = +(searchParams.get('children')||1);

  console.log("SEARCH PARAMS",checkInDateP,checkOutDateP)

  const hid = hidStr ? parseInt(hidStr) : null;

  const [loading, setLoading] = useState(false);

  const [hotel, setHotel] = useState<any>(null);
  const [similarHotels, setSimilarHotels] = useState([]);

  const [reviews, setReviews] = useState<any[]>([]);
  const [checkInDate, setCheckInDate] = useState<String>(checkInDateP||"");
  const [checkOutDate, setCheckoutDate] = useState<String>(checkOutDateP||"");


    useEffect(() => {
      const checkIn = searchParams.get('check-in')||"";
      const checkOut = searchParams.get('check-out')||"";
      const hidStr = searchParams.get('hid');
      
      console.log("NEW PARAMS", checkIn,checkOut)
      loadHotel(checkIn,checkOut)


      setCheckInDate(checkIn || "");
      setCheckoutDate(checkOut || "");
    }, [searchParams]);

  const loadHotel = async (checkIn:string,checkout:string) => {
    setLoading(true)
    const res = await fetch("/api/ratehawk/hotel-page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hid:hid,checkIn:checkIn,checkOut:checkout}),
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    console.log("Hotel:", data);

    setHotel(data)
    loadSimilarHotels(checkIn,checkout,+data.lat,+data.lng)

  
    if(data.tripadvisor_id != null && data.tripadvisor_id!==0){
      loadReviews(data.tripadvisor_id)
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
        radius:3000,
        adults:2,
        children:0,
        filters:[],
        excludedHid:hid
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
    setReviews(data)
  }


  const showDescriptions = (descArray:any[]) => {

    let compArray:any[] = []

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

      compArray.push(<div className="flex flex-col gap-2 w-full h-full">
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

    let stars = hotel.star_ratingz || 5

    for(var i=0; i<stars; i++){
        compArray.push(<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.65752 0.367798L10.5951 6.3311L16.8653 6.3311L11.7926 10.0166L13.7302 15.9799L8.65752 12.2944L3.58483 15.9799L5.52242 10.0166L0.449735 6.3311L6.71992 6.3311L8.65752 0.367798Z" fill="#A56658"/>
          </svg>)
    }

    return compArray
  }


  




    
  return (
    <div className="w-full flex flex-col items-center text-primary gap-[1000px]" >
      
      {/* <span>HOTEL PROFILE PAGE</span> */}

      {loading && <span>Loading...</span>}

   
      {hotel &&<div className="w-full flex flex-col items-center" >
        
        {/* TOP SECTION */}
        <div className="w-full px-[120px] py-[55px] flex flex-col gap-[60px] items-start bg-muted">
            
            {/* BREADCRUMBS */}
            <div className="flex flex-row items-center gap-2">
                <span>Home</span>
                <span>{">"}</span>
                <span>Hotels in London</span>
                <span>{">"}</span>
                <span>{hotel.hotel_name}</span>
            </div>

            {/* Hotel Basic Details */}
            <div className="w-full flex flex-col gap-5 items-start">
                <span className="text-5xl" style={{fontFamily:'Harlow'}}>{(hotel.hotel_name).toUpperCase()}</span>
                <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-10 text-lg items-center">
                        
                        <div className="flex flex-row gap-2.5 items-center">
                          <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 7.79413C15 3.63972 11.6544 0.294128 7.5 0.294128C3.34559 0.294128 0 3.63972 0 7.79413C0 11.9485 7.5 19.7059 7.5 19.7059C7.5 19.7059 15 11.9485 15 7.79413ZM4.00735 7.64707C4.00735 5.73531 5.58823 4.15442 7.5 4.15442C9.41176 4.15442 10.9926 5.69854 10.9926 7.64707C10.9926 9.55883 9.44853 11.1397 7.5 11.1397C5.58823 11.1397 4.00735 9.55883 4.00735 7.64707Z" fill="#A56658"/>
                          </svg>
                          <span>{hotel.address}</span>
                        </div>

                        <div className="h-[20px] w-px bg-primary"/>

                        <div className="flex flex-row items-center gap-4">
                            <span>{hotel.star_rating} Star</span>
                            <div className="flex flex-row items-center gap-1">
                            {showStars()}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row items-center gap-3.5">
                      <span className="text-lg underline cursor-pointer">See Reviews</span>
                      <div className="bg-accent p-[8px] font-medium text-xl text-light rounded-[10px]">9.6</div>
                      <div className="cursor-pointer w-[42px] h-[42px] rounded-full bg-accent flex items-center justify-center">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.9688 5.76563C22.9395 5.76563 25.3535 8.18555 25.3535 11.1738C25.3535 12.709 24.7148 14.0918 23.6953 15.0762L15 23.8535L6.15234 14.918C5.22656 13.9453 4.65234 12.627 4.65234 11.1738C4.65234 8.18555 7.06055 5.76563 10.0371 5.76563C12.2754 5.76563 14.1914 7.13672 15.0059 9.09375C15.8086 7.14258 17.7305 5.76563 19.9688 5.76563ZM19.9688 4.86328C17.9883 4.86328 16.1719 5.78906 15 7.3125C13.8281 5.78906 12.0117 4.86328 10.0312 4.86328C6.56836 4.86328 3.75 7.69336 3.75 11.1738C3.75 12.8086 4.37109 14.3613 5.50195 15.5449L14.3613 24.4922L15 25.1367L15.6387 24.4922L24.3281 15.7148C25.5586 14.5254 26.25 12.9082 26.25 11.1738C26.25 7.69336 23.4316 4.86328 19.9688 4.86328Z" fill="white"/>
                        </svg>
                      </div>
                    </div>

                </div>
            </div>


            {/* Image Gallery */}
            <HotelImageGallery images={hotel.images}/>

            
        </div>

        {/* MAIN SECTION */}
        <div className="w-full p-[120px] flex flex-col gap-[80px] bg-light">

            {/* BIO SECTION */}
            <div className=" flex flex-row items-start gap-12">
              
              <div className="w-full flex flex-col gap-[60px] items-start">
                  <Amenities amenityList={hotel.amenities} source="profile"/>

                  <div className="w-full flex flex-col gap-8 items-start">
                      <span className="text-5xl" style={{fontFamily:'Harlow'}}>Overview</span>
                      <span className={`text-lg max-w-[975px] max-h-[170px] overflow-hidden`}>{ showDescriptions(hotel.hotelDescriptions.filter((descr: { kind: string; }) => descr.kind === "description"))}</span>
                      <span className="text-lg font-bold underline cursor-pointer">Read more</span>
                  </div>

              </div>

              <div className="flex flex-col w-[455px] gap-5">

                <div className="h-[280px] w-full p-[10px] rounded-[20px] bg-muted">
                  <MapProvider>
                    <MapComponent hotels={[hotel]} lat={+hotel.lat||0} lng={+hotel.lng||0} newSearch={null} updateVar={2} mini={true}/>
                  </MapProvider>
                </div>
                
                <div className="w-full flex flex-col p-[30px] gap-8 items-center text-light bg-[#774D46]">
                  <span className="text-4xl text-center" style={{fontFamily:'Harlow'}}>Unlock exclusive discounts at hundreds of top hotels</span>
                  <Button className="bg-transparent border border-light">UNLOCK FOR FREE</Button>
                </div>
              </div>


              

            </div>

            {/* DATES SECTION */}
            <div className="w-full flex flex-col gap-10 items-start">
                <span className="text-5xl" style={{fontFamily:'Harlow'}}>Modify your dates:</span>
                <SearchBar showLocation={false} showBorders={true} existingData={{hid:hid,checkInDate:checkInDate,checkOutDate:checkOutDate}}/>
            </div>

            {/* ROOMS SECTION */}
            <div className="w-full flex flex-col gap-10 items-start">
                <span className="text-5xl" style={{fontFamily:'Harlow'}}>Select your room:</span>
                <div className="w-full flex flex-row gap-5 items-start">
                  <RoomTile images={hotel.images} rateObj={hotel.rates[0]}/>
                  <RoomTile images={hotel.images} rateObj={hotel.rates[1]}/>
                  <RoomTile images={hotel.images} rateObj={hotel.rates[2]}/>
                  <RoomTile images={hotel.images} rateObj={hotel.rates[3]}/>
                </div>
            </div>

            {/* INFO SECTION */}
            <div className="mt-[20px] mb-[20px]">
                <HotelInfoBox hotel={hotel}/>
            </div>

            {/* REVIEWS SECTION */}
            <div className="w-full flex flex-col gap-10 items-start">
                <span className="text-5xl" style={{fontFamily:'Harlow'}}>REVIEWS</span>

                <div className="p-[21px] flex flex-row gap-5 items-center bg-muted/50 border border-accent rounded-[10px]">
                    <span className="text-5xl" style={{fontFamily:'Harlow'}}>4.6</span>
                    <div className="flex flex-col items-start">
                        <span className="text-lg font-bold">Excellent</span>
                        <span>Verified Reviews</span>
                    </div>
                    <svg width="46" height="47" viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="22.8687" cy="23.5" r="22.8687" fill="#34E0A1"/>
                      <path d="M30.3498 22.8763C29.8339 22.8743 29.329 23.0255 28.8992 23.3108C28.4693 23.5961 28.1339 24.0027 27.9355 24.479C27.7372 24.9552 27.6847 25.4797 27.7848 25.9858C27.885 26.4919 28.1332 26.9568 28.498 27.3216C28.8628 27.6864 29.3278 27.9346 29.8339 28.0348C30.34 28.1349 30.8644 28.0825 31.3407 27.8841C31.8169 27.6857 32.2235 27.3503 32.5088 26.9205C32.7942 26.4906 32.9454 25.9857 32.9433 25.4698C32.9405 24.7828 32.6664 24.1248 32.1806 23.639C31.6948 23.1532 31.0368 22.8791 30.3498 22.8763ZM35.3268 20.0623L37.6998 17.4478H32.3448C29.5946 15.559 26.3362 14.5485 22.9998 14.5498C19.6316 14.5433 16.3391 15.5493 13.5498 17.4373H8.2998L10.6518 20.0098C10.3071 20.3258 9.99732 20.6778 9.7278 21.0598C8.62976 22.5283 8.12025 24.3542 8.2993 26.179C8.47835 28.0039 9.33302 29.6959 10.6955 30.923C12.0581 32.15 13.83 32.8235 15.6636 32.8112C17.4972 32.7988 19.2599 32.1016 20.6058 30.8563L22.9998 33.4498L25.3413 30.8878C26.7228 32.1856 28.5522 32.8995 30.4476 32.8804C32.3429 32.8613 34.1576 32.1108 35.5127 30.7855C36.8679 29.4602 37.6586 27.6626 37.7198 25.7682C37.781 23.8737 37.108 22.0289 35.8413 20.6188C35.6705 20.4227 35.4881 20.2369 35.2953 20.0623H35.3268ZM15.6498 30.4258C14.6696 30.4258 13.7114 30.1352 12.8964 29.5906C12.0814 29.046 11.4462 28.272 11.0711 27.3664C10.6959 26.4608 10.5978 25.4643 10.789 24.503C10.9803 23.5416 11.4523 22.6585 12.1454 21.9654C12.8385 21.2723 13.7216 20.8003 14.6829 20.6091C15.6443 20.4178 16.6408 20.516 17.5464 20.8911C18.452 21.2662 19.226 21.9014 19.7706 22.7164C20.3151 23.5314 20.6058 24.4896 20.6058 25.4698C20.6058 26.7842 20.0837 28.0448 19.1542 28.9743C18.2248 29.9037 16.9642 30.4258 15.6498 30.4258ZM22.9998 25.4698C22.9998 21.9103 20.6058 19.3168 17.5188 18.1198C19.2332 17.3222 21.1096 16.934 22.9998 16.9858C24.8785 16.9234 26.7455 17.3047 28.4493 18.0988C26.9125 18.6488 25.574 19.6432 24.6037 20.9556C23.6333 22.2681 23.0751 23.8394 22.9998 25.4698ZM30.3498 30.4573C29.3696 30.4573 28.4114 30.1667 27.5964 29.6221C26.7814 29.0775 26.1462 28.3035 25.7711 27.3979C25.3959 26.4923 25.2978 25.4958 25.489 24.5345C25.6803 23.5731 26.1523 22.69 26.8454 21.9969C27.5385 21.3038 28.4216 20.8318 29.3829 20.6406C30.3443 20.4493 31.3408 20.5475 32.2464 20.9226C33.152 21.2977 33.926 21.9329 34.4706 22.7479C35.0151 23.5629 35.3058 24.5211 35.3058 25.5013C35.3058 26.8157 34.7837 28.0763 33.8542 29.0058C32.9248 29.9352 31.6642 30.4573 30.3498 30.4573ZM18.2433 25.4698C18.2433 25.9828 18.0912 26.4842 17.8062 26.9107C17.5212 27.3372 17.1162 27.6696 16.6423 27.8659C16.1684 28.0622 15.6469 28.1136 15.1438 28.0135C14.6407 27.9134 14.1786 27.6664 13.8159 27.3037C13.4532 26.941 13.2062 26.4789 13.1061 25.9758C13.0061 25.4727 13.0574 24.9512 13.2537 24.4773C13.45 24.0034 13.7824 23.5984 14.2089 23.3134C14.6354 23.0284 15.1369 22.8763 15.6498 22.8763C15.9904 22.8763 16.3276 22.9434 16.6423 23.0738C16.9569 23.2041 17.2429 23.3951 17.4837 23.636C17.7245 23.8768 17.9155 24.1627 18.0459 24.4773C18.1762 24.792 18.2433 25.1293 18.2433 25.4698Z" fill="black"/>
                    </svg>
                </div>


                <div className="w-full flex flex-row gap-[160px] items-start">
                  {reviews.length>0 && <HotelReview review={reviews[0]}/>}
                  {reviews.length>1 && <HotelReview review={reviews[1]}/>}
                  {reviews.length>2 && <HotelReview review={reviews[2]}/>}

                </div>


            </div>


            {/* FAQ SECTION */}
            <FAQs />


           

  
        </div>

         {/* SIMILAR HOTELS */}
         <div className="w-full p-[120px] flex flex-col gap-[80px] bg-[#D6C6B9]">
            <span className="text-5xl" style={{fontFamily:'Harlow'}}>SIMILAR HOTELS IN DUBLIN</span>
            <div className="w-full flex flex-row gap-[50px]">
              {similarHotels.length > 0 && <SimiilarHotelTile hotel={similarHotels[0]} checkIn={checkInDateP+""} checkOut={checkOutDateP+""} adults={+adults} children={+children}/>}
              {similarHotels.length > 1 && <SimiilarHotelTile hotel={similarHotels[1]} checkIn={checkInDateP+""} checkOut={checkOutDateP+""} adults={+adults} children={+children}/>}
              {similarHotels.length > 2 && <SimiilarHotelTile hotel={similarHotels[2]} checkIn={checkInDateP+""} checkOut={checkOutDateP+""} adults={+adults} children={+children}/>}

            </div>
         </div>

      </div>}


















      {/* {hotel && <div className="flex flex-col items-start gap-10">
        
        <div className="flex flex-row item-centre">
          {showImages()}
        </div>

        <div className="flex flex-col justify-start">
          <span className="text-2xl max-w-xs	">{hotel.hotel_name}</span>
          <span className="text-sm">{hotel.address}</span>
          <span className="text-sm">{hotel.email}</span>
        </div>

        <div className="flex flex-col justify-start gap-3">
          <span className="text-xl">Description</span>
          {showDescriptions(hotel.hotelDescriptions.filter((descr: { kind: string; }) => descr.kind === "description"))}
        </div>


        <div className="flex flex-col justify-start">
        <span className="text-xl">Rates</span>
          <div className="flex flex-row gap-8">
          {!loading &&<div className="flex flex-col justify-start">
             {showRates()}
          </div>}
          {loading && <span>Loading...</span>}

            <Button onClick={changeDate}>Next Month</Button>
          </div>
        </div>



         <div className="flex flex-col justify-start gap-3">
          <span className="text-xl">Policies</span>
          {showDescriptions(hotel.hotelDescriptions.filter((descr: { kind: string; }) => descr.kind === "policy"))}

        </div>

        <div className="flex flex-col justify-start gap-10">
          <span className="text-xl">Reviews</span>
          {showReviews()}

        </div>

        
      </div>} */}

    </div>
  );
}
