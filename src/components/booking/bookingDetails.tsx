
interface BookingProps {
    booking:any
}


export const BookingDetails = (props:BookingProps) => {

    const showStars = () => {
        let compArray:any[] = []

        let stars = props.booking.hotel.star_rating || 4

        for(var i=0; i<stars; i++){
            compArray.push(<svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                <path d="M8.63017 0L10.5678 5.9633L16.838 5.9633L11.7653 9.64883L13.7029 15.6121L8.63017 11.9266L3.55749 15.6121L5.49508 9.64883L0.422391 5.9633L6.69258 5.9633L8.63017 0Z" fill="#A56658"/>
              </svg>)
        }

        return compArray
    }

    const formatTime = (time:string) => {

        const formatted = new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

        return formatted
    }

    const formatDate = (dateStr:string) => {
        const date = new Date(dateStr);

        const formatted = date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric"
        });
        
        return (formatted); // Wed, Oct 15, 2025
    }

    const amountOfDays = () => {
        const checkIn = new Date(props.booking.check_in);
        const checkOut = new Date(props.booking.check_out);

        const diffTime = checkOut.getTime() - checkIn.getTime(); // milliseconds difference
        const diffDays = diffTime / (1000 * 60 * 60 * 24); // convert to days

        return diffDays + (diffDays>1?" nights":" night")

    }

    const getImageURL = () => {
        var imageUrl 

        if(props.booking.hotel.images.length > 0)
        {
            const exterior = props.booking.hotel.images.filter((img: { title: string }) => img.title === "exterior");
            const lobby = props.booking.hotel.images.filter((img: { title: string }) => img.title === "lobby");

            if(exterior.length>0){imageUrl = exterior[0].url}
            else if(lobby.length>0){imageUrl = lobby[0].url}
            else{imageUrl = props.booking.hotel.images[0].url}
            
            return imageUrl.replace('{size}','x500')
        }else{
            return ""
        }
    }


    return(
    <div className="flex flex-col items-start border border-primary/50 p-[21px] gap-7.5 w-[475px]  rounded-lg overflow-hidden">

        <img className="w-full h-[250px] object-cover object-center  rounded-lg overflow-hidden" src={getImageURL()}/>

        <div className="w-full flex flex-col items-start gap-4">
            <span className="text-4xl" style={{fontFamily:'Harlow'}}>{props.booking.hotel.hotel_name}</span>
            <div className="w-full flex flex-col items-start gap-2">
                <div className="w-[130px] flex flex-row gap-2 justify-start">
                    {showStars()}
                </div>
                <span className="text-lg">{props.booking.hotel.address}</span>
            </div>
        </div>

        <div className="w-full flex flex-col gap-2 text-lg">
            <span className="font-medium">Rooms</span>
            <div className="w-full flex justify-between">
                <span>{props.booking.room_name}</span>
                <span>£{props.booking.amount}</span>
            </div>
        </div>

        <div className="w-full flex flex-col gap-2 text-lg">
            <span className="font-medium">Guests</span>
            <span>{props.booking.adults} Adults {props.booking.children>0?props.booking.children+", Children":""}</span>
        </div>

        {/* <div className="w-full flex flex-col gap-2 text-lg">
            <span className="font-medium">Cancellation policy</span>
            <span>Non - Refundable 1 Aug. 2025 10:30</span>
        </div>

        <div className="w-full flex flex-col gap-2 text-lg">
            <span className="font-medium">Extras</span>
            <span>Free round - trip airport transfer</span>
        </div> */}

        <div className="w-full flex gap-3 items-start">
            <div className="w-full flex flex-col items-start gap-2">
                <span className="text-xl" style={{fontFamily:'Harlow'}}>Check in</span>
                <span className="text-lg font-medium">{formatDate(props.booking.check_in)}</span>
                <span className="text-lg">{formatTime(props.booking.hotel.check_in_time).toUpperCase()}</span>
            </div>
            <div className="w-px h-[100px] bg-primary"/>
            <div className="w-full flex flex-col items-start gap-2">
                <span className="text-xl" style={{fontFamily:'Harlow'}}>Check out</span>
                <span className="text-lg font-medium">{formatDate(props.booking.check_out)}</span>
                <span className="text-lg">Until {formatTime(props.booking.hotel.check_out_time).toUpperCase()}</span>
            </div>
        </div>
        

        <span className="text-lg font-medium">{`( ${amountOfDays()} )`}</span>
        
    </div>
    );

}