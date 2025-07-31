import { Button } from "../ui/button"

interface HotelImageGalleryProps{
    images:any[]
}

export const HotelImageGallery = (props:HotelImageGalleryProps) => {

    const formatImage = (image:any) => {
        let imageUrl = image.url
        let newURL = imageUrl.replace('{size}','240x240')
        return newURL
    }

    return(
        <div className="w-full h-[760px] flex flex-row relative gap-6">
            
            <img className="h-full w-[50%]" src={formatImage(props.images[0])}/>

            <div className="h-full w-[50%] flex flex-row gap-6">
                <div className="h-full w-[50%] flex flex-col gap-6">
                    <img className="h-full w-full" src={formatImage(props.images[1])}/>
                    <img className="h-full w-full" src={formatImage(props.images[2])}/>
                </div>
                <div className="h-full w-[50%] flex flex-col gap-6">
                    <img className="h-full w-full" src={formatImage(props.images[3])}/>
                    <img className="h-full w-full" src={formatImage(props.images[4])}/>
                </div>
            </div>

            <Button className="bg-accent text-light absolute z-10 right-8 bottom-8">VIEW ALL PHOTOS</Button>
        </div>
    )
}