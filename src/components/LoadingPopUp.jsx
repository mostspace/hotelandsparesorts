"use client";

export const LoadingPopUp = () => {


    return <div className="fixed z-100 top-0 left-0 w-full h-full bg-primary/50 flex justify-center items-center">

        <div className="w-[300px] h-[300px] bg-light rounded-xl flex flex-col justify-center items-center gap-4">

            <span className="text-2xl font-medium">Loading....</span>
        </div>
    
    </div>
}