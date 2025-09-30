import { useState } from "react";
import { Button } from "../ui/button"

interface HotelImageGalleryProps{
    images:any[]
}

export const HotelImageGallery = (props:HotelImageGalleryProps) => {

    const [showPopUp, setShowPopUp] = useState(false);
    const [index, setIndex] = useState(0);


    const formatImage = (image:any) => {
        let imageUrl = image.url
        let newURL = imageUrl.replace('{size}','x768')
        return newURL
    }

    const showImage = () => {

        let image = props.images.length>0?props.images[index]:props.images[0]

        let imageUrl = image.url
        let newURL = imageUrl.replace('{size}','1024x768')
        return newURL
    }

    const getCaption = () => {

        let caption = props.images.length>0?props.images[index].title:props.images[0].title
        if(caption === "unspecified"){return ""}
        else{
            return toTitleCase(caption)
        }
    }

    const changeImage = (direction:number) => {

        let newIndex = index + direction
        if(newIndex<0){newIndex = props.images.length-1}
        else if(newIndex===props.images.length){newIndex = 0}
        setIndex(newIndex)
    }

    function toTitleCase(str: string): string {
        return str
            .split(/\s+/)                  // split on spaces
            .filter(Boolean)               // remove extra empties
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    return(
        <div className="w-full md:h-[760px] h-[500px] flex flex-row relative gap-6">
            
            <img className="h-full md:w-[50%] w-full object-cover object-center rounded-lg overflow-hidden" src={formatImage(props.images[0])}/>

            <div className="hidden h-full w-[50%] md:flex flex-row gap-6">
                <div className="h-full w-[50%] flex flex-col gap-6">
                    <img className="h-[48%] w-full bg-accent object-cover object-center rounded-lg overflow-hidden" src={formatImage(props.images[1])}/>
                    <img className="h-[49%] w-full bg-accent object-cover object-center rounded-lg overflow-hidden" src={formatImage(props.images[2])} />
                </div>
                <div className="hidden h-full w-[50%] md:flex flex-col gap-6">
                    <img className="h-[48%] w-full bg-accent object-cover object-cover object-center rounded-lg overflow-hidden" src={formatImage(props.images[3])}/>
                    <img className="h-[49%] w-full bg-accent object-cover object-cover object-center rounded-lg overflow-hidden" src={formatImage(props.images[4])}/>
                </div>
            </div>

            <Button className="bg-accent hover:bg-accent/90 text-light text-lg p-8 absolute z-10 right-8 bottom-8" onClick={()=>setShowPopUp(true)}>
                <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_88_406)">
                    <path d="M10.5 0.5H1.75C0.783125 0.5 0 1.28312 0 2.25V11C0 11.966 0.783125 12.75 1.75 12.75H10.5C11.4669 12.75 12.25 11.966 12.25 11V2.25C12.25 1.28312 11.4669 0.5 10.5 0.5ZM10.5 11H1.75V2.25H10.5V11Z" fill="#EEE9E6"/>
                    <path d="M26.25 0.5H17.5C16.5331 0.5 15.75 1.28312 15.75 2.25V11C15.75 11.966 16.5331 12.75 17.5 12.75H26.25C27.216 12.75 28 11.966 28 11V2.25C28 1.28312 27.216 0.5 26.25 0.5ZM26.25 11H17.5V2.25H26.25V11Z" fill="#EEE9E6"/>
                    <path d="M26.25 16.25H17.5C16.5331 16.25 15.75 17.034 15.75 18V26.75C15.75 27.7169 16.5331 28.5 17.5 28.5H26.25C27.216 28.5 28 27.7169 28 26.75V18C28 17.0331 27.216 16.25 26.25 16.25ZM26.25 26.75H17.5V18H26.25V26.75Z" fill="#EEE9E6"/>
                    <path d="M10.5 16.25H1.75C0.783125 16.25 0 17.034 0 18V26.75C0 27.7169 0.783125 28.5 1.75 28.5H10.5C11.4669 28.5 12.25 27.7169 12.25 26.75V18C12.25 17.0331 11.4669 16.25 10.5 16.25ZM10.5 26.75H1.75V18H10.5V26.75Z" fill="#EEE9E6"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_88_406">
                    <rect width="28" height="28" fill="white" transform="translate(0 0.5)"/>
                    </clipPath>
                    </defs>
                </svg>
                VIEW ALL PHOTOS
            </Button>



            {showPopUp && <div className="fixed z-15 bg-primary/50 inset-0 flex justify-center md:items-center p-2 md:p-10 md:px-50" onClick={() => setShowPopUp(false)}>
                <div className="z-10 rounded-xl bg-muted p-5 md:h-full h-[700px] w-full flex flex-col gap-4 items-center max-w-[1000px]" onClick={(e) => e.stopPropagation()}>
                    <div className="w-full flex flex-row justify-end">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 101.08 100.26"
                                width="35"
                                height="35"
                                className="cursor-pointer transition-opacity hover:opacity-80"
                                onClick={()=>setShowPopUp(false)}
                               >
                                <path
                                    fill="#774d46"
                                    d="M70.08,30.17c-.75-.75-1.97-.75-2.72,0l-17.24,17.24-17.24-17.24c-.75-.75-1.97-.75-2.72,0-.75.75-.75,1.97,0,2.72l17.24,17.24-17.24,17.24c-.75.75-.75,1.97,0,2.72.38.37.87.56,1.36.56s.98-.19,1.36-.56l17.24-17.24,17.24,17.24c.38.37.87.56,1.36.56s.98-.19,1.36-.56c.75-.75.75-1.97,0-2.72l-17.24-17.24,17.24-17.24c.75-.75.75-1.97,0-2.72ZM50.13,2C23.59,2,2,23.59,2,50.13c0,26.54,21.59,48.13,48.13,48.13s48.12-21.59,48.12-48.13c0-26.54-21.59-48.13-48.13-48.13ZM50.13,94.42h0c-24.42,0-44.29-19.87-44.29-44.29C5.84,25.71,25.71,5.84,50.13,5.84s44.29,19.87,44.29,44.29c0,24.42-19.87,44.29-44.28,44.29Z"
                                />
                                </svg>

                        {/* <Button onClick={()=>setShowPopUp(false)}>Close</Button> */}
                    </div>
                    <div className="relative w-full h-[80%]">
                        <img className="w-full h-full object-cover object-center rounded-lg overflow-hidden" src={showImage()}/>
                        <div
                            className="h-[55px] w-[55px] absolute z-5 left-3 top-1/2 bg-light/78 rounded-[10px] p-[6.5px] cursor-pointer"
                            onClick={() => changeImage(-1)}
                            >
                            <svg
                                width="42"
                                height="42"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                d="M25.002 16.0001C25.002 16.5523 24.5547 17.0001 24.002 17.0001H9.8672L14.8301 24.4454C15.1367 24.9049 15.0127 25.526 14.5528 25.8321C14.3818 25.9459 14.1895 26.0001 13.999 26.0001C13.6758 26.0001 13.3584 25.8438 13.166 25.5548L6.7959 16.0001L13.166 6.44538C13.4717 5.98538 14.0908 5.86088 14.5527 6.16808C15.0127 6.47428 15.1367 7.09528 14.83 7.55478L9.8672 15.0001H24.002C24.5547 15.0001 25.002 15.4479 25.002 16.0001Z"
                                fill="#333337"
                                />
                            </svg>
                        </div>

                        <div
                        className="h-[55px] w-[55px] absolute z-5 right-3 top-1/2 bg-light/78 rounded-[10px] p-[6.5px] cursor-pointer"
                        onClick={() => changeImage(1)}
                        >
                        <svg
                            width="42"
                            height="42"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M6.998 15.9999C6.998 15.4477 7.4453 14.9999 7.998 14.9999L22.1328 14.9999L17.1699 7.55462C16.8633 7.09512 16.9873 6.47402 17.4472 6.16792C17.6182 6.05412 17.8105 5.99992 18.001 5.99992C18.3242 5.99992 18.6416 6.15622 18.834 6.44522L25.2041 15.9999L18.834 25.5546C18.5283 26.0146 17.9092 26.1391 17.4473 25.8319C16.9873 25.5257 16.8633 24.9047 17.17 24.4452L22.1328 16.9999L7.998 16.9999C7.4453 16.9999 6.998 16.5521 6.998 15.9999Z"
                            fill="#333337"
                            />
                        </svg>
                        </div>

                    </div>
                    {/* <span className="text-4xl font-medium mt-4 text-accent">{getCaption()}</span> */}
                </div>
            </div>}
        </div>
    )
}