import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './register.css'
function Register() {
    const navigator = useNavigate()
    const [firstname, setfirstname] = useState('')
    const [lastname, setlastname] = useState('')
    const [email, setemail] = useState('')
    const [username, setusername] = useState('')
    const [mobilephone, setmobilephone] = useState('')
    const [password, setpassword] = useState('')
    const [image, setimage] = useState('')
    const [error, seterror] = useState('')
    const [isadmin, setadmin] = useState(false)
    const [country, setcountry] = useState('')
    const [state, setstate] = useState('')
    const [city, setcity] = useState('')
    const [addresses, setaddresses] = useState('')
    const [zipcode, setzipcode] = useState('')
    const [type, settype] = useState('')
    const [filebase64, setfilebase64] = useState('')

    function handleregister(e) {
        const formdata = new FormData();
        formdata.append('image', image);
        let users = {
            firstName: firstname,
            lastName: lastname,
            email: email,
            phonenumber: mobilephone,
            username: username,
            password: password,
            image: filebase64,
            isadmin: isadmin,
            country: country,
            city: city,
            addresses: addresses,
            state: state,
            zipcode: zipcode,
            type: type
        }
        function encodeFileBase64(file) {
            var reader = new FileReader();
            if (file) {
                reader.readAsDataURL(file);
                reader.onload = () => {
                    var Base64 = reader.result;
                    console.log(Base64)
                    setfilebase64(Base64)
                };
                reader.onerror = function (error) {
                    console.log('error: ', error);
                };
            }
        }
        e.preventDefault()
        try {
            encodeFileBase64(image)
            fetch('api/usermanagement/register', {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(users)
            }).then(response => {
                if (response.ok) {
                    navigator('/login')
                }
                return response.json()
            }).then(data => {
                if (data.message === "User already exist") { seterror(data.message) }
                if (data.message === 'Email already exist') { seterror(data.message) }
                if (data.message === "Phone number already exist") { seterror(data.message) }
                if (data.message === "Give a proper Gender") { seterror(data.message) }
                if (data.message === "FirstName must not be empty") { seterror(data.message) }
                if (data.message === "There must be atleast 3 character") { seterror(data.message) }
                if (data.message === "FirstName is required") { seterror(data.message) }
                if (data.message === "LastName must not be empty") { seterror(data.message) }
                if (data.message === "Username must not be empty") { seterror(data.message) }
                if (data.message === "Email must not be empty") { seterror(data.message) }
                if (data.message === "Email must be like a email Id example:helloworld@gmail.com") { seterror(data.message) }
                if (data.message === "Email is required") { seterror(data.message) }
                if (data.message === "Username must be string") { seterror(data.message) }
                if (data.message === "Username is required") { seterror(data.message) }
                if (data.message === "Password must be string") { seterror(data.message) }
                if (data.message === "Password is required") { seterror(data.message) }
                if (data.message === "Minimum 8 character is needed and atleast 1 uppercase , 1 lowercase and 1 digit is required") { seterror(data.message) }
                if (data.message === "Mobile Number must be number") { seterror(data.message) }
                if (data.message === "Number must be 10 digit") { seterror(data.message) }
                if (data.message === "Mobile Number is required") { seterror(data.message) }
                if (data.message === "Please select a proper Gender from the option") { seterror(data.message) }
                if (data.message === "Please select the option") { seterror(data.message) }
                if (data.message === "Fill the Date of birth") { seterror(data.message) }
                console.log(data)
            }
            ).catch(error => {
                console.log(error)
            })
        } catch (error) {
            console.log('ERROR', error);

        }

    }
    return (
        <div className="box-container-for-register">
            <h1>REGISTER HERE</h1>
            <div className="box-register">
                <form onSubmit={handleregister}>
                    <div className="name-design">
                        <label htmlFor="image" className="name" >Profile Picture</label>
                        <input className="image-design" id="image" type="file" onChange={e => setimage(e.target.files[0])} />
                    </div>
                    <div>
                        <img src={filebase64} width={100} height={100} alt="Avatar" />
                    </div>
                    <div className="name-design">
                        <label htmlFor="firstname" className="name">First Name</label>
                        <input className="input-design" type='text' id="firstname" value={firstname} onChange={e => setfirstname(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="lastname" className="name">Last Name</label>
                        <input className="input-design" type='text' id="lastname" value={lastname} onChange={e => setlastname(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="email" className="name">Email</label>
                        <input className="input-design" type='email' id="email" value={email} onChange={e => setemail(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="username" className="name">Username</label>
                        <input className="input-design" type='text' id="username" value={username} onChange={e => setusername(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="mobilephone" className="name">Mobilephone</label>
                        <input className="input-design" type='number' id="mobilephone" value={mobilephone} onChange={e => setmobilephone(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="password" className="name">Password</label>
                        <input type='password' id="password" value={password} onChange={e => setpassword(e.target.value)} placeholder="password" />
                    </div>
                    <div className="name-design">
                        <label htmlFor="state" className="name">State</label>
                        <input className="input-design" type='text' id="state" value={state} onChange={e => setstate(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="country" className="name">Country</label>
                        <input className="input-design" type='text' id="country" value={country} onChange={e => setcountry(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="city" className="name">City</label>
                        <input className="input-design" type='text' id="city" value={city} onChange={e => setcity(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="Address" className="name">Address</label>
                        <input className="input-design" type='text' id="Address" value={addresses} onChange={e => setaddresses(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="Type" className="name">Type</label>
                        <input className="input-design" type='text' id="Type" value={type} onChange={e => settype(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="zipcode" className="name">ZipCode</label>
                        <input className="input-design" type='number' id="zipcode" value={zipcode} onChange={e => setzipcode(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="isadmin" className="name">Job Role </label>
                        <select name="isadmin" id="isadmin" value={isadmin} onChange={e => setadmin(e.target.value)}>
                            <option value="Select">Select</option>
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                        </select>
                    </div>
                    <div>
                        <button type="submit" className="register-button">REGISTER NOW</button>
                    </div>
                    <div>
                        <Link to="/login">Already have a account? Login here</Link>
                    </div>
                    <p className="error-Message" onChange={e => seterror(e.target.value)}>{error}</p>
                </form>
            </div>
        </div>
    )
}

export default Register