import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './forgetpassword.css'
function ForgetPassword() {
    const navigator = useNavigate()
    const [email, setEmail] = useState('')
    const [data,setData] = useState('')
    function handleSubmit(e) {
        let emaildetails = {
            email: email
        }
        e.preventDefault()
        fetch('api/usermanagement/forgetpassword', {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emaildetails)
        }).then(response => {
            if (!response.ok) {
                setData("*Give a correct Email")
            }
            else{
                navigator('/resetpassword')
            }
            return response.json()
        }).then(data => console.log(data))
    }
    return (
        <div className="box-container">   
            <div className="container">
                <div className="row">
                   <div className= "col-12">
                        <div className="box-forgetpassword">
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="email" className="emaillabeldesign">Email ID</label>
                                <input className="input-design" type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                                <div>
                                    <button type="submit" className="otp-button">Send OTP</button>
                                </div>
                                <p className="error-Message" onChange = {e=>setData(e.target.value)}>{data}</p>
                            </form>
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    )

}
export default ForgetPassword