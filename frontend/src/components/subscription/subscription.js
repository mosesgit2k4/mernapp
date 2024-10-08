import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Subscription(){
    const {id} = useParams()
    const [plan,setplan] = useState('')
    useEffect(()=>{
        fetch(`/api/usermanagement/plans/${id}`,{
            method:"get"
        }).then(response=>{
            return response.json()
        }).then(data=>{ setplan(data)
            console.log(data)})
    },[id])
    return(
        <div>
            <div className="plan">
                <h3 className="planheading">Plan:{plan.name}</h3>
                <img src={plan.image} width={200} height={200} alt="" />
                <p>Description:{plan.description}</p>
                <p>Started at {plan.start}</p>
                <p>Will End at {plan.end}</p>
            </div>
        </div>
    )
}

export default Subscription