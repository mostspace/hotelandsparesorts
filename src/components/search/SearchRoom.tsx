import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { CheckedListFilter } from "./filters/CheckedListFilter"
import { SliderFilter } from "./filters/SliderFilter"


interface SearchRoomProps{
    index:number,
    adults:number,
    children:number,
    childrenAges:number[]
    removeRoom:any,
    updateRoom:any
}

export const SearchRoom = (props:SearchRoomProps) => {


    
    const [adults, setAdults] = useState(props.adults || 1);
    const [children, setChildren] = useState(props.children || 0);

    const [childrenAges, setChildrenAges] = useState(props.childrenAges || []);
    const [updateVar, setUpdateVar] = useState(0);

    
    useEffect(() => {
        
        setAdults(props.adults)
        setChildren(props.children)


    }, [props.adults,props.children]);

    const removeAdult = () => {
        let adultsNew = adults-1>0?adults-1:0
        setAdults(adultsNew)
        props.updateRoom(props.index,{adults:adultsNew,children:children})
    }

    const addAdult = () => {
        let adultsNew = adults+1
        setAdults(adultsNew)
        props.updateRoom(props.index,{adults:adultsNew,children:children})

    }

    const removeChild = () => {
        let childrenNew = children-1>0?children-1:0
        setChildren(childrenNew)
        childrenAges.pop()
        setChildrenAges(childrenAges)
        props.updateRoom(props.index,{adults:adults,children:childrenNew,childrenAges})
    }

    const addChild = () => {
        let childrenNew = children+1
        setChildren(childrenNew)
        childrenAges.push(10)
        setChildrenAges(childrenAges)
        props.updateRoom(props.index,{adults:adults,children:childrenNew,childrenAges})
    }

    const showChildrenAges = () => {
        
        let compArray:any[] = []

        let index = 0
        childrenAges.forEach(age => {
            
            const thisIndex = index
            compArray.push(<div className="w-full flex justify-between items-center">
                <span>Child {index+1} Age:</span>
                <select 
                    className="w-[80px] h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                    value={age} 
                    onChange={(e) => changeChildAge(thisIndex,+e.target.value)}
                >

                    {Array.from({ length: 17 }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                        {num}
                        </option>
                    ))}
                </select>
            </div>)
            index++
        });

        return compArray
    }

    const changeChildAge = (index:number,value:number) => {


        childrenAges[index] = value
        setChildrenAges(childrenAges)
        setUpdateVar(updateVar+1)
        
        props.updateRoom(props.index,{adults:adults,children:children,childrenAges})

        console.log("CH AGES",childrenAges,index)
    }


    return(
    <div className="flex flex-col gap-3">

            <div className="w-full flex justify-between items-start">
                <span className="text-xl font-bold">Room {props.index}</span>
                {props.index>1 && <div className="flex gap-2 cursor-pointer" onClick={()=>props.removeRoom(props.index)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 1.5H14C14 1.23478 13.8946 0.98043 13.7071 0.792893C13.5196 0.605357 13.2652 0.5 13 0.5H11C10.7348 0.5 10.4804 0.605357 10.2929 0.792893C10.1054 0.98043 10 1.23478 10 1.5H3C2.73478 1.5 2.48043 1.60536 2.29289 1.79289C2.10536 1.98043 2 2.23478 2 2.5C2 2.76522 2.10536 3.01957 2.29289 3.20711C2.48043 3.39464 2.73478 3.5 3 3.5H21C21.2652 3.5 21.5196 3.39464 21.7071 3.20711C21.8946 3.01957 22 2.76522 22 2.5C22 2.23478 21.8946 1.98043 21.7071 1.79289C21.5196 1.60536 21.2652 1.5 21 1.5Z" fill={"red"}/>
                    <path d="M19.5 4.5C19.2348 4.5 18.9804 4.60536 18.7929 4.79289C18.6054 4.98043 18.5 5.23478 18.5 5.5V21.5H5.5V5.5C5.5 5.23478 5.39464 4.98043 5.20711 4.79289C5.01957 4.60536 4.76522 4.5 4.5 4.5C4.23478 4.5 3.98043 4.60536 3.79289 4.79289C3.60536 4.98043 3.5 5.23478 3.5 5.5V22.5C3.5 22.7652 3.60536 23.0196 3.79289 23.2071C3.98043 23.3946 4.23478 23.5 4.5 23.5H19.5C19.7652 23.5 20.0196 23.3946 20.2071 23.2071C20.3946 23.0196 20.5 22.7652 20.5 22.5V5.5C20.5 5.23478 20.3946 4.98043 20.2071 4.79289C20.0196 4.60536 19.7652 4.5 19.5 4.5Z" fill={"red"}/>
                    <path d="M10.5 18.5V9.5C10.5 9.23478 10.3946 8.98043 10.2071 8.79289C10.0196 8.60536 9.76522 8.5 9.5 8.5C9.23478 8.5 8.98043 8.60536 8.79289 8.79289C8.60536 8.98043 8.5 9.23478 8.5 9.5V18.5C8.5 18.7652 8.60536 19.0196 8.79289 19.2071C8.98043 19.3946 9.23478 19.5 9.5 19.5C9.76522 19.5 10.0196 19.3946 10.2071 19.2071C10.3946 19.0196 10.5 18.7652 10.5 18.5Z" fill={"red"}/>
                    <path d="M15.5 18.5V9.5C15.5 9.23478 15.3946 8.98043 15.2071 8.79289C15.0196 8.60536 14.7652 8.5 14.5 8.5C14.2348 8.5 13.9804 8.60536 13.7929 8.79289C13.6054 8.98043 13.5 9.23478 13.5 9.5V18.5C13.5 18.7652 13.6054 19.0196 13.7929 19.2071C13.9804 19.3946 14.2348 19.5 14.5 19.5C14.7652 19.5 15.0196 19.3946 15.2071 19.2071C15.3946 19.0196 15.5 18.7652 15.5 18.5Z" fill={"red"}/>
                    </svg>
                    <span className="text-[red] font-medium">Remove</span>
                </div>}
            </div>
        
            <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-col items-start">
                        <span className="text-lg font-medium">Adults</span>
                        <span>18+</span>
                    </div>
                    <div className=" flex flex-row justify-end items-center gap-3 font-medium text-2xl">
                        <button className="h-[30px] w-[30px] bg-accent flex rounded-full justify-center items-center text-light disabled:bg-accent/50 cursor-pointer" onClick={removeAdult} disabled={adults===0}>
                            -
                        </button>
                        <span  className="w-[20px] text-center">{adults}</span>
                        <button className="h-[30px] w-[30px] bg-accent flex rounded-full justify-center items-center text-light disabled:bg-accent/50 cursor-pointer"  onClick={addAdult} disabled={adults+children===5}>
                            +
                        </button>
                    </div>
                </div>

                <div className="w-full h-px bg-primary/50"/>

                <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-col items-start">
                        <span className="text-lg font-medium">Children</span>
                        <span>1-17</span>
                    </div>
                    <div className=" flex flex-row justify-end items-center gap-3 font-medium text-2xl">
                        <button className="h-[30px] w-[30px] bg-accent flex rounded-full justify-center items-center text-light disabled:bg-accent/50 cursor-pointer"  onClick={removeChild} disabled={children===0}>
                            -
                        </button>
                        <span className="w-[20px] text-center">{children}</span>
                        <button className="h-[30px] w-[30px] bg-accent flex rounded-full justify-center items-center text-light disabled:bg-accent/50 cursor-pointer"  onClick={addChild} disabled={adults+children===5}>
                            +
                        </button>
                    </div>
                </div>


                {children> 0 && <div className="w-full h-px bg-primary/50"/>}

                {children> 0 && <div className="w-full flex flex-col gap-2">
                    {showChildrenAges()}
                </div>}


                <div className="w-full h-[2px] bg-primary/50"/>

    </div>
    )

}