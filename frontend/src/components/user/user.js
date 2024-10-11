import React, {useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './user.css';

function User() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("userDetails"))
    const [isMinimized, setIsMinimized] = useState(false);
    const [subcribed,setsubcribed] = useState(false)
    const plan = JSON.parse(localStorage.getItem('subscribed'))
    function toggleSidebar() {
        setIsMinimized(!isMinimized);
    }
    useEffect(()=>{
        if(plan === true){
            setsubcribed(true)
        }
        else{
            setsubcribed(false)
        }
    },[plan])

    return (
        <div className="admin-page">
            <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
                <Navbar bg="dark" variant="dark" expand="lg" className="flex-column sidebar-navbar">
                    <Navbar.Brand>User</Navbar.Brand>
                    <Nav className="flex-column mt-4">
                    {subcribed?<Nav.Link as={Link} to="/plan">Plan</Nav.Link>:null}
                    {!subcribed?<Nav.Link as={Link} to="/subscribed">Subscription</Nav.Link>:null}
                        
                    </Nav>
                    <Dropdown className="mt-auto dropup">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            {user.firstName||"User"}
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
    );
}

export default User;
