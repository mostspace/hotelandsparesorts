import { useEffect, useState } from 'react';
import { Range } from 'react-range';

interface CheckedListFilterProps{
    filterID:string
    title:string
    selected:any[]
    valueChanged:any
}

export const SliderFilter = (props:CheckedListFilterProps) => {

    const MIN = 25;
    const MAX = 1000;

    const [values, setValues] = useState(props.selected);

    useEffect( () => {
    
        console.log("CHAGE SLIDE",props.selected)
        setValues(props.selected)
    
    }, [props.selected[0],props.selected[1]]);

    
    

    return(
    <div className="w-full flex flex-col items-start gap-3.5">
        
        <span className="text-xl font-medium">{props.title}</span>

        <span className="text-xl">€{values[0]} – €{values[1]}</span>


        <Range
            step={10}
            min={MIN}
            max={MAX}
            values={values}
            onChange={(vals) => setValues(vals)}
            onFinalChange={(vals) => props.valueChanged(props.filterID, vals)}
            renderTrack={({ props, children }) => {
                const [minVal, maxVal] = values;
                const percentageLeft = ((minVal - MIN) / (MAX - MIN)) * 100;
                const percentageWidth = Math.min(100 - percentageLeft, ((maxVal - minVal) / (MAX - MIN)) * 100);

                return (
                    <div
                    {...props}
                    className="relative h-2 w-full rounded-full bg-light"
                    >
                    {/* Colored range between thumbs */}
                    <div
                        className="absolute h-full bg-accent rounded-full"
                        style={{
                        left: `${percentageLeft}%`,
                        width: `${percentageWidth}%`,
                        }}
                    />
                    {children}
                    </div>
                );
            }}
            renderThumb={({ props }) => (
            <div
                {...props}
                className="h-5 w-5 rounded-full bg-muted shadow-md border-[5px] border-accent"
            />
            )}
        />
    </div>
    )

}