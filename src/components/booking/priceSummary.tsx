
export const PriceSummary = () => {

    return(
        <div className="flex flex-col items-start border border-primary/50 py-[21px] gap-5 min-w-100 max-w-[575px]">

            <span className="px-[28px] text-4xl" style={{fontFamily:'Harlow'}}>Your price summary</span>
            
            <div className="px-[28px] text-lg w-full flex justify-between">
                <span>Premium Room</span>
                <span>£8,235.47</span>
            </div>

            <div className="px-[28px] text-lg w-full flex justify-between">
                <span>Taxes & fees</span>
                <span>+1,111.79</span>
            </div>

            <div className="px-[28px] py-[13px] w-full flex justify-between items-center bg-muted">
                <div className="flex flex-col items-start">
                    <span className="font-medium">Price</span>
                    <span>{"(for 21 nights & all guests)"}</span>
                </div>
                <span className="text-lg">£9347.26</span>
            </div>

            <div className="px-[28px] flex flex-row item-start gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.25 4.5L10.125 11.625L6.375 7.875L0.75 13.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12.75 4.5H17.25V9" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <span className="font-medium">This price may increase if you book later</span>
            </div>

        </div>
    )
}