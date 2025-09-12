interface FeeListProps{
    feeList:any
}



export const FeeList = (props:FeeListProps) => {

    
    const showAddFees = (data:any[]) => {

        let compArray:any[] = []
        
        compArray.push(<span className="text-2xl" style={{fontFamily:'Harlow'}}>Additional Fees</span>)


        let subitemsComp:any[] = []

        data.forEach(element => {
            let currency = element.currency
            let feeType = element.fee_type
            let price = element.price
            let unit = element.price_unit

            subitemsComp.push(<span><strong>{feeType}</strong> - {price}{currency} {unit}</span>)
        });

        compArray.push(<div className="flex flex-col gap-2">
            {subitemsComp}
        </div>)


        return compArray
    }

    const showCheckInFees = (data:any[]) => {

        let compArray:any[] = []
        compArray.push(<span className="text-2xl" style={{fontFamily:'Harlow'}}>Check In/Out Fees</span>)

        let subitemsComp:any[] = []

        data.forEach(element => {
            let currency = element.currency
            let feeType = element.check_in_check_out_type
            let price = element.price
            let inclusion = element.inclusion

            subitemsComp.push(<span><strong>{feeType}</strong> - {price}{currency} (Inclusion: {inclusion})</span>)
        });

        compArray.push(<div className="flex flex-col gap-2">
            {subitemsComp}
        </div>)

        return compArray
    }

    const showChildrenBedFees = (data:any[]) => {

        let compArray:any[] = []
        compArray.push(<span className="text-2xl" style={{fontFamily:'Harlow'}}>Children's Beds</span>)

         let subitemsComp:any[] = []

        data.forEach(element => {
            let currency = element.currency
            let price = element.price
            let ageStart = element.age_start
            let ageEnd = element.age_end
            let extraBed = element.extra_bed

            subitemsComp.push(<span><strong>From {ageStart}y/o to {ageEnd}y/o:</strong> - {price}{currency} (Availability: {extraBed})</span>)
        });

        compArray.push(<div className="flex flex-col gap-2">
            {subitemsComp}
        </div>)

        return compArray
    }

    const showChildrenMealFees = (data:any[]) => {

        let compArray:any[] = []
        compArray.push(<span className="text-2xl" style={{fontFamily:'Harlow'}}>Children Meals</span>)

         let subitemsComp:any[] = []

        data.forEach(element => {
            let currency = element.currency
            let mealType = element.meal_type
            let price = element.price
            let inclusion = element.inclusion
            let ageStart = element.age_start
            let ageEnd = element.age_end

            subitemsComp.push(<span><strong>From {ageStart}y/o to {ageEnd}y/o ({mealType}):</strong> - {price}{currency} (Inclusion: {inclusion})</span>)
        });

        compArray.push(<div className="flex flex-col gap-2">
            {subitemsComp}
        </div>)

        return compArray
    }

    const showCotFees = (data:any[]) => {

        let compArray:any[] = []
        compArray.push(<span className="text-2xl" style={{fontFamily:'Harlow'}}>Cots</span>)

        let subitemsComp:any[] = []

        data.forEach(element => {
            let currency = element.currency
            let amount = element.amount
            let price = element.price
            let unit = element.price_unit
            let inclusion = element.inclusion

            subitemsComp.push(<span><strong>{amount} {amount>1?"Cots":"Cot"}</strong> - {price}{currency} {unit}</span>)
        });

        compArray.push(<div className="flex flex-col gap-2">
            {subitemsComp}
        </div>)

        return compArray
    }

    const showDepositFees = (data:any[]) => {

        let compArray:any[] = []
        compArray.push(<span className="text-2xl" style={{fontFamily:'Harlow'}}>Deposits</span>)

        let subitemsComp:any[] = []

        data.forEach(element => {

            let availability = element.availability
            let depositType = element.deposit_type
            let paymentType = element.payment_type
            let pricingMethod = element.pricing_method

            let currency = element.currency
            let price = element.price
            let unit = element.price_unit

            subitemsComp.push(<div className="flex flex-col item-start">
                <span><strong>Deposit type: </strong>{depositType}</span>
                <span><strong>Payment type: </strong>{paymentType}</span>
                <span><strong>Pricing method: </strong>{pricingMethod}</span>
                <span><strong>Availability: </strong>{availability}</span>
                <span><strong>Price: </strong>{price}{currency} {unit}</span>

            </div>)
        });

        compArray.push(<div className="flex flex-wrap gap-5">
            {subitemsComp}
        </div>)

        return compArray
    }

    const showExtraBedFees = (data:any[]) => {

        let compArray:any[] = []
        compArray.push(<span className="text-2xl" style={{fontFamily:'Harlow'}}>Extra Beds</span>)

        let subitemsComp:any[] = []

        data.forEach(element => {
            let currency = element.currency
            let amount = element.amount
            let price = element.price
            let unit = element.price_unit
            let inclusion = element.inclusion

            subitemsComp.push(<span><strong>{amount} {amount>1?"Beds":"Bed"}</strong> - {price}{currency} {unit} (Inclusion: {inclusion})</span>)
        });

        compArray.push(<div className="flex flex-col gap-2">
            {subitemsComp}
        </div>)

        return compArray
    }

    const showInternetFees = (data:any[]) => {

        let compArray:any[] = []
        compArray.push(<span className="text-2xl" style={{fontFamily:'Harlow'}}>Internet Fees</span>)

        let subitemsComp:any[] = []

        data.forEach(element => {
            let currency = element.currency
            let price = element.price
            let unit = element.price_unit
            let inclusion = element.inclusion
            let internetType = element.internet_type
            let workArea = element.work_area

            subitemsComp.push(<span><strong>{internetType} Connection in {workArea}:</strong> {price}{currency} {unit} (Inclusion: {inclusion})</span>)
        });

        compArray.push(<div className="flex flex-col gap-2">
            {subitemsComp}
        </div>)

        return compArray
    }

    const showMealFees = (data:any[]) => {

        let compArray:any[] = []
        compArray.push(<span className="text-2xl" style={{fontFamily:'Harlow'}}>Meal Fees</span>)

        let subitemsComp:any[] = []

        data.forEach(element => {
            let currency = element.currency
            let price = element.price
            let inclusion = element.inclusion
            let mealType = element.meal_type

            subitemsComp.push(<span><strong>{mealType}:</strong>  {price}{currency} (Inclusion: {inclusion})</span>)
        });

        compArray.push(<div className="flex flex-col gap-2">
            {subitemsComp}
        </div>)

        return compArray
    }

    const showNoShowFees = (data:any[]) => {

        let compArray:any[] = []
        compArray.push(<span className="text-2xl" style={{fontFamily:'Harlow'}}>No Shows</span>)

        let subitemsComp:any[] = []

        data.forEach(element => {
            let availability = element.availability
            let period = element.day_period
            let time = element.time


            subitemsComp.push(<span><strong>{period}:</strong>  {time} (Availability: {availability})</span>)
        });

        compArray.push(<div className="flex flex-col gap-2">
            {subitemsComp}
        </div>)

        return compArray
    }

    const showParkingFees = (data:any[]) => {

        let compArray:any[] = []
        compArray.push(<span className="text-2xl" style={{fontFamily:'Harlow'}}>Parking</span>)

        let subitemsComp:any[] = []

        data.forEach(element => {
            let currency = element.currency
            let price = element.price
            let unit = element.price_unit
            let inclusion = element.inclusion
            let territory_type = element.inclusion

            subitemsComp.push(<span><strong>Territory Type {territory_type}:</strong> - {price}{currency} {unit} (Inclusion: {inclusion})</span>)
        });

        compArray.push(<div className="flex flex-col gap-2">
            {subitemsComp}
        </div>)


        return compArray
    }

    const showPetFees = (data:any[]) => {

        let compArray:any[] = []
        compArray.push(<span className="text-2xl" style={{fontFamily:'Harlow'}}>Pets</span>)

        let subitemsComp:any[] = []

        data.forEach(element => {
            let currency = element.currency
            let price = element.price
            let unit = element.price_unit
            let inclusion = element.inclusion
            let pets_type = element.pets_type

            subitemsComp.push(<span><strong>Pet Type {pets_type}:</strong> - {price}{currency} {unit} (Inclusion: {inclusion})</span>)
        });

        compArray.push(<div className="flex flex-col gap-2">
            {subitemsComp}
        </div>)

        return compArray
    }

    const showShuttleFees = (data:any[]) => {

        let compArray:any[] = []
        compArray.push(<span className="text-2xl" style={{fontFamily:'Harlow'}}>Shuttle</span>)

        let subitemsComp:any[] = []

        data.forEach(element => {
            let currency = element.currency
            let price = element.price
            let destinationType = element.destination_type
            let inclusion = element.inclusion
            let shuttleType = element.shuttle_type

            subitemsComp.push(<span><strong>{shuttleType} to {destinationType}:</strong> - {price}{currency} (Inclusion: {inclusion})</span>)
        });

        compArray.push(<div className="flex flex-col gap-2">
            {subitemsComp}
        </div>)

        return compArray
    }

    
    

    return(
        <div className="w-full flex flex-col gap-6">
        
            {props.feeList.add_fee.length>0 && <div className="flex flex-col gap-4">{showAddFees(props.feeList.add_fee)}</div>}
            {props.feeList.check_in_check_out.length>0 && <div className="flex flex-col gap-4">{showCheckInFees(props.feeList.check_in_check_out)}</div>}
            {props.feeList.children.length>0 && <div className="flex flex-col gap-4">{showChildrenBedFees(props.feeList.children)}</div>}
            {props.feeList.children_meal.length>0 && <div className="flex flex-col gap-4">{showChildrenMealFees(props.feeList.children_meal)}</div>}
            {props.feeList.cot.length>0 && <div className="flex flex-col gap-4">{showCotFees(props.feeList.cot)}</div>}
            {props.feeList.deposit.length>0 && <div className="flex flex-col gap-4">{showDepositFees(props.feeList.deposit)}</div>}
            {props.feeList.extra_bed.length>0 && <div className="flex flex-col gap-4">{showExtraBedFees(props.feeList.extra_bed)}</div>}
            {props.feeList.internet.length>0 && <div className="flex flex-col gap-4">{showInternetFees(props.feeList.internet)}</div>}
            {props.feeList.meal.length>0 && <div className="flex flex-col gap-4">{showMealFees(props.feeList.meal)}</div>}
            {props.feeList.no_show.length>0 && <div className="flex flex-col gap-4">{showNoShowFees(props.feeList.no_show)}</div>}
            {props.feeList.parking.length>0 && <div className="flex flex-col gap-4">{showParkingFees(props.feeList.parking)}</div>}
            {props.feeList.pets.length>0 && <div className="flex flex-col gap-4">{showPetFees(props.feeList.pets)}</div>}
            {props.feeList.shuttle.length>0 && <div className="flex flex-col gap-4">{showShuttleFees(props.feeList.shuttle)}</div>}

        </div>
    )
}