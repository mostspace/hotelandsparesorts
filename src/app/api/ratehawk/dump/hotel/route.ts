import { NextResponse } from 'next/server'

import os from 'os';
import zlib from 'zlib';


export async function GET(req:Request) {



    // const response = await fetch('https://api.worldota.net/api/b2b/v3/hotel/info/dump/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Basic ' + btoa(`${KEY_ID}:${API_KEY}`)
    //     },
    //     body: JSON.stringify({
    //       inventory: "all",
    //       language: "en",
    //     })
    //   });

        const fs = require('fs');
        const readline = require('readline');
        const path = require('path');
        
       
        let jsonArray = []

        const filePath = path.join(os.homedir(), 'Downloads', 'data_dump.jsonl');
        const fileStream = fs.createReadStream(filePath);

        const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity,
        });

        let i = 0;
        const startingIndex = 30000;

        for await (const line of rl) {
          try {
            const json = JSON.parse(line);
            if (json.star_rating > 4) {
              if (i >= startingIndex) {
                jsonArray.push(json);
              }
              i++;
              console.log("COUNT", i)
              if (i === startingIndex + 10000) {
                break;
              }
            }
          } catch (err) {
            console.error('Failed to parse line:', line);
          }
        }

        console.log("1: Returning JSON with", jsonArray.length, "items");

        

        // Convert to JSON string
        const jsonString = JSON.stringify(jsonArray, null, 2);
        return new Response(jsonString, {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename="five-star-hotels5.json"',
          },
        });

        // // Gzip the result
        // const gzipped = zlib.gzipSync(jsonString);

        // console.log("2: Returning JSON with", jsonArray.length, "items");

        // // Return as downloadable response
        // return new Response(gzipped, {
        //   status: 200,
        //   headers: {
        //     'Content-Type': 'application/gzip',
        //     'Content-Encoding': 'gzip',
        //     'Content-Disposition': 'attachment; filename="five-star-hotels.json.gz"',
        //   },
        // });



}