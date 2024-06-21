// import React, { useState } from 'react'
// import axios from "../Api"

// const Status = (props) => {
//     const [status, setStatus] = useState(props.status);
//     const choices = ['Pending', 'Approved', 'Denied', (props.handle == "donations" ? 'Donated' : "Completed")];
//     return (
//         <div >
//             <select name="status" id="status" onChange={async (k) => {
//                 if (k.target.value === "Donated") {
//                     await axios.put(`/bank/updateStock`, { foodGroup: props.foodGroup, units: props.units })
//                         .then(async (response) => {
//                             alert("Stock Updated");
//                             await axios.put(`/bank/${props.handle}`, { id: props.id, status: k.target.value })
//                                 .then(async (response) => {
//                                     setStatus(k.target.value);
//                                     props.setId(props.i);
//                                     props.setStatus(k.target.value);
//                                 }, (error) => {
//                                     alert("Something went wrong");
//                                 });
//                         }, (error) => {
//                             alert("Something went wrong");
//                         });
//                 } else if (k.target.value === "Completed") {
//                     await axios.put(`/bank/deleteStock`, { foodGroup: props.foodGroup, units: props.units })
//                         .then(async (response) => {
//                             alert("Stock Updated");
//                             await axios.put(`/bank/${props.handle}`, { id: props.id, status: k.target.value })
//                                 .then(async (response) => {
//                                     setStatus(k.target.value);
//                                     props.setId(props.i);
//                                     props.setStatus(k.target.value);
//                                 }, (error) => {
//                                     alert("Something went wrong");
//                                 });
//                         }, (e) => {
//                             alert(e.request.status == 404 ? "Not Enough Food" : "Something went wrong");
//                         });
//                 } else {
//                     await axios.put(`/bank/${props.handle}`, { id: props.id, status: k.target.value })
//                         .then(async (response) => {
//                             setStatus(k.target.value);
//                             props.setId(props.i);
//                             props.setStatus(k.target.value);
//                         }, (error) => {
//                             alert("Something went wrong");
//                         });
//                 }
//             }}
//                 disabled={status == "Denied" || status == "Donated" || status == "Completed"}
//                 className={(status == "Pending" ? "border-metal text-metal" : (status == "Approved" ? "border-yellowX text-yellowX " : (status == "Denied" ? "border-red text-red" : "border-green text-green"))) + ' border-2 px-4 py-2 rounded-xl hover:shadow-md cursor-pointer'}
//             >
//                 {
//                     choices.map((e) =>
//                         <option value={e} selected={status === e}>{e}</option>
//                     )
//                 }
//             </select>
//         </div >
//     )
// }

// export default Status

import React, { useState } from 'react';
import axios from "../Api"; // Assuming axios is imported from a custom module named Api

const Status = (props) => {
    const [status, setStatus] = useState(props.status); // State to manage the current status
    const choices = ['Pending', 'Approved', 'Denied', (props.handle == "donations" ? 'Donated' : "Completed")]; // Array of status options based on props

    return (
        <div>
            {/* Dropdown select element to change status */}
            <select
                name="status"
                id="status"
                onChange={async (k) => {
                    // Event handler for status change
                    //onChange event triggers when the user selects a different status. It checks the selected value (k.target.value) and performs corresponding actions based on the chosen status.
                    if (k.target.value === "Donated") {
                        // Conditionally update stock if status is "Donated"
                        await axios.put(`/bank/updateStock`, { foodGroup: props.foodGroup, units: props.units })
                            .then(async (response) => {
                                alert("Stock Updated");
                                // Update status in backend and locally if successful
                                await axios.put(`/bank/${props.handle}`, { id: props.id, status: k.target.value })
                                    .then(async (response) => {
                                        setStatus(k.target.value);
                                        props.setId(props.i);
                                        props.setStatus(k.target.value);
                                    }, (error) => {
                                        alert("Something went wrong");
                                    });
                            }, (error) => {
                                alert("Something went wrong");
                            });
                    } else if (k.target.value === "Completed") {
                        // Conditionally delete stock if status is "Completed"
                        await axios.put(`/bank/deleteStock`, { foodGroup: props.foodGroup, units: props.units })
                            .then(async (response) => {
                                alert("Stock Updated");
                                // Update status in backend and locally if successful
                                await axios.put(`/bank/${props.handle}`, { id: props.id, status: k.target.value })
                                    .then(async (response) => {
                                        setStatus(k.target.value);
                                        props.setId(props.i);
                                        props.setStatus(k.target.value);
                                    }, (error) => {
                                        alert("Something went wrong");
                                    });
                            }, (e) => {
                                alert(e.request.status == 404 ? "Not Enough Food" : "Something went wrong");
                            });
                    } else {
                        // Update status in backend and locally for other status changes
                        await axios.put(`/bank/${props.handle}`, { id: props.id, status: k.target.value })
                            .then(async (response) => {
                                setStatus(k.target.value);
                                props.setId(props.i);
                                props.setStatus(k.target.value);
                            }, (error) => {
                                alert("Something went wrong");
                            });
                    }
                }}
                // Disable dropdown if status is "Denied", "Donated", or "Completed"
                disabled={status == "Denied" || status == "Donated" || status == "Completed"}
                // Dynamically set class names based on current status for styling
                className={(status == "Pending" ? "border-metal text-metal" : (status == "Approved" ? "border-yellowX text-yellowX " : (status == "Denied" ? "border-red text-red" : "border-green text-green"))) + ' border-2 px-4 py-2 rounded-xl hover:shadow-md cursor-pointer'}
            >
                {/* Map through choices and render options */}
                {choices.map((e) =>
                    <option key={e} value={e} selected={status === e}>{e}</option>
                )}
            </select>
        </div>
    );
}

export default Status;
