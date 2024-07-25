import React, { useState, useEffect } from 'react'
import data from "../../assets/data.json";
import axios from "../Api";

const Camps = () => {

    const [state, setState] = useState(0);
    const [district, setDistrict] = useState(0);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [filtered, setFiltered] = useState([]);
 //useeffect updates value od state,district and data whenever it changes
    useEffect(() => {
        axios.get(`/camps/allCamps/${data.states[state].state}/${data.states[state].districts[district]}/${date}`).then((r) => setFiltered(r.data)).catch((e) => alert("Something went wrong"));
    }, [state, district, date])

    return (
        <div className='px-7'>
            <table cellPadding={7}>
                <tr>
                    <td><label for="state" className="font-semibold  leading-8" style={{color:"greenyellow"}}>State:<font color="red">*</font></label>
                        <select name="state" id="state" onChange={(e) => { setState(e.target.value); setDistrict(0); }} className="w-full p-3 text-md border border-silver rounded">
                            {    //select state of camp
                                data.states.map((e, i) => <option value={i} selected={state === i}>{e.state}</option>)
                            }
                        </select>
                    </td>
                    <td><label for="district" className="font-semibold  leading-8" style={{color:"greenyellow"}}>District:<font color="red">*</font></label>
                        <select name="district" id="district" onChange={(e) => { setDistrict(e.target.value); }} className="w-full p-3 text-md border border-silver rounded">
                            {   //select discrict of bank corresponding to state
                                data.states[state].districts.map((e, i) => <option value={i} selected={district === i}>{e}</option>)
                            }
                        </select>
                    </td>
                    <td>
                        <label for="district" className="font-semibold  leading-8" style={{color:"greenyellow"}}>Date:<font color="red">*</font></label>
                        <input type="date" value={date} className="w-full p-3 text-md border border-silver rounded"
                                 //set date
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </td>
                </tr>
            </table>
            <br />
            <table className='w-full text-center'>
                <thead>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>Date</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>Camp Name</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>Address</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>State</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>District</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>Contact</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>Conducted By</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>Organized By</th>
                    <th className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>Time</th>
                </thead>
                <tbody>
                    {   // printing camp data in filter section as all data is written oveer there and filter function is written in backend
                        filtered.map((e) =>
                            <tr>
                                <td className="p-3 text-md border border-silver rounded">{new Date(e.date).toLocaleDateString()}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>{e.name}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>{e.address}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>{e.state}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>{e.district}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>{e.contact}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>{e.bankId.name}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}>{e.organizer}</td>
                                <td className="p-3 text-md border border-silver rounded" style={{color:"greenyellow"}}><code>{e.startTime}-{e.endTime}</code></td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Camps