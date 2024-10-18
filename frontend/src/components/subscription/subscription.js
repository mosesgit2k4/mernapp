import React, { useEffect, useState } from "react";
import './subscription.css'
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Subscription() {
    const navigator = useNavigate();
    const [user, setUser] = useState('');
    const [plan, setPlan] = useState('');
    const [amount, setAmount] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState(null); 
    const [showPopup, setShowPopup] = useState(false); 

    useEffect(() => {
        const cookie = new Cookies();
        const jwtToken = cookie.get('token_authenication');
        
        fetch('api/usermanagement/myprofile', { method: "GET", headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => response.json())
            .then(data => setUser(data));
        
        fetch('api/usermanagement/planselected', { method: "GET", headers: { "Content-Type": "application/json" } })
            .then(response => response.json())
            .then(data => setPlan(data));
    }, []);
    
    if (!plan) {
        return <p>No Plan Details available</p>;
    }

    function handlePayment() {
        const planid = plan._id.toString();
        const userid = user._id.toString();
        
        let transactiondetails = {
            userid: userid,
            planid: planid,
            amount: amount
        };
        
        console.log('Payment processing...');
        
        fetch('api/usermanagement/transaction', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transactiondetails)
        })
        .then(response => {
            if (response.ok) {
                setPaymentStatus('Payment Successful!');  
            } else {
                setPaymentStatus('Payment Failed. Try again.');  
            }
            setShowPopup(true); 
            setTimeout(() => {
                setShowPopup(false); 
                if (response.ok) {
                    navigator('/user'); 
                }
            }, 3000); 
            return response.json()})
        .catch(error => {
            setPaymentStatus('Payment Failed. Please check your connection.');
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); 
        });
    }

    return (
        <>
        <div className="transaction-page">
            <div className="plan-details">
                <h2>Transaction for {plan.name}</h2>
                <img src={plan.image} width={200} height={200} alt={plan.name} />
                <p>Description: {plan.description}</p>
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
        {showPopup && (
                <div className="popup">
                    <p className={`payment-status ${paymentStatus === 'Payment Successful!' ? 'success' : 'failed'}`}>{paymentStatus}</p>
                </div>
            )}
        </>
    );
}

export default Subscription;
