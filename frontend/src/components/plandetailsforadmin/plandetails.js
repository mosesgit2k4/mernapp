import React, { useEffect, useState } from "react";
function Plandetails(){
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        fetch('/api/usermanagement/plans', {
            method: "GET",
        }).then(response => response.json())
          .then(data => setPlans(data));
    }, []);
    return(<div className="container">
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
                </div>
            ))}
        </div>
    </div>
    )
}

export default Plandetails