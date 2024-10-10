import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './home.css';

function Homepage() {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        fetch('/api/usermanagement/plans', {
            method: "GET",
        }).then(response => response.json())
          .then(data => setPlans(data));
    }, []);

    function subscriptionToPlan(plan) {
        navigate("/subscription", { state: { plan } });
    }

    return (
        <div className="container">
            <h1>Plans</h1>
            <div className="plans-grid">
                {plans.map(plan => (
                    <div key={plan.id} className="card">
                        <div className="content">
                            <div className="title">{plan.name}</div>
                            <div className="price">
                                <img src={plan.image} width={100} height={100} alt={plan.name} />
                            </div>
                            <div className="description">{plan.description}</div>
                        </div>
                        <button className="button type1" onClick={() => subscriptionToPlan(plan)}></button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Homepage;
