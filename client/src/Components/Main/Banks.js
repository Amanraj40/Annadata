import React, { useState, useEffect } from 'react'
import data from "../../assets/data.json";
import axios from "../Api";

const Banks = () => {

    const [state, setState] = useState(0);
    const [district, setDistrict] = useState(0);
    const [filtered, setFiltered] = useState([]);
 //The effect runs after every render by default, but with the dependency array [state, district], it only runs when state or district changes.
 //axios.get(/bank/allBanks/${data.states[state].state}/${data.states[state].districts[district]}): This sends a GET request to an endpoint that includes the selected state and district in the URL.The data object contains states and districts, so data.states[state].state and data.states[state].districts[district] are used to get the current state and district names.
 //Ensures that the latest data is fetched whenever these dependencies change.
    useEffect(() => {
        //setFiltered(r.data) updates the state variable filtered with the received data, typically to update the UI with the new list of banks.
        axios.get(`/bank/allBanks/${data.states[state].state}/${data.states[state].districts[district]}`).then((r) => { setFiltered(r.data); }).catch((e) => alert("Something went wrong"));
    }, [state, district])

    return (
        <div className='px-7'>
            <table cellPadding={7}>
                <tr>
                    <td><label for="state" className="font-semibold  leading-8">State:<font color="red">*</font></label>
                        <select name="state" id="state" onChange={(e) => { setState(e.target.value); setDistrict(0); }} className="w-full p-3 text-md border border-silver rounded">
                            {   //select states from map data
                                data.states.map((e, i) => <option value={i} selected={state === i}>{e.state}</option>)
                            }
                        </select>
                    </td>
                    <td><label for="district" className="font-semibold  leading-8">District:<font color="red">*</font></label>
                        <select name="district" id="district" onChange={(e) => { setDistrict(e.target.value); }} className="w-full p-3 text-md border border-silver rounded">
                            {    //select districts corresponding to particular state
                                data.states[state].districts.map((e, i) => <option value={i} selected={district === i}>{e}</option>)
                            }
                        </select>
                    </td>
                </tr>
            </table>
            <br />
            <table className='w-full text-center'>
                <thead>
                    <th className="p-3 text-md border border-silver rounded" style={{color:'green'}}>Food Bank Name</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"green"}}>Parent Organisation</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"green"}}>Category</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"green"}}>State</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"green"}}>District</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"green"}}>Address</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"green"}}>Contact</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"green"}}>Website</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"green"}}>Email</th>
                </thead>
                <tbody>
                    {    //all bank details are written here and can be filtered on basis of state and district,its filter code is written in backend
                        filtered.map((e) =>
                            <tr>        
                                <td className="p-3 text-md border border-silver rounded" style={{color:"green"}}>{e.name}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"green"}}>{e.organisation}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"green"}}>{e.category}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"green"}}>{e.state}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"green"}}>{e.district}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"green"}}>{e.address}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"green"}}>{e.phone}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"green"}}>{e.website}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"green"}}>{e.email}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Banks