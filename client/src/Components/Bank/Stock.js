import React, { useState, useEffect } from 'react'
import axios from "../Api";

const Stock = () => {
    const [data, setData] = useState([]);
    //useEffect hook is used to fetch stock data from a server when the component mounts.
    //Component Mounts: When the component is first rendered, the useEffect hook runs.
    //Data Fetch: It sends a GET request to /bank/getStock to fetch the stock data.
    //
    useEffect(() => {
        axios.get("/bank/getStock").then((r) => {
            setData(r.data.stock);//Update State: If the request is successful, it updates the state with the retrieved stock data.
        }).catch((err) => { alert("Something went wrong") })//Error Handling: If there is an error, it alerts the user
    }, []);
    return (
        <div>
            <div className="flex justify-center flex-wrap text-center text-white-900 text-2xl">
                {//If data exists, it proceeds to map over its keys.
                //Object.keys(data) retrieves an array of keys from the data object.
                 //.map((e) => { ... }) iterates over each key (e) and returns a JSX element for each one.
                    data && Object.keys(data).map((e) => {
                        return (
                            <div className='bg-blood h-22 w-22 m-10 p-7 rounded-b-full'>
                                {/*A p element displaying the value associated with the key, followed by "mL". The value is accessed with data[e].*/}
                                <p className='font-bold'>{data[e]}mL</p>
                                <code>{e}</code>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Stock

{/* eg:-
    
    const data = {
    A_positive: 500,
    B_negative: 300,
    AB_positive: 200
};

<div class='bg-blood h-22 w-22 m-10 p-7 rounded-b-full'>
    <p class='font-bold'>500mL</p>
    <code>A_positive</code>
</div>
<div class='bg-blood h-22 w-22 m-10 p-7 rounded-b-full'>
    <p class='font-bold'>300mL</p>
    <code>B_negative</code>
</div>
<div class='bg-blood h-22 w-22 m-10 p-7 rounded-b-full'>
    <p class='font-bold'>200mL</p>
    <code>AB_positive</code>
</div>

 */}