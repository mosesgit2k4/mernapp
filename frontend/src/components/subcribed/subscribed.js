import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

function Subscribed(){
    const  [subscribedplans,setsubscribedplans] = useState(true)
    const [subscribeddetails,setsubscribeddetails] = useState('')
    const [transactiondetails,settransactiondetails] = useState('')
    useEffect(()=>{
        const cookie = new Cookies()
        const jwtToken = cookie.get('token_authenication')
fetch('api/usermanagement/latestplan',{method:"GET",headers:{"Authorization":`Bearer ${jwtToken}`}}).then(response=>response.json()).then(data=>{setsubscribeddetails(data.plan)})

        fetch('api/usermanagement/transaction',{method:"GET",headers:{"Authorization":`Bearer ${jwtToken}`}}).then(response=>response.json()).then(data=>
            {console.log(data)
            settransactiondetails(data)})
    },[])



    function handlesubscription(){
        
        let deletetrans = {
            id:transactiondetails._id
        }
        fetch('api/usermanagement/transactiondelete',{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify(deletetrans)}).then(response=>{return response.json()}).then(data=>console.log(data))
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