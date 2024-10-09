import React from "react";
import { useLocation } from "react-router-dom";
function Subscription() {
    const location = useLocation();
    const plan = location.state?.plan
    if(!plan){
        return <p>No Plan Details available</p>
    }
    return (
        <div  className="transact-container">
               <div className="card">
                
               </div>
               <div className="">
                </div>
        </div>
    )
}

export default Subscription