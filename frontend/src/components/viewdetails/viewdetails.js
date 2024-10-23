import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Cookies from "universal-cookie";
function ViewDetails(){
    const navigate = useNavigate();
    const [admin,setadmin] = useState('')
    const [isMinimized, setIsMinimized] = useState(false);
    const [users,setuser] = useState([])
    const [transactionisfound,settransactionisfound] = useState(false)
    useEffect(()=>{
        const cookie = new Cookies()
        const jwtToken = cookie.get('token_authenication')
        fetch('api/usermanagement/myprofile',{method:"GET",headers:{ "Authorization":`Bearer ${jwtToken}`}})
        .then(response=> response.json())
        .then(data=>{console.log(data)
        setadmin(data)})
        fetch('api/usermanagement/transactionhistory',{method:"GET",headers:{"Content-Type":"application/json"}}).then(response=>response.json()).then(data=>{console.log(data)
            settransactionisfound(true)
            setuser(data)})
    },[])
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
                        <Nav.Link as={Link} to="/users">User</Nav.Link>
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