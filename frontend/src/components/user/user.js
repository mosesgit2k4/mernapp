import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './user.css';

function User() {
    const navigate = useNavigate();
    const [user,setuser] = useState('')
    const [isMinimized, setIsMinimized] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false); 

    function toggleSidebar() {
        setIsMinimized(!isMinimized);
    }

    useEffect(() => {
        const cookies = new Cookies();
        const jwtToken = cookies.get("token_authenication");

        fetch('api/usermanagement/transaction', {
            method: "GET",
            headers: { "Authorization": `Bearer ${jwtToken}` }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if(data.message === "No Transaction found"){
                    setIsSubscribed(false)
                }
                else{
                    setIsSubscribed(true)
                }
            });

            fetch('api/usermanagement/myprofile',{method:"GET",headers: { "Authorization": `Bearer ${jwtToken}` }})
            .then(response => response.json())
            .then(data => {
                setuser(data)
            });
        
    }, []);

    return (
        <div className="admin-page">
            <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
                <Navbar bg="dark" variant="dark" expand="lg" className="flex-column sidebar-navbar">
                    <Navbar.Brand>User</Navbar.Brand>
                    <Nav className="flex-column mt-4">
                        {isSubscribed ? (
                            <Nav.Link as={Link} to="/subscribed">Subscription</Nav.Link>
                        ) : (
                            <Nav.Link as={Link} to="/plan">Plan</Nav.Link>
                        )}
                    </Nav>
                    <Dropdown className="mt-auto dropup">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            {user.firstName || "User"}
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
