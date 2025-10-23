
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ErrorPropUp{
    title:string,
    subtitle:string,
    subtitle2?:string,
    buttonText:string,
    close:any
    buttonClicked:any
    hideClose?:boolean

    button2Text?:string,
    button2Clicked?:any

}


export default function ErrorPopUp(props:ErrorPropUp) {

    

    return(<div className="fixed top-0 left-0 h-full w-full bg-primary/50 flex justify-center items-center z-20 p-2">

        <div className="max-w-[90%] lg:max-w-[700px] flex flex-col bg-light p-[30px] lg:p-[70px] gap-[44px] relative items-center rounded-lg overflow-hidden">

            {!props.hideClose && <div className="absolute top-4 right-4 cursor-pointer" onClick={props.close}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_113_839)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M24 2.4L21.6 0L12 9.6L2.4 0L0 2.4L9.6 12L0 21.6L2.4 24L12 14.4L21.6 24L24 21.6L14.4 12L24 2.4Z" fill="#333337"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_113_839">
                    <rect width="24" height="24" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>
            </div>}

            <div className="flex flex-col gap-5 items-center">
                <span className="text-4xl" style={{fontFamily:'Harlow', lineHeight:'110%'}}>{props.title}</span>
                <span className="text-base font-normal text-center">{props.subtitle}</span>
                {props.subtitle2 && <span className="text-base font-normal text-center">{props.subtitle2}</span>}
            </div>
         
            <div className="flex flex-col lg:flex-row gap-5">
                <Button className="bg-accent w-[200px] h-[40px] hover:bg-accent/90" onClick={props.buttonClicked}>{props.buttonText}</Button>
                {props.button2Text && <Button className="bg-accent/30 border-2 border-accent w-[200px] h-[40px] text-accent hover:bg-accent/20" onClick={props.button2Clicked}>{props.button2Text}</Button>   }            
            </div>

        </div>

    </div>)

}