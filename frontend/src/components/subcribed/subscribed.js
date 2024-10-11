import React, { useState } from "react";

function Subscribed(){
    const subscribeddetails = JSON.parse(localStorage.getItem("plan"));
    const  [subscribedplans,setsubscribedplans] = useState(true)
    function handlesubscription(){
        localStorage.setItem('subscribed',true)
        setsubscribedplans(false)
    }
    return(
        <>
        {subscribedplans ? (
            <div>
                <p>{subscribeddetails.name}</p>
                <button onClick={handlesubscription}>Unsubscribe</button>
                </div>

        ) : (
            <div>
                <p>No Plans subscribed till now</p>
            </div>
        )}
        </>
    )
}

export default Subscribed