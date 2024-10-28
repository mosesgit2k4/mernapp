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
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [amount, setAmount] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [activePage, setActivePage] = useState("subscription");
    const [payToSubscribe, setPayToSubscribe] = useState(false);

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
            if (data.message === "Transaction not found") {
                setIsSubscribed(false);
            } else {
                setIsSubscribed(true);
                setTransactionDetails(data);
            }
        });

        fetch('api/usermanagement/myprofile', {
            method: "GET",
            headers: { "Authorization": `Bearer ${jwtToken}` }
        })
        .then(response => response.json())
        .then(data => setUser(data));

        fetch('/api/usermanagement/plans', {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => setPlans(data));

        fetch('api/usermanagement/latestplan', {
            method: "GET",
            headers: { "Authorization": `Bearer ${jwtToken}` }
        })
        .then(response => response.json())
        .then(data => setSubscribedDetails(data.plan));

    }, []);

    function handlePayment() {
        const planid = selectedPlan._id.toString();
        const userid = user?._id.toString();
        const transactionDetails = {
            userid,
            planid,
            amount,
        };

        fetch('api/usermanagement/transaction', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transactionDetails)
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                setPaymentStatus('Payment Successful!');
                setIsSubscribed(true);
                setShowPopup(true);
                // Refetch subscription details to display in the subscription column
                const cookies = new Cookies();
                const jwtToken = cookies.get("token_authenication");

                fetch('api/usermanagement/latestplan', {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${jwtToken}` }
                })
                .then(response => response.json())
                .then(planData => {
                    setSubscribedDetails(planData.plan);
                    setActivePage("subscription"); // Switch to subscription page
                });

            } else {
                setPaymentStatus('Payment Failed. Try again.');
                setShowPopup(true);
            }

            setTimeout(() => setShowPopup(false), 3000);
        })
        .catch(() => {
            setPaymentStatus('Payment Failed. Please check your connection.');
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
        });
    }

    function handleUnsubscription() {
        const deleteTrans = { id: transactionDetails._id };

        fetch('api/usermanagement/transactiondelete', {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(deleteTrans)
        })
        .then(response => response.json())
        .then(() => setIsSubscribed(false));
    }

    function subscriptionToPlan(plan) {
        //get the plan  and set the plan id in selectedPlan
        fetch('api/usermanagement/getplanidforselectedplan',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(plan)
        })
        .then(response=>response.json())
        .then(data=>setSelectedPlan(data))
        setPayToSubscribe(true);
        setActivePage("payment");
    }

    return (
        <div className="admin-page">
            <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
                <Navbar bg="dark" variant="dark" expand="lg" className="flex-column sidebar-navbar">
                    <Navbar.Brand>User</Navbar.Brand>
                    <Nav className="flex-column mt-4">
                        <Nav.Link onClick={() => setActivePage("subscription")}>Subscription</Nav.Link>
                        <Nav.Link onClick={() => setActivePage("plans")}>Plans</Nav.Link>
                    </Nav>
                    <Dropdown className="mt-auto dropup">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            {user.firstName || "User"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => navigate('/login')}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar>
                <div className="toggle-icon" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={isMinimized ? faChevronRight : faChevronLeft} />
                </div>
            </div>

            <div className={`content ${isMinimized ? 'full-width' : ''}`}>
                {activePage === "plans" && (
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
                {activePage === "subscription" && (
                    <div>
                        {isSubscribed ? (
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
                )}

                {activePage === "payment" && payToSubscribe && selectedPlan && (
                    <div className="transaction-page">
                        <div className="plan-details">
                            <h2>Transaction for {selectedPlan.name}</h2>
                            <img src={selectedPlan.image} width={100} height={100} alt={selectedPlan.name} />
                            <p>Description: {selectedPlan.description}</p>
                        </div>
                        <div className="payment-details">
                            <h3>Payment Details</h3>
                            <form>
                                <div>
                                    <label htmlFor="cardNumber">Card Number:</label>
                                    <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" />
                                </div>
                                <div>
                                    <label htmlFor="expiryDate">Expiry Date:</label>
                                    <input type="text" id="expiryDate" placeholder="MM/YY" />
                                </div>
                                <div>
                                    <label htmlFor="cvv">CVV:</label>
                                    <input type="text" id="cvv" placeholder="123" />
                                </div>
                                <div>
                                    <label htmlFor="amount">Amount:</label>
                                    <input type="text" id="amount" placeholder="Enter an amount" value={amount} onChange={e => setAmount(e.target.value)} />
                                </div>
                                <div className="buttonforpay">
                                    <button type="button" onClick={handlePayment} className="btn btn-primary">Pay Now</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showPopup && (
                    <div className="popup">
                        <p className={`payment-status ${paymentStatus === 'Payment Successful!' ? 'success' : 'failed'}`}>{paymentStatus}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default User;
