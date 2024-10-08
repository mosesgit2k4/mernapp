import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import Cookies from 'universal-cookie';

function Login() {
    const cookies = new Cookies();
    const navigator = useNavigate();
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [error, seterror] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        let userdetails = {
            username: username,
            password: password
        };

        fetch('/api/usermanagement/login', {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userdetails)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Invalid Username") {
                    seterror("Invalid Username");
                    return;
                }
                if (data.message === "Invalid Password") {
                    seterror("Invalid Password");
                    return;
                }
                if (data.jwtToken) {
                    cookies.set('token_authenication', data.jwtToken, {
                        expires: new Date(Date.now() + 86400 * 1000)
                    });
                    navigator('/profile');
                }
            })
            .catch(err => {
                console.error('Login error:', err);
                seterror('Server Error. Please try again later.');
            });
    }

    return (
        <div className='box-container' >
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <h1>Login Page</h1>
                        <div className='box'>
                            <form onSubmit={handleSubmit}>
                                <div className='content'>
                                    <label htmlFor='username' className='username-design'>Username</label>
                                    <input className="input-design" id="username" name="username" type="text" value={username} onChange={e => setusername(e.target.value)} placeholder='username' />
                                </div>
                                <div className='content'>
                                    <label htmlFor='password' className='username-design'>Password</label>
                                    <input className="input-design" id="password" name="password" type="password" value={password} onChange={e => setpassword(e.target.value)} placeholder='password' />
                                </div>
                                <div>
                                    <button type="submit" className='login-button'>Login</button>
                                </div>
                                <div className='forgetpassword'>
                                    <Link to="/forgetpassword" >ForgetPassword?</Link>
                                </div>
                                <div>
                                    <Link to="/register">Don't have an account? Register Here</Link>
                                </div>
                                {error && <p className="error-Message">{error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
