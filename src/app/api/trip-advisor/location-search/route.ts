import { NextResponse } from 'next/server'
const API_KEY = '424E337DAFE14BE58C36ACA2ED22B998'
const locationID = '17813462'
export function GET() {

    return new Promise(async (resolve, reject) => {

    const options = {method: 'GET', headers: {accept: 'application/json'}};

    const res = await fetch(`https://api.content.tripadvisor.com/api/v1/location/search?key=${API_KEY}&searchQuery=Dublin&category=hotels&latLong=53.326733%2C%20-6.225853&radius=1&radiusUnit=m&language=en`, options)
    const data = await res.json();
    resolve(NextResponse.json(data.data))

    })

}



[
    {
        "location_id": "17813462",
        "name": "Hyatt Centric The Liberties Dublin",
        "distance": "0.30012153287278703",
        "bearing": "southeast",
        "address_obj": {
            "street1": "Dean Street",
            "street2": "The Liberties",
            "city": "Dublin",
            "state": "Province of Leinster",
            "country": "Ireland",
            "postalcode": "D08 W3X7",
            "address_string": "Dean Street The Liberties, Dublin D08 W3X7 Ireland"
        }
    },
    {
        "location_id": "15121950",
        "name": "Aloft Dublin City",
        "distance": "0.3786986802661839",
        "bearing": "south",
        "address_obj": {
            "street1": "1 Mill Street, The Liberties",
            "street2": "The Liberties",
            "city": "Dublin",
            "state": "Province of Leinster",
            "country": "Ireland",
            "postalcode": "D08 XK58",
            "address_string": "1 Mill Street, The Liberties The Liberties, Dublin D08 XK58 Ireland"
        }
    },
    {
        "location_id": "2153102",
        "name": "Generator Dublin",
        "distance": "0.39845165566606383",
        "bearing": "north",
        "address_obj": {
            "street1": "Smithfield",
            "street2": "Chimney Viewing Tower, Arran Quay",
            "city": "Dublin",
            "state": "Province of Leinster",
            "country": "Ireland",
            "postalcode": "D07 F2VF",
            "address_string": "Smithfield Chimney Viewing Tower, Arran Quay, Dublin D07 F2VF Ireland"
        }
    },
    {
        "location_id": "209081",
        "name": "The Fitzwilliam Hotel Dublin",
        "distance": "0.6990465589624265",
        "bearing": "east",
        "address_obj": {
            "street1": "127/128 St. Stephen's Green",
            "city": "Dublin",
            "state": "Province of Leinster",
            "country": "Ireland",
            "postalcode": "D02 HE18",
            "address_string": "127/128 St. Stephen's Green, Dublin D02 HE18 Ireland"
        }
    },
    {
        "location_id": "19721847",
        "name": "NYX Hotel Dublin Christchurch",
        "distance": "0.40479218405418976",
        "bearing": "east",
        "address_obj": {
            "street1": "18 Exchange Street Upper",
            "city": "Dublin",
            "state": "Province of Leinster",
            "country": "Ireland",
            "postalcode": "D08 AV24",
            "address_string": "18 Exchange Street Upper, Dublin D08 AV24 Ireland"
        }
    },
    {
        "location_id": "209080",
        "name": "Conrad Dublin",
        "distance": "0.9760445146411231",
        "bearing": "southeast",
        "address_obj": {
            "street1": "Earlsfort Terrace",
            "city": "Dublin",
            "state": "Province of Leinster",
            "country": "Ireland",
            "postalcode": "D02 V562",
            "address_string": "Earlsfort Terrace, Dublin D02 V562 Ireland"
        }
    },
    {
        "location_id": "209082",
        "name": "Hotel Riu Plaza The Gresham Dublin",
        "distance": "0.92574787977787",
        "bearing": "northeast",
        "address_obj": {
            "street1": "23 Upper O'Connell Street",
            "street2": "",
            "city": "Dublin",
            "state": "Province of Leinster",
            "country": "Ireland",
            "postalcode": "D01 C3W7",
            "address_string": "23 Upper O'Connell Street, Dublin D01 C3W7 Ireland"
        }
    },
    {
        "location_id": "212690",
        "name": "Ashling Hotel Dublin",
        "distance": "0.6757375027844965",
        "bearing": "northwest",
        "address_obj": {
            "street1": "10-13 Parkgate Street",
            "city": "Dublin",
            "state": "Province of Leinster",
            "country": "Ireland",
            "postalcode": "D08 P38N",
            "address_string": "10-13 Parkgate Street, Dublin D08 P38N Ireland"
        }
    },
    {
        "location_id": "208232",
        "name": "The Merrion Hotel Dublin",
        "distance": "1.0547778247381665",
        "bearing": "east",
        "address_obj": {
            "street1": "Upper Merrion Street",
            "city": "Dublin",
            "state": "Province of Leinster",
            "country": "Ireland",
            "postalcode": "D02 KF79",
            "address_string": "Upper Merrion Street, Dublin D02 KF79 Ireland"
        }
    },
    {
        "location_id": "15093146",
        "name": "Staycity Aparthotels, Dublin Castle",
        "distance": "0.3220115099578212",
        "bearing": "east",
        "address_obj": {
            "street1": "Bride Street",
            "street2": "Chancery Lane",
            "city": "Dublin",
            "state": "Province of Leinster",
            "country": "Ireland",
            "postalcode": "D08 Y2AY",
            "address_string": "Bride Street Chancery Lane, Dublin D08 Y2AY Ireland"
        }
    }
  ]