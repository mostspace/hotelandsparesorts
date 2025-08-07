

export const BookingDetails = () => {

    const showStars = () => {
        let compArray:any[] = []

        let stars = 5//props.hotel.star_rating || 5

        for(var i=0; i<stars; i++){
            compArray.push(<svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                <path d="M8.63017 0L10.5678 5.9633L16.838 5.9633L11.7653 9.64883L13.7029 15.6121L8.63017 11.9266L3.55749 15.6121L5.49508 9.64883L0.422391 5.9633L6.69258 5.9633L8.63017 0Z" fill="#A56658"/>
              </svg>)
        }

        return compArray
    }


    return(
    <div className="flex flex-col items-start border border-primary/50 p-[21px] gap-7.5 max-w-[575px]">

        <img className="w-full h-[250px]" src={'./assets/manorHouse.jpg'}/>

        <div className="w-full flex flex-col items-start gap-4">
            <span className="text-4xl" style={{fontFamily:'Harlow'}}>Anantara The Marker Dublin - A Leading Hotel of the World</span>
            <div className="w-full flex flex-col items-start gap-2">
                <div className="w-[130px] flex flex-row gap-2 justify-start">
                    {showStars()}
                </div>
                <span className="text-lg">Grand Canal Square, Docklands, Dublin, D02 CK38, Dublin,</span>
            </div>
        </div>

        <div className="w-full flex flex-col gap-2 text-lg">
            <span className="font-medium">Rooms</span>
            <div className="w-full flex justify-between">
                <span>Premium Room</span>
                <span>£8,235.47</span>
            </div>
        </div>

        <div className="w-full flex flex-col gap-2 text-lg">
            <span className="font-medium">Guests</span>
            <span>1 Adult</span>
        </div>

        <div className="w-full flex flex-col gap-2 text-lg">
            <span className="font-medium">Cancellation policy</span>
            <span>Non - Refundable 1 Aug. 2025 10:30</span>
        </div>

        <div className="w-full flex flex-col gap-2 text-lg">
            <span className="font-medium">Extras</span>
            <span>Free round - trip airport transfer</span>
        </div>

        <div className="w-full flex gap-5 items-start">
            <div className="w-full flex flex-col items-start gap-2">
                <span className="text-xl" style={{fontFamily:'Harlow'}}>Check in</span>
                <span className="text-lg font-medium">Thu Jul 31 2025</span>
                <span className="text-lg">3:00 PM - 12:00 AM</span>
            </div>
            <div className="w-px h-[100px] bg-primary"/>
            <div className="w-full flex flex-col items-start gap-2">
                <span className="text-xl" style={{fontFamily:'Harlow'}}>Check out</span>
                <span className="text-lg font-medium">Thu Aug 21 2025</span>
                <span className="text-lg">Until 12:00 PM</span>
            </div>
        </div>
        

        <span className="text-lg font-medium">{"( 21 nights )"}</span>
        
    </div>
    );

}