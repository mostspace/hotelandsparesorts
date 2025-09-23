import { useEffect, useRef, useState } from "react"
import { Input } from "../ui/input"
import { CheckedListFilter } from "./filters/CheckedListFilter"
import { SliderFilter } from "./filters/SliderFilter"
import { Button } from "../ui/button"


interface SearchFiltersProps{
    applyFilters:any
    filters:any[]
    fullScreen:boolean
    showFilters:boolean
    setShowFilters:any
}

export const SearchFilters = (props:SearchFiltersProps) => {

    const divRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLDivElement | null>(null);

    console.log("EXISINTG FILTERS", props.filters)

    const getExistingFilterValue = (id:string, defaultValue:any) => {

        let filter = props.filters.find(obj => obj.id === id)

        if(filter!==undefined && filter!==null){
            return filter.id=="N"?filter.value:filter.selected
        }else{
            return defaultValue
        }
    }

    const filters = [
        {
            id:'A',
            title:"Price per night",
            type:"slider",
            selected:getExistingFilterValue('A',[25,1000])
        },
        {
            id:'B',
            title:"Venue Type",
            type:'checkList',
            options:['Hotel','Castle','Resort', 'Sustainable', 'Boutique' ],
            selected:getExistingFilterValue('B',[])
        },
        // {
        //     id:'C',
        //     title:"Star",
        //     type:'checkList',
        //     options:['5 Stars','4 Stars'],
        //     selected:getExistingFilterValue('C',[])
        // },
        {
            id:'D',
            title:"Facilities",
            type:'checkList',
            options:['Free Wi-Fi','Free Parking','Air Conditioning','24-Hour Reception','Restaurant / Bar','Breakfast Included','Fitness Facilities / Gym','Pet Friendly','Swimming Pool','Wheelchair Accessible'],
            selected:getExistingFilterValue('D',[])
        },

        
        // {
        //     id:'E',
        //     title:"Payment Type",
        //     type:'checkList',
        //     options:['Fully Refundable','Reserve Now, Pay Later'],
        //     selected:getExistingFilterValue('E',[])
        // }
    ]




    const [searchName, setSearchName] = useState<string>(getExistingFilterValue('N',""));
    const [selectedFilters, setSelectedFilters] = useState<any[]>(filters);
    const [updateVar, setUpdateVar] = useState(0);

    

    const showFilters = () => {

        let compArray:any[] = []

        var index = 0
        selectedFilters.forEach(filter => {
            
            if(index!==0){compArray.push(<div className="h-px w-full bg-primary/50"/>)}

            if(filter.type === "checkList"){
                compArray.push(
                    <CheckedListFilter
                        filterID={filter.id}
                        title={filter.title}
                        options={filter.options||[]}
                        selected={filter.selected||[]}
                        valueChanged={filterChanged}
                    />
                )
            }
            else if(filter.type === "slider"){
                compArray.push(
                    <SliderFilter
                        filterID={filter.id}
                        title={filter.title}
                        selected={filter.selected||[25,1000]}
                        valueChanged={filterChanged}
                    />
                )
            }

            index++

        });

        return compArray

    }

    const clearAllFilters = () => {
        setSearchName("")
        selectedFilters.forEach(filter => {
            if(filter.id=="A"){filter.selected=[25,1000]}
            else{filter.selected=[]}
        });

        setSelectedFilters(selectedFilters)
        setUpdateVar(updateVar+1)

        props.applyFilters(selectedFilters)
    }

    const filterChanged = (filterID:string,values:any[]) => {
        
        console.log("FILTER CHANGE",filterID,values)

        const updatedFilters = selectedFilters.map(filter => 
            filter.id === filterID 
              ? { ...filter, selected: values } 
              : filter
          );

        console.log("U FILS",updatedFilters)
        setSelectedFilters(updatedFilters)

        let combined = [...updatedFilters]

        // if(searchName.length>3){
            combined.push({id:'N',value:searchName})
        // }

        console.log("COMBINED",combined)

        props.applyFilters(combined)
    }
    
    useEffect(() => {

        // if(searchName.length>3){
            let combined = [...selectedFilters]
            combined.push({id:'N',value:searchName})
            console.log("COMBGINED",combined)
            props.applyFilters(combined)
        // }


    }, [searchName]);

    useEffect(() => {

         console.log("RUNNING THAT CODE")


        if(props.fullScreen && divRef.current)
        {
            console.log("RUNNING ThiS CODE")
            divRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }

    }, []); // empty deps → only runs once when mounted



    return(
    <div className={`flex flex-col gap-10 ${props.fullScreen?props.showFilters?"w-full z-100 pt-20 p-5 overflow-scroll h-screen":"hidden":"w-full max-w-[350px]"}`} ref={divRef}>
        

        <Button className="bg-accent hover:bg-accent/90 sm:hidden p-8 text-lg" onClick={()=>props.setShowFilters(false)}>Close Filters</Button>

        
        <div className="w-full p-[28px] bg-muted rounded-[20px] flex flex-col gap-5 items-start border border-primary/50">
            <span className="text-primary">Search by property name</span>
            <div className={`flex w-full flex-row gap-3 bg-white/50 px-[20px] py-[10px] w-[30%] items-center border border-primary/50`}>
                
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <path d="M14.6094 12.6875C15.3906 11.4583 15.849 10 15.849 8.43229C15.849 4.05208 12.3021 0.5 7.92708 0.5C3.54687 0.5 0 4.05208 0 8.43229C0 12.8125 3.54688 16.3646 7.92188 16.3646C9.51042 16.3646 10.9896 15.8958 12.2292 15.0938L12.5885 14.8437L18.2448 20.5L20 18.7135L14.349 13.0573L14.6094 12.6875ZM12.3646 4C13.5469 5.18229 14.1979 6.75521 14.1979 8.42708C14.1979 10.099 13.5469 11.6719 12.3646 12.8542C11.1823 14.0365 9.60937 14.6875 7.9375 14.6875C6.26562 14.6875 4.69271 14.0365 3.51042 12.8542C2.32812 11.6719 1.67708 10.099 1.67708 8.42708C1.67708 6.75521 2.32812 5.18229 3.51042 4C4.69271 2.81771 6.26562 2.16667 7.9375 2.16667C9.60937 2.16667 11.1823 2.81771 12.3646 4Z" fill="#4D4D4D"/>
                </svg>

                <input 
                    className="w-full h-full bg-transparent border-none focus:outline-none" 
                    type="text"
                    placeholder="Enter hotel name" 
                    value={searchName} 
                    onChange={(e) => setSearchName(e.target.value)}
                />
                
            </div>
        </div>

        <div className="w-full bg-muted rounded-[20px] border border-primary/50 flex flex-col text-primary">
            
            <div className="flex flex-row px-[28px] py-[23px] justify-between items-center">
                <span className="text-xl font-medium">Filter By:</span>
                <span className="text-lg underline cursor-pointer" onClick={clearAllFilters}>Clear all</span>
            </div>

            <div className="h-px w-full bg-primary/50"/>


            <div className="w-full flex flex-col gap-10 px-[28px] py-[40px]">
                
                {showFilters()}

            </div>

        </div>

    </div>
    )

}