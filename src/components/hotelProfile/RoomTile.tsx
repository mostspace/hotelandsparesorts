import { useEffect, useState } from "react"
import { Button } from "../ui/button"

interface RoomTileProps{
    rateObj:any
    images:any[]
}

export const RoomTile = (props:RoomTileProps) => {

      const [roomImages, setRoomImages] = useState<any[]>([]);
      const [index, setIndex] = useState(0);

        useEffect(() => {
            
            let roomName = props.rateObj.room_data_trans.main_name

            let images = props.images.filter(item => item.title === roomName);
            setRoomImages(images)
        }, [])

        const showImage = () => {

            let image = roomImages.length>0?roomImages[index]:props.images[0]

            let imageUrl = image.url
            let newURL = imageUrl.replace('{size}','240x240')
            return newURL
        }

    return(
        <div className="w-[375px] flex flex-col items-center gap-3.5">
            <div className="w-full p-[20px] rounded-[20px] flex flex-col gap-[22px] border border-muted">
                
                <div className="w-full flex flex-col gap-4 h-[300px]">
                    <div className="relative w-full h-[225px]">
                        <img className="w-full h-full" src={showImage()}/>
                        <div className="h-[42px] w-[42px] absolute z-10 left-10 top-1/2 bg-light/78 rounded-[10px]">

                        </div>
                        <div className="h-[42px] w-[42px] absolute z-10 right-10 top-1/2 bg-light/78 rounded-[10px]">

                        </div>
                    </div>
                    <span className="text-xl font-medium">{props.rateObj.room_data_trans.main_name}</span>
                </div>

                <div className="w-full h-px bg-alt/10"/>

                <div className="w-full flex flex-col ai-start gap-3.5">
                    <span className="font-medium text-lg">Cancellation policy</span>
                    <div className="w-full flex flex-row items-center gap-2 rounded-[10px] p-[10px] bg-alt/5">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.25" y="0.25" width="14.5" height="14.5" rx="7.25" stroke="#333337" stroke-opacity="0.2" stroke-width="0.5"/>
                            <circle cx="7.5" cy="7.5" r="4.5" fill="#333337"/>
                        </svg>
                        <span className="text-lg">Full refund before 3 Aug</span>
                    </div>
                </div>

                <div className="w-full h-px bg-alt/10"/>

                <div className="w-full flex flex-col ai-start gap-3.5">
                    <span className="font-medium text-lg">Extras</span>
                    <div className="w-full flex flex-row items-center gap-2 rounded-[10px] p-[10px] bg-alt/5">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.25" y="0.25" width="14.5" height="14.5" rx="7.25" stroke="#333337" stroke-opacity="0.2" stroke-width="0.5"/>
                            <circle cx="7.5" cy="7.5" r="4.5" fill="#333337"/>
                        </svg>
                        <span className="text-lg">Room Only</span>
                    </div>
                </div>

                <div className="w-full h-px bg-alt/10"/>

                <div className="w-full justify-between ai-end text-lg flex flex-row">
                    <div className="flex flex-row">
                        <span className="font-medium">€{(+props.rateObj.daily_prices[0]).toFixed(0)}/</span>
                        <span>night</span>
                    </div>
                    <div className="flex flex-row items-end">
                        <span className="text-2xl font-medium">€{+(props.rateObj.payment_options.payment_types[0].show_amount)}</span>
                        <span>{"(total)"}</span>
                    </div>
                </div>

            </div>

            <div className="flex flex-row items-center gap-2.5">
                <div className="w-px h-[50px] bg-primary"/>
                <Button className="bg-[#A38561] text-light font-medium">Sign in for member discounts</Button>
            </div>
        </div>
    )
}