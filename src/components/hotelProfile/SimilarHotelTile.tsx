


export const SimiilarHotelTile = () => {



    return(
        <div className="relative flex flex-col items-start h-[543px] w-[486px] pb-[40px] gap-5 bg-light">

            <div className="absolute top-3 right-5 flex flex-row items-center gap-2.5 bg-accent p-[10px] rounded-[10px] text-light text-lg">
                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.42188 6.63623L9.64355 7.33252H13.499L10.9551 9.21533L10.3799 9.64111L10.5977 10.3228L11.5586 13.3374L9.06738 11.4937L8.47266 11.0532L7.87793 11.4937L5.38574 13.3374L6.34766 10.3228L6.56445 9.64111L5.98926 9.21533L3.44629 7.33252H7.30078L7.52344 6.63623L8.47168 3.65869L9.42188 6.63623Z" fill="white" stroke="white" stroke-width="2"/>
                </svg>
                <span>Customer Rating:</span>
                <span className="font-bold">9.4</span>
            </div>

            <img className="w-full h-[300px]" src={'/assets/manorHouse.jpg'}/>

            <div className="flex flex-col items-start gap-4 px-[34px]">
                <span className="text-3xl"  style={{fontFamily:'Harlow'}}>The Shelbourne</span>
                <div className="flex flex-row gap-2.5 items-start">
                    <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 7.79394C15 3.63953 11.6544 0.293945 7.5 0.293945C3.34559 0.293945 0 3.63953 0 7.79394C0 11.9484 7.5 19.7057 7.5 19.7057C7.5 19.7057 15 11.9484 15 7.79394ZM4.00735 7.64689C4.00735 5.73512 5.58823 4.15424 7.5 4.15424C9.41176 4.15424 10.9926 5.69836 10.9926 7.64689C10.9926 9.55865 9.44853 11.1395 7.5 11.1395C5.58823 11.1395 4.00735 9.55865 4.00735 7.64689Z" fill="#333337"/>
                    </svg>
                    <span className="text-lg font-medium">St.Stephens Green, Dublin 2</span>
                </div>
            </div>

            <div className="mt-[10px] flex flex-row w-full justify-between items-centre px-[34px] py-[13px] bg-muted">
                
                <div className="flex flex-col items-start gap-1 text-lg">
                    <span>from <strong>€266</strong>/night</span>
                    <span>2 night, 2 guests</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-3xl font-medium">€545</span>
                    <span className="text-lg">total</span>
                </div>
            </div>

        </div>
    )
}