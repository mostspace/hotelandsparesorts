"use client";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export default function CalendarTest() {

     const [dateRange, setDateRange] = useState<any>({});
      const [hasFullDateRange, setHasFullDateRange] = useState<any>(false);
      const [hoveredDate, setHoveredDate] = useState<any>()
  
      function handleDateSelect(range: { from?: Date; to?: Date } | undefined) {
        if (!range) {
            // If user cleared the selection, reset state
            setDateRange({})
            return
        }

        console.log("RANGE", range)
        console.log("DATE RANGE", dateRange)
        console.log("HAS FULL RANGE", hasFullDateRange)

        let selectedRange = range

        if(range.from === range.to){
            selectedRange = {from:range.from}
        }

        

        // If both dates were already selected, start a new range
        if (selectedRange.from && selectedRange.to) {
            if(hasFullDateRange){
                if(selectedRange.from < dateRange.from)
                {
                    setDateRange({from:range.from})
                    // setCheckInDate(range.from); setCheckOutDate(undefined)
                }else{
                    setDateRange({from:range.to})
                    // setCheckInDate(range.to); setCheckOutDate(undefined)
                }
                // setDateRange( range )
                setHasFullDateRange(false)
            }
            else{
                setHasFullDateRange(true)
                setDateRange(selectedRange)
                // setCheckInDate(selectedRange.from); setCheckOutDate(selectedRange.to)
            }
        } else {
            setDateRange(selectedRange)
            // setCheckInDate(selectedRange.from); setCheckOutDate(selectedRange.to)

        }
    }
    
    
  return (
    <div className="" >
      
      <Calendar
        mode="range"
        numberOfMonths={2}
        selected={dateRange}
        onSelect={handleDateSelect}
        defaultMonth={dateRange?.from ?? new Date()}
        showOutsideDays={false}
        required={false}
        onDayMouseEnter={(date) => setHoveredDate(date)}
        disabled={(date) => {
            const today = new Date();
            if (date < today) return true;
            if (dateRange.from && !dateRange.to && date <= dateRange.from) return true;
            return false;
        }}
        modifiers={{
            hoverRange: (date) => {
            if (!dateRange.from || dateRange.to || !hoveredDate) return false;
            return date >= dateRange.from && date <= hoveredDate;
            },
        }}
        modifiersClassNames={{
            hoverRange: "bg-accent/30",
        }}
      />
   
    </div>
  );
}
