import React, { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import './profile.css';
import { Link, useNavigate } from "react-router-dom";

function ProfilePage() {
    const inputRef = useRef(null);
    const navigator = useNavigate();
    const [user, setuser] = useState('');
    const [tempuser, settempuser] = useState('');
    const [changed, setchanged] = useState(false);
    const [updatedmessage, setupdatedmessage] = useState('');
    const [count, setcount] = useState(false);
    const [click, setclick] = useState(false);
    const [filebase641, setfilebase64] = useState('');
    const [image2, setimage] = useState('');

    function getapi(jwtToken) {
        fetch('api/usermanagement/myprofile', {
            method: "get",
            headers: { "Authorization": `Bearer ${jwtToken}` }
        })
            .then(response => response.json())
            .then(data => {
                setuser(data);
                settempuser(data);
            });
    }

    useEffect(() => {
        const cookies = new Cookies();
        const jwtToken = cookies.get("token_authenication");
        getapi(jwtToken);
    }, []);

    function handlelogout() {
        navigator('/login');
    }

    function handleImageClick() {
        inputRef.current.click();
    }

    function encodeFileBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    async function updateCustomer() {
        setclick(true);
        let userdetails = {
            newusername: tempuser.username,
            newfirstName: tempuser.firstName,
            newlastName: tempuser.lastName,
            newemail: tempuser.email,
            newmobilephone: tempuser.phonenumber,
            newimage: filebase641 || tempuser.image,
        };

        const cookies = new Cookies();
        const jwtToken = cookies.get("token_authenication");

        await fetch('api/usermanagement/myprofile', {
            method: "put",
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userdetails)
        })
            .then(response => response.json())
            .then(data => {
                setupdatedmessage(data);
                setclick(false);
                setcount(true);
                setchanged(false);
                getapi(jwtToken);
            });
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setimage(file);
            const base64 = await encodeFileBase64(file);
            setfilebase64(base64);
            setchanged(true);
            setcount(false);
            settempuser({ ...tempuser, image: base64 });
        }
    };

    return (
        <>
            {user ? (
                <div>
                    <div>
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item active">
                                        {user.isadmin === "Admin" ? (
                                            <Link to ="/admin"className="nav-link mr-5">Admin</Link>                            
                                        ) : (
                                            <Link to='/user' state = {{user}} className="nav-link mr-5">Home</Link>
                                        )}
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn btn-danger mr-3" onClick={handlelogout}>Log out</button>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                    <div className="homepage-container">
                        <div onClick={handleImageClick}>
                            {image2 ? (
                                <img src={URL.createObjectURL(image2)} alt="Avatar" width={100} height={100} className="profile-image" />
                            ) : (
                                <img src={user?.image} alt="Avatar" className="profile-image" width={100} height={100} />
                            )}
                            <input type="file" ref={inputRef} onChange={handleFileChange} style={{ display: "none" }} />
                        </div>
                        <div className="d-flex flex row justify-content-start">
                            <div className="homepage-input-first">
                                <label htmlFor="firstname">FirstName:</label>
                                <input id="firstname" className="ml-3" value={tempuser.firstName} onChange={e => {
                                    setchanged(true);
                                    setcount(false);
                                    settempuser({ ...tempuser, firstName: e.target.value });
                                }} />
                            </div>
                            <div className="homepage-input-last">
                                <label htmlFor="lastname">LastName:</label>
                                <input id="lastname" className="ml-3" value={tempuser.lastName} onChange={e => {
                                    setchanged(true);
                                    setcount(false);
                                    settempuser({ ...tempuser, lastName: e.target.value });
                                }} />
                            </div>
                        </div>
                        <div className="d-flex flex row justify-content-start">
                            <div className="homepage-input-first">
                                <label htmlFor="username">Username:</label>
                                <input id="username" className="ml-3" value={tempuser.username} onChange={e => {
                                    setchanged(true);
                                    setcount(false);
                                    settempuser({ ...tempuser, username: e.target.value });
                                }} />
                            </div>
                            <div className="homepage-input-last">
                                <label htmlFor="email">Email:</label>
                                <input id="email" className="ml-3" value={tempuser.email} onChange={e => {
                                    setchanged(true);
                                    setcount(false);
                                    settempuser({ ...tempuser, email: e.target.value });
                                }} />
                            </div>
                        </div>
                        <div className="d-flex flex row justify-content-start">
                            <div className="mt-5">
                                <label htmlFor="phonenumber">Phone number:</label>
                                <input id="phonenumber" value={tempuser.phonenumber} onChange={e => {
                                    setchanged(true);
                                    setcount(false);
                                    settempuser({ ...tempuser, phonenumber: e.target.value });
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {changed && (
                <div>
                    <button onClick={(e) => {
                        e.preventDefault();
                        settempuser(user);
                        setchanged(false);
                    }} className="btn btn-danger mt-4 mr-3">Cancel</button>

                    <button onClick={updateCustomer} className="btn btn-primary mt-4 ml-3">Save</button>
                </div>
            )}
            {count && (
                <div>
                    <p className="updated-Message mt-5">{updatedmessage.message}!</p>
                </div>
            )}
            {click && (
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            )}
        </>
    );
}

export default ProfilePage;
