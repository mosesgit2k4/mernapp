
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './resetpassword.css'
function ResetPassword() {
    const navigator = useNavigate()
    const [otp, setotp] = useState('')
    const [error,seterror] = useState('')
    const [count,setcount] = useState(0)
    useEffect(() => {
        if(count ===3){
            navigator('/forgetpassword')
        }
    })
    function handleSubmit(e) {
        let otpdetails = {
            otp: otp
        }
        e.preventDefault()
        fetch('api/usermanagement/resetpassword', {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(otpdetails)
        }).then(response => {
            return response.json()}
        ).then(data=>{
            if(data.message === "Thank you for the OTP"){
                console.log("Thank you for the OTP")
                navigator('/confirmpassword')
            }
            else{
                seterror("Give a correct OTP")
            }
        })
            
    }
    return (
        <div className="box-container">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="box">
                            <form onSubmit={handleSubmit}>
                                <label className="emaillabeldesign" htmlFor="otp">OTP</label>
                                <input type="text" id='otp' name='otp' value={otp} onChange={e => setotp(e.target.value)} />
                                <div>
                                    <button type="submit" className="submit-button" onClick={()=>setcount(count+1)}>Submit</button>
                                </div>
                                <p className="error-Message" onChange={e=>seterror(e.target.value)}>{error}</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ResetPassword