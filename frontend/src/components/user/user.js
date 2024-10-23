import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './user.css';

function User() {
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false); 
    const [plansSet, setPlansSet] = useState(false);
    const [subscriptionSet, setSubscriptionSet] = useState(false);
    const [plans, setPlans] = useState([]);

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
            if(data.message === "No Transaction found") {
                setIsSubscribed(false);
            } else {
                setIsSubscribed(true);
            }
        });

        fetch('api/usermanagement/myprofile', {
            method: "GET",
            headers: { "Authorization": `Bearer ${jwtToken}` }
        })
        .then(response => response.json())
        .then(data => {
            setUser(data);
        });

        fetch('/api/usermanagement/plans', {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => setPlans(data));
        
    }, []);

    function subscriptionToPlan(plan) {
        fetch('api/usermanagement/plantobeselected', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(plan)
        })
        .then(response => response.json())
        .then(data => console.log(data));
        navigate("/subscription");
    }

    return (
        <div className="admin-page">
            <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
                <Navbar bg="dark" variant="dark" expand="lg" className="flex-column sidebar-navbar">
                    <Navbar.Brand>User</Navbar.Brand>
                    <Nav className="flex-column mt-4">
                        {isSubscribed ? (
                            <Nav.Link onClick={() => { 
                                setSubscriptionSet(true);
                                setPlansSet(false);
                            }}>
                                Subscription
                            </Nav.Link>
                        ) : (
                            <Nav.Link onClick={() => { 
                                setPlansSet(true);
                                setSubscriptionSet(false);
                            }}>
                                Plan
                            </Nav.Link>
                        )}
                    </Nav>
                    <Dropdown className="mt-auto dropup">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            {user.firstName || "User"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => navigate('/login')}>
                                Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar>
                <div className="toggle-icon" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={isMinimized ? faChevronRight : faChevronLeft} />
                </div>
            </div>
            <div className={`content ${isMinimized ? 'full-width' : ''}`}>
                {plansSet && (
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
                                    <button className="button type1" onClick={() => subscriptionToPlan(plan)}>
                                        Select Plan
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {subscriptionSet && <div>Subscription Details</div>}
            </div>
        </div>
    );
}

export default User;
