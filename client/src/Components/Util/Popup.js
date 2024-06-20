import React from 'react'
import mapboxgl from "mapbox-gl";


//The Popup component is designed to show detailed information in a popup window.
// It displays various data fields from props.data in a structured table format, excluding certain fields like IDs and 
//coordinates for clarity. If location data (longitude and latitude) is available, it embeds a Mapbox map showing the exact
// location with a marker. Users can close the popup using a provided button, making it a useful tool for presenting and interacting
// with specific details and geographic information within a web application.



const Popup = (props) => {
    // Set the access token for Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29yb2JvcmkiLCJhIjoiY2s3Y3FyaWx0MDIwbTNpbnc4emxkdndrbiJ9.9KeSiPVeMK0rWvJmTE0lVA';
    
    return (
        <div>
            {
                // Check if the popup should be displayed (popup state is not -1)
                props.popup != -1 && <div className="popup h-[150%] overflow-scroll">
                    <div className='popup_inner rounded-lg p-7 overflow-y-scroll'>
                        <div>
                            <h1 className='text-2xl font-bold inline-block'>
                                {/* Display the type of details, e.g., User Details or bank details*/}
                                {props.handle} Details
                            </h1>
                            <i 
                                // Close button for the popup ,Setting the popup state to -1 typically hides or closes the popup.
                                onClick={() => props.setPopup(-1)} 
                                className="fa-solid fa-circle-xmark text-blood fa-xl float-right cursor-pointer hover:opacity-80">
                            </i>
                        </div><br />
                        <table className='w-full'>
                            {
                                // If there is data, display it
                                props.data && <>
                                    {
                                        // This line of code iterates over the keys of an object (props.data).
                                        //It creates an array where each element corresponds to a key (e) from props.data.
                                  //Why It's Used: This pattern is used to dynamically render content based on the keys and values of an object.
                                  //Object.keys() is a JavaScript method that returns an array of a given object's own enumerable property names (keys).
                                        Object.keys(props.data).map((e) => {
                                            return (
                                                // This checks if the current key (e) is not equal to "_id", "longitude", or "latitude".
                                                //If any of these conditions are true, it skips rendering the corresponding <tr>.
                                                //The code snippet will generate table rows and cells for each key-value pair in props.data, excluding "_id", "longitude", and "latitude". For example:
                                                e != "_id" && e != "longitude" && e != "latitude" && <tr className='border'>
                                                    <td className='font-bold p-4 border'>
                                                        {/*capitalizes the first letter of e (the key). For example, if e is "name", it displays as "Name".*/}
                                                        {e[0].toUpperCase() + e.substr(1,)}
                                                    </td>
                                                    <td className='p-2'>
                                                        {/*  checks if props.data[e] exists and is truthy:
                                                      If props.data[e] is truthy (not null, undefined, false, 0, "", etc.), it displays props.data[e].
                                                     Otherwise, it displays "---". */}
                                                        {props.data[e] ? props.data[e] : "---"}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    {/* This checks if props.data.longitude exists and is truthy 
                                    if props.data.longitude is truthy, the map and associated elements are rendered inside the table row (<tr>).*/}
                                    {props.data.longitude && <tr className='border'>
                                        <td className='font-bold p-4 border'>Location</td>
                                        <td className='p-2'>
                                            {/* Container for the map */}
                                            <div id="map" className="w-full h-[200px]"></div>
                                            {
                                                // Immediately invoked function expression (IIFE) to render the map
                                                (() => {
                                                    // Uses setTimeout() to delay map initialization by 100 milliseconds after rendering, ensuring DOM elements are ready.
                                                    setTimeout(() => {
                                                        //Initializes a new mapboxgl.Marker() at [props.data.longitude, props.data.latitude] and adds it to a new mapboxgl.Map() instance.
                                                        new mapboxgl.Marker().setLngLat([props.data.longitude, props.data.latitude]).addTo(new mapboxgl.Map({
                                                            container: 'map', // ID of the container to render the map in
                                                            style: 'mapbox://styles/mapbox/streets-v12', // Style URL
                                                            center: [props.data.longitude, props.data.latitude], // Initial center coordinates
                                                            zoom: 10.7 // Initial zoom level
                                                        }));
                                                    }, 100)
                                                    return <></>
                                                })()
                                            }
                                        </td>
                                    </tr>}
                                </>
                            }
                        </table>
                    </div>
                </div>
            }
        </div>
    )
}

export default Popup;

//The purpose of this code is to visually represent a geographical location (props.data.longitude and props.data.latitude) 
//on a map using Mapbox GL JS. It dynamically creates a map marker and centers the map at the specified coordinates, 
//enhancing the display of location-based data within the web page. This helps users visualize where specific data points are located geographically.







