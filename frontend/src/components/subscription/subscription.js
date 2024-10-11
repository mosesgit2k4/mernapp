import React from "react";
import './subscription.css'
import { useNavigate } from "react-router-dom";
function Subscription() {
    const navigator = useNavigate()
    const plan = JSON.parse(localStorage.getItem("plan"));
    if(!plan){
        return <p>No Plan Details available</p>
    }
    function handlePayment(){
        console.log('Payment processing...');
        navigator('/user')
    }
    return (

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
                    <div className="buttonforpay">
                        <button type="button" onClick={handlePayment}>Pay Now</button>
                    </div>
                </form>
            </div>
        </div>
    
    )
}

export default Subscription