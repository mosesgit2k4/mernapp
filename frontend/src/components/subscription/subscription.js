import React from "react";
import './subscription.css'
import { useNavigate } from "react-router-dom";
function Subscription() {
    const navigator = useNavigate()
    const user = JSON.parse(localStorage.getItem('userDetails'))
    const plan = JSON.parse(localStorage.getItem("plan"));
    if(!plan){
        return <p>No Plan Details available</p>
    }
    function handlePayment(){
        const planid = plan._id.toString()
        const userid = user._id.toString()
        let transactiondetails = {
            userid:userid,
            planid:planid,
            amount:500
        }
        console.log('Payment processing...');
        fetch('api/usermanagement/transaction',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(transactiondetails)
        }).then(response =>{return response.json()}).then(data=>{console.log(data)})
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