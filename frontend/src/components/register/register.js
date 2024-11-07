import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './register.css';

function Register() {
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [mobilephone, setMobilePhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isadmin, setAdmin] = useState(false);
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [addresses, setAddresses] = useState('');
    const [zipcode, setZipCode] = useState('');
    const [type, setType] = useState('');
    const [filebase64, setFileBase64] = useState('');
    const [loading, setLoading] = useState(false);

    const encodeFileBase64 = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setFileBase64(reader.result);
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        encodeFileBase64(file);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        const users = {
            firstName: firstname,
            lastName: lastname,
            email:email,
            phonenumber: mobilephone,
            username:username,
            password:password,
            image: filebase64,
            isadmin:isadmin,
            country:country,
            city:city,
            addresses:addresses,
            state:state,
            zipcode:zipcode,
            type:type
        };

        fetch('api/usermanagement/register', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(users)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    setError(data.message);
                } else {
                    navigate('/login');
                }
            })
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    };

    return (
        <div className="box-container-for-register">
            <h1>REGISTER HERE</h1>
            <div className="box-register">
                <form onSubmit={handleRegister}>
                    <div className="name-design">
                        <label htmlFor="image" className="name">Profile Picture</label>
                        <input className="image-design" id="image" type="file" onChange={handleImageChange} />
                    </div>
                    {filebase64 && <img src={filebase64} width={100} height={100} alt="Avatar" />}

                    <div className="name-design">
                        <label htmlFor="firstname" className="name">First Name</label>
                        <input className="input-design" type="text" id="firstname" value={firstname} onChange={e => setFirstname(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="lastname" className="name">Last Name</label>
                        <input className="input-design" type="text" id="lastname" value={lastname} onChange={e => setLastname(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="email" className="name">Email</label>
                        <input className="input-design" type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="username" className="name">Username</label>
                        <input className="input-design" type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="mobilephone" className="name">Mobilephone</label>
                        <input className="input-design" type="number" id="mobilephone" value={mobilephone} onChange={e => setMobilePhone(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="password" className="name">Password</label>
                        <input className="input-design" type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
                    </div>
                    <div className="name-design">
                        <label htmlFor="state" className="name">State</label>
                        <input className="input-design" type="text" id="state" value={state} onChange={e => setState(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="country" className="name">Country</label>
                        <input className="input-design" type="text" id="country" value={country} onChange={e => setCountry(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="city" className="name">City</label>
                        <input className="input-design" type="text" id="city" value={city} onChange={e => setCity(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="Address" className="name">Address</label>
                        <input className="input-design" type="text" id="Address" value={addresses} onChange={e => setAddresses(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="Type" className="name">Type</label>
                        <input className="input-design" type="text" id="Type" value={type} onChange={e => setType(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="zipcode" className="name">ZipCode</label>
                        <input className="input-design" type="number" id="zipcode" value={zipcode} onChange={e => setZipCode(e.target.value)} />
                    </div>
                    <div className="name-design">
                        <label htmlFor="isadmin" className="name">Job Role</label>
                        <select name="isadmin" id="isadmin" value={isadmin} onChange={e => setAdmin(e.target.value)}>
                            <option value="Select">Select</option>
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                        </select>
                    </div>
                    <div>
                        <button type="submit" className="register-button" disabled={loading}>
                            {loading ? 'Registering...' : 'REGISTER NOW'}
                        </button>
                    </div>
                    <div>
                        <Link to="/login">Already have an account? Login here</Link>
                    </div>
                    {error && <p className="error-Message">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default Register;
