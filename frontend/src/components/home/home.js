import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './home.css'
function Homepage() {
    const navigator = useNavigate()
    const [plans, setplan] = useState([])
    useEffect(() => {
        fetch('/api/usermanagement/plans', {
            method: "Get",
        }).then(response => {
            return response.json()
        }).then(data => {
            setplan(data)
        })
    }, [])
    function subscriptiontoplan(plan) {
       navigator("/subscription",{state:{plan}})
    }
    return (
        <div>
            <h1>Plans</h1>
            <div className="d-flex flex row justify-content-start">
                {plans.map(plan => (
                    <li key={plan.id}>
                        <div class="card">
                            <div class="content">
                                <div class="title">{plan.name}</div>
                                <div class="price">
                                    <img src ={plan.image} width={100} height={100} alt=""/>
                                </div>
                                <div class="description">{plan.description}</div>
                            </div>
                                <button  onClick={() => subscriptiontoplan(plan)}>Subcribe</button>
                            </div>
                    </li>
                ))}
            </div>
        </div>
    )
}

export default Homepage