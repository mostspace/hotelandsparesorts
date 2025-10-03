"use client";
import { FadeLoader } from "react-spinners";

interface LoadingPropUp{
    title:string,
    subtitle:string,
  
}

export const LoadingPopUp = (props:LoadingPropUp) => {


    return <div className="fixed z-100 top-0 left-0 w-full h-full bg-primary/50 flex justify-center items-center text-center">

        <div className="w-[600px] bg-light rounded-xl flex flex-col justify-center items-center gap-12 p-10 rounded-lg overflow-hidden p-2 font-normal">

            <FadeLoader
                    color={'#A56658'}
                    height={25}
                    width={5}
                    speedMultiplier={1}
                    margin={10}
                />

            {/* <CircleLoader 
                color={'#A56658'}
                size={100}
            /> */}

            <div className="flex flex-col items-center gap-4">
                <span className="text-4xl"  style={{fontFamily:'Harlow'}}>{props.title}</span>
                <span className="text-lg text-center">{props.subtitle}</span>
            </div>
            
        </div>
    
    </div>
}