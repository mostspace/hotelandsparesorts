import { useState } from "react";
import { Button } from "../ui/button"

interface HotelReviewProps{
    review:any
}



export const HotelReview = (props:HotelReviewProps) => {

    const [expanded, setExpanded] = useState(false);


    const fullCircle = <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8.09082" cy="8" r="7.5" stroke="#A56658"/>
    <circle cx="8.09091" cy="8.00009" r="5.09091" fill="#A56658"/>
    </svg>
    
    const halfCircle = <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8.45459" cy="8" r="7.5" stroke="#A56658"/>
    <path d="M8.4545 13.091C7.10431 13.091 5.80942 12.5546 4.85468 11.5999C3.89995 10.6452 3.36359 9.35028 3.36359 8.00009C3.36359 6.6499 3.89995 5.355 4.85468 4.40027C5.80941 3.44554 7.10431 2.90918 8.4545 2.90918L8.4545 8.00009L8.4545 13.091Z" fill="#A56658"/>
    </svg>
    
    const emptyCircle = <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8.45459" cy="8" r="7.5" stroke="#A56658"/>
    </svg>


    const showCircles = () => {

        let compArray:any[] = []

        let rating = props.review.rating

        let index = 1
        while(index <=5){

            if(rating>=index || (index-rating) < 0.2){compArray.push(fullCircle)}
            else if((index-rating) < 1){compArray.push(halfCircle)}
            else{compArray.push(emptyCircle)}
            index++
        }

        return compArray
    } 


    return(
        <div className="w-[412px] flex flex-col gap-6 items-start">

            <div className="flex flex-col items-start">
                <div className="flex flex-row gap-1">
                    {showCircles()}
                </div>
                <span className="text-2xl font-bold line-clamp-1">{props.review.title}</span>
            </div>

            <span className={expanded?"":"line-clamp-3"}>{props.review.text}</span>

            <Button className="rounded-xl border border-accent/50 bg-transparent hover:bg-accent/10 text-primary" onClick={()=>setExpanded(!expanded)}>{expanded?"Read Less":"Read More"}</Button>

            <div className="flex flex-col items-start">
                <div className="flex flex-row items-center gap-2">
                    <img className="rounded-full h-[24px] w-[24px]" src={props.review.user.avatar?props.review.user.avatar?.small:""}/>
                    <span className="text-accent text-lg font-medium">{props.review.user.username}</span>
                </div>
                <span>{props.review.travel_date} • Source: Tripadvisor</span>
            </div>
        </div>
    )
}