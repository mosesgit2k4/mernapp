import React from "react";
import { useLocation } from "react-router-dom";
function Subscription() {
    const location = useLocation();
    const plan = location.state?.plan
    if(!plan){
        return <p>No Plan Details available</p>
    }
    return (
        <div>
            <div className="plan">
            <h3 className="planheading">Plan: {plan.name}</h3>
                <img src={plan.image} width={200} height={200} alt={plan.name} />
                <p>Description: {plan.description}</p>
            </div>
        </div>
    )
}

export default Subscription