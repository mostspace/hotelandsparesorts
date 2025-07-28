import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"

interface CheckedListFilterProps{
    filterID:string
    title:string
    options:string[]
    selected:any[]
    valueChanged:any
}

export const CheckedListFilter = (props:CheckedListFilterProps) => {

    const [selectedOptions, setSelectedOptions] = useState<any[]>(props.selected);
    
    useEffect( () => {
        
        console.log("CHAGE CHECKILIST",props.selected)
        setSelectedOptions(props.selected)
        
    }, [props.selected.length]);
    
    const showOptions = () => {
        let compArray:any[] = []

        props.options.forEach(option => {
            compArray.push(<div className="flex flex-row gap-2 items-center">
                <Checkbox className="data-[state=checked]:bg-accent border border-primary"
                        checked = {selectedOptions.includes(option)}
                      onCheckedChange={(isChecked) => handleCheckboxChange(option, isChecked)}/>
                <span className="text-lg font-light">{option}</span>
            </div>)
        });

        return compArray
    }

    const handleCheckboxChange = (option:string,isChecked:any) => {

        // console.log("IS CHECKED",isChecked)

        if(isChecked){
            selectedOptions.push(option)
            setSelectedOptions(selectedOptions)
            props.valueChanged(props.filterID,selectedOptions)
        }
        else{
            let newOptions = selectedOptions.filter(item => item !== option);
            setSelectedOptions(newOptions)
            props.valueChanged(props.filterID,newOptions)
        }

    }



    return(
    <div className="flex flex-col items-start gap-5">
        <span className="text-xl font-medium">{props.title}</span>
        <div className="flex flex-col items-start gap-3.5">
            {showOptions()}
        </div>
    </div>
    )

}