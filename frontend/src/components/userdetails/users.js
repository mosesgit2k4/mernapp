import React, { useState,useEffect } from "react";
function Users(){
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
                                <img src={user.image} width={200} height={300} alt={user.name} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Users