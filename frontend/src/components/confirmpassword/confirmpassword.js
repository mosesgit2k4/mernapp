import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ConfirmPassword() {
    const navigator = useNavigate()
    const [newpassword, setnewpassword] = useState('')
    const [confirmpassword, setconfirmpassword] = useState('')
    const [error, seterror] = useState('')
    function handleSubmit(e) {
        let userpassword = {
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
            if (data.message === "Minimum 8 character is needed") { seterror("*Minimum 8 character is needed") }
            if (data.message === "Give a strong Password") { seterror("*Give a strong Password") }
            if (data.message === "Password does not match") { seterror("*Password does not match") }
            if (data.message === "Email not found") { seterror("*Email not found") }
            if (data.message === "U have entered the your old password") { seterror("U have entered the your old password") }
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