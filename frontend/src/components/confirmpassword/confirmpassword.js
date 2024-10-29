import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ConfirmPassword() {
    const navigator = useNavigate()
    const [newpassword, setnewpassword] = useState('')
    const [confirmpassword, setconfirmpassword] = useState('')
    const [error, seterror] = useState('')
    const location = useLocation()
    const email = location.state?.email
    function handleSubmit(e) {
        let userpassword = {
            email:email,
            newpassword: newpassword,
            confirmpassword: confirmpassword
        }
        e.preventDefault()
        fetch('api/usermanagement/confirmpassword', {
            method: 'put',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(userpassword)
        }).then(response => {
            if (response.ok) {
                navigator("/login")
            }
            return response.json()
        }).then(data => {
            if (data.message === "Password must be at least 8 characters long.") { seterror("*Password must be at least 8 characters long.") }
            if (data.message === "Password must contain at least one uppercase letter, one lowercase letter, and one number") { seterror("*Give a strong Password") }
            if (data.message === "New password and confirm password does not match.") { seterror("*Password does not match") }
            if (data.message === "Email not found") { seterror("*Email not found") }
            if (data.message === "You have entered your old password. Please use a different password.") { seterror("You have entered your old password. Please use a different password.") }
            console.log(data)
        }
        )

    }
    return (
        <div className="box-container">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="box">
                            <form onSubmit={handleSubmit}>
                                <div className="content">
                                    <label htmlFor="newpassword">NEW PASSWORD </label>
                                    <input className="input-design" type="password" value={newpassword} id="newpassword" name="newpassword" onChange={e => setnewpassword(e.target.value)} />
                                </div>
                                <div className="content">
                                    <label htmlFor="confirmpassword">CONFIRM PASSWORD </label>
                                    <input className="input-design" type="password" value={confirmpassword} id="confirmpassword" name="confirmpassword" onChange={e => setconfirmpassword(e.target.value)} />
                                </div>
                                <button className="submit-button" type="submit">Submit</button>
                                <p className="error-Message" onChange={e => seterror(e.target.value)}>{error}</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

}
export default ConfirmPassword