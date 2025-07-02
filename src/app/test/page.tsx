"use client";

import { Button } from "@/components/ui/button";

export default function TestPage() {

    const localClick = () => {
        console.log("Local Click")
    }

    const apiClickGet = async () => {
        try {
            const res = await fetch("/api/trip-advisor/reviews");
            if (!res.ok) throw new Error(`Error: ${res.status}`);
      
            const data = await res.json();
            console.log("API response:", data);
          } catch (error) {
            console.error("API call failed:", error);
          }
    }

    const apiClickPost = async () => {
        try {
            const res = await fetch("/api/test", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: "Caolan", age: 29 }),
            });
        
            if (!res.ok) throw new Error(`Error: ${res.status}`);
        
            const data = await res.json();
            console.log("API POST response:", data.user);
          } catch (error) {
            console.error("API POST call failed:", error);
          }
    }

    const apiClickPost2 = async () => {
        try {
            const res = await fetch('http://localhost:8000/test-data');
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await res.json();
            console.log("EXTERNAL API response:", data);
          } catch (error) {
            console.error("API call failed:", error);
          }
    }

    const apiClick = async () => {
      try {
        const res = await fetch("/api/ratehawk/test?test=Cao", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            test: "GM",
          }),
        });
    
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
    
        console.log("API response:", data);
        // Expected: { sp: "queryValue", body: "bodyValue" }
    
      } catch (error) {
        console.error("POST request failed:", error);
      }
    };

    
  return (
    <div className="flex flex-col items-center gap-1" >
      
      <span>TEST PAGE</span>

      <div className="flex flex-row items-center gap-2" >
            <button onClick={localClick}>Button 1</button>
            <Button onClick={apiClickGet}>Button 2</Button>
            <Button onClick={apiClick}>Button 3</Button>

      </div>

      <Button>RateHawk Button</Button>

    </div>
  );
}
