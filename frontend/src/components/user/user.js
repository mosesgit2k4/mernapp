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
    const [subscribedDetails, setSubscribedDetails] = useState('');
    const [transactionDetails, setTransactionDetails] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [plansSet, setPlansSet] = useState(false);
    const [plans, setPlans] = useState([]);

    function toggleSidebar() {
        setIsMinimized(!isMinimized);
    }

    useEffect(() => {
        const cookies = new Cookies();
        const jwtToken = cookies.get("token_authenication");

        // Check subscription status
        fetch('api/usermanagement/transaction', {
            method: "GET",
            headers: { "Authorization": `Bearer ${jwtToken}` }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "No Transaction found") {
                setIsSubscribed(false); // No subscription
            } else {
                setIsSubscribed(true);  // Subscription exists
                setTransactionDetails(data);
            }
        });

        // Fetch user profile
        fetch('api/usermanagement/myprofile', {
            method: "GET",
            headers: { "Authorization": `Bearer ${jwtToken}` }
        })
        .then(response => response.json())
        .then(data => {
            setUser(data);
        });

        // Fetch available plans
        fetch('/api/usermanagement/plans', {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => setPlans(data));

        // Fetch latest subscribed plan
        fetch('api/usermanagement/latestplan', {
            method: "GET",
            headers: { "Authorization": `Bearer ${jwtToken}` }
        })
        .then(response => response.json())
        .then(data => setSubscribedDetails(data.plan));
        
    }, []);

    function handleUnsubscription() {
        let deleteTrans = {
            id: transactionDetails._id
        };
        fetch('api/usermanagement/transactiondelete', {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(deleteTrans)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setIsSubscribed(false); // After deletion, no subscription
        });
    }

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
                                setPlansSet(false); 
                            }}>
                                Subscription
                            </Nav.Link>
                        ) : (
                            <Nav.Link onClick={() => { 
                                setPlansSet(true);
                            }}>
                                Plans
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
                {plansSet ? (
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
                ) : isSubscribed ? (
                    <div>
                        <h1>Current Subscription</h1>
                        <p>{subscribedDetails.name}</p>
                        <button onClick={handleUnsubscription}>Unsubscribe</button>
                    </div>
                ) : (
                    <div>
                        <h1>No Plans Subscribed</h1>
                        <p>You currently have no active subscription.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default User;
