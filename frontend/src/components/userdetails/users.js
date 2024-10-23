import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Cookies from "universal-cookie";

function UserDetailsforadmin(){
    const navigator = useNavigate()
    const [users,setuser] = useState([])
    const navigate = useNavigate();
    const [admin,setadmin] = useState('')
    const [isMinimized, setIsMinimized] = useState(false);
    useEffect(() => {
        fetch('api/usermanagement/users', {
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(data => {
            setuser(data);
        });
        const cookie = new Cookies()
        const jwtToken = cookie.get('token_authenication')
        fetch('api/usermanagement/myprofile',{method:"GET",headers:{ "Authorization":`Bearer ${jwtToken}`}})
        .then(response=> response.json())
        .then(data=>{console.log(data)
        setadmin(data)})
    }, []);
    function handleview(user){
        let userdetails = {
            userid :user._id
        }
        fetch('api/usermanagement/transactionhistory',{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(userdetails)}).then(response=>response.json())
        navigator('/viewdetails')
    }
    function toggleSidebar() {
        setIsMinimized(!isMinimized);
    }
    return(
        <>
        <div className="admin-page">
            <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
                <Navbar bg="dark" variant="dark" expand="lg" className="flex-column sidebar-navbar">
                    <Navbar.Brand>Admin</Navbar.Brand>
                    <Nav className="flex-column mt-4">
                        <Nav.Link as={Link} to="/adminplan"> Add Plans</Nav.Link>
                        <Nav.Link as={Link} to="/users">Users</Nav.Link>
                        <Nav.Link as={Link} to="/plandetails">Plans</Nav.Link>
                    </Nav>
                    <Dropdown className="mt-auto dropup">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            {admin.firstName||"Admin"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => { navigate('/login'); }}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar>
                <div className="toggle-icon" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={isMinimized ? faChevronRight : faChevronLeft} />
                </div>
            </div>
        </div>
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
        </>
    )
}

export default UserDetailsforadmin