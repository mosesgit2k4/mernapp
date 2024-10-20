import React, { useEffect, useState } from "react";
function ViewDetails(){
    const [users,setuser] = useState([])
    const [transactionisfound,settransactionisfound] = useState(false)
    useEffect(()=>{
        fetch('api/usermanagement/transactionhistory',{method:"GET",headers:{"Content-Type":"application/json"}}).then(response=>response.json()).then(data=>{console.log(data)
            settransactionisfound(true)
            setuser(data)})
    },[])
    return(
        <>
        {transactionisfound ? (<div className="container">
        <h1>Transaction </h1>
        <div className="plans-grid">
            {users.map(user => (
                <div key={user.id} className="card">
                    <div className="content">
                        <div className="title">{user.name}</div>
                        <div>
                            <img src={user.image} alt={user.name}/>
                        </div>
                        <div>{user.amount}</div>
                        {user.deleted ? <div>CANCELLED</div>:<div>ACTIVE</div>}
                    </div>
                </div>
            ))}
        </div>
        </div>):(<div>No Plans for this User</div>)}
    </>
    )
}

export default ViewDetails