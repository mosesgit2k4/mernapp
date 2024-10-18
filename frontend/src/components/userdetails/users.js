import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
function UserDetailsforadmin(){
    const navigator = useNavigate()
    const [users,setuser] = useState([])
    useEffect(() => {
        fetch('api/usermanagement/users', {
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(data => {
            setuser(data);
        });
    }, []);
    function handleview(user){
        let userdetails = {
            userid :user._id
        }
        fetch('api/usermanagement/transactionhistory',{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(userdetails)}).then(response=>response.json())
        navigator('/viewdetails')
    }
    return(
<div className="container">
            <h1>Users</h1>
            <div className="plans-grid">
                {users.map(user => (
                    <div key={user.id} className="card">
                        <div className="content">
                            <div className="title">{user.firstName}</div>
                            <div className="title">{user.lastName}</div>
                            <div className="title">{user.email}</div>
                            <div className="price">
                                <img src={user.image} width={150} height={100} alt={user.name} />
                            </div>
                            <div className="mt-5 ml-3">
                                <button onClick={()=>handleview(user)} className="btn btn-primary">View</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserDetailsforadmin