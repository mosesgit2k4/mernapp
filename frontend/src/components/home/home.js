import React, { useEffect, useState } from "react";
import './home.css'
function Homepage(){
    const [plans,setplan] = useState([])
    useEffect(()=>{
        fetch('/api/usermanagement/plans',{
            method:"Get",
        }).then(response =>{
            return response.json()
        }).then(data=>{
            setplan(data)
            console.log(data)
        })
    },[])
    return(
        <div>
            <h1>Plans</h1>
            <div className="d-flex flex row justify-content-start">
                {plans.map(plan=>(
                    <li key={plan.id}>
                        <div className="plan">
                            <h3>Plan:{plan.name}</h3>
                            <img src={plan.image} width={100} height={100} alt=""/>
                            <p>Description:{plan.description}</p>
                            <p>Started at {plan.start}</p>
                            <p>Will End at {plan.end}</p>
                        </div>
                    </li>
                ))}
            </div>
        </div>
    )
}

export default Homepage