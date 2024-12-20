import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'universal-cookie';
import { io } from 'socket.io-client';
import './admin.css';


const socket = io('http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket', 'polling']
});

function Admin() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState('');
    const [activePage, setActivePage] = useState('admindetails');
    const [isMinimized, setIsMinimized] = useState(false);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [plans, setPlans] = useState([]);
    const [amount, setAmount] = useState('');
    const [notification, setNotification] = useState([]);
    const [viewuser, setviewusers] = useState('')
    const [transactionisfound, settransactionisfound] = useState(false)

    function encodeFileBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    async function handleAddingOfPlan(e) {
        e.preventDefault();
        if (!image) {
            setError("Please provide an image.");
            return;
        }

        try {
            const base64Image = await encodeFileBase64(image);
            let planDetails = {
                name,
                image: base64Image,
                description,
                start,
                end,
                amount
            };

            fetch('/api/usermanagement/plans', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(planDetails)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === "Give an image") {
                        setError("Please provide a valid image.");
                    } else {
                        setName('');
                        setImage('');
                        setDescription('');
                        setStart('');
                        setEnd('');
                        setAmount('');
                        setError('Plan Added Successfully');
                        setActivePage('admindetails');
                    }
                });
        } catch (error) {
            console.error('Error encoding file:', error);
            setError("Failed to add plan.");
        }
    }

    useEffect(() => {
        socket.on('userLoggedin', (data) => {
            const newNotification = `User ${data.username} (ID: ${data.userId}) has logged in.`;
            setNotification((prevNotifications) => [newNotification, ...prevNotifications]);
        });

        const cookie = new Cookies();
        const jwtToken = cookie.get('token_authenication');
        fetch('/api/usermanagement/myprofile', {
            method: 'GET',
            headers: { Authorization: `Bearer ${jwtToken}` }
        })
            .then(response => response.json())
            .then(data => setAdmin(data));
        fetch('/api/usermanagement/notifications', {
            method: "GET",
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                setNotification(data)
            })
        fetch('/api/usermanagement/users', {
            method: "GET"
        }).then(response => response.json())
            .then(data => setUsers(data));

        fetch('/api/usermanagement/plans', {
            method: "GET",
        }).then(response => response.json())
            .then(data => setPlans(data));

        return () => {
            socket.off('userLoggedin');
        };
    }, []);

    function toggleSidebar() {
        setIsMinimized(!isMinimized);
    }
    function handleview(user) {
        let userdetails = {
            userid: user._id
        }
        fetch('api/usermanagement/transactionhistory', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(userdetails) }).then(response => response.json()).then(data => {
            if (data.message === "Transaction not found") {
                settransactionisfound(false)
            }
            else {
                setviewusers(data)
                settransactionisfound(true)
            }
        })
        setActivePage('viewdetails')
    }

    return (
        <div className="admin-page">
            <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
                <Navbar bg="dark" variant="dark" expand="lg" className="flex-column sidebar-navbar">
                    <Navbar.Brand>Admin</Navbar.Brand>
                    <Nav className="flex-column mt-4">
                        <Nav.Link onClick={() => setActivePage('Addplans')}>Add Plans</Nav.Link>
                        <Nav.Link onClick={() => setActivePage("userdetails")}>Users</Nav.Link>
                        <Nav.Link onClick={() => setActivePage('plandetails')}>Plans</Nav.Link>
                        <Nav.Link onClick={() => setActivePage('notification')}>Notification</Nav.Link>
                    </Nav>
                    <Dropdown className="mt-auto dropup">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            {admin.firstName || "Admin"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => { navigate('/login'); }}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar>
                <div className="toggle-icon" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={isMinimized ? faChevronRight : faChevronLeft} />
                </div>
            </div>

            <div className={`content ${isMinimized ? 'full-width' : ''} paddingforaddplan`}>
                {activePage === 'Addplans' && (
                    <div>
                        <form onSubmit={handleAddingOfPlan} className="adminplan-form">
                            <h1>Add a New Plan</h1>
                            <div className="form-group">
                                <label htmlFor="name">Plan Name:</label>
                                <input
                                    value={name}
                                    id="name"
                                    type="text"
                                    placeholder="Enter a name for the plan.."
                                    onChange={e => setName(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Plan Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={e => setImage(e.target.files[0])}
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    value={description}
                                    id="description"
                                    rows="5"
                                    placeholder="Enter a description for the plan.."
                                    onChange={e => setDescription(e.target.value)}>
                                </textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="startdate">Start Date</label>
                                <input
                                    value={start}
                                    type="date"
                                    id="startdate"
                                    onChange={e => setStart(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="enddate">End Date</label>
                                <input
                                    type="date"
                                    id="enddate"
                                    value={end}
                                    onChange={e => setEnd(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="amount">Amount:</label>
                                <input
                                    value={amount}
                                    id="amount"
                                    type="number"
                                    onChange={e => setAmount(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <button type="submit" className="submit-btn">Add Plan</button>
                        </form>
                        {error && <p className="error-message">{error}</p>}
                    </div>
                )}

                {activePage === 'userdetails' && (
                    <div className="container">
                        <h1>Users</h1>
                        <div className="plans-grid">
                            {users.map(user => (
                                <div key={user.id} className="card">
                                    <div className="content">
                                        <div className="title">{user.firstName}</div>
                                        <div className="title">{user.lastName}</div>
                                        <div className="title">{user.email}</div>
                                        <div className="price">
                                            <img src={user.image} width={150} height={100} alt={user.name} />
                                        </div>
                                    </div>
                                    <div className="mt-5 ml-3">
                                        <button onClick={() => handleview(user)} className="btn btn-primary">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activePage === 'plandetails' && (
                    <div className="container">
                        <h1>Plans</h1>
                        <div className="plans-grid">
                            {plans.map(plan => (
                                <div key={plan.id} className="card">
                                    <div className="content">
                                        <div className="title">{plan.name}</div>
                                        <div className="price">
                                            <img src={plan.image} width={100} height={100} alt={plan.name} />
                                        </div>
                                        <div className="description">{plan.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activePage === 'admindetails' && (
                    <div>
                        <h2>Admin Dashboard</h2>
                    </div>
                )}
                {activePage === 'viewdetails' && (
                    <>
                        {transactionisfound ? (
                            <div className="container">
                                <h1>Transaction </h1>
                                {viewuser.map(user => (
                                    <div className="cardfortransactionhistory">
                                        <div className="alignmentsinsidecard" >
                                            <div>
                                                <h1>{user.name}</h1>
                                            </div>
                                            <div>
                                                <p>{user.description}</p>
                                            </div>
                                            <div>
                                                {user.paid ? <div className="cancelledoractive">
                                                    <button className="btn btn-success successbtn">Paid</button>

                                                </div> : <div className="cancelledoractive">
                                                    <button className="btn btn-danger cancelbtn">Failed</button>
                                                </div>}
                                                <i className="bi bi-x-circle crossbutton"></i>
                                            </div>
                                        </div>

                                    </div>
                                ))
                                }
                            </div>) :
                            (<div>No Transaction for this User</div>)}
                    </>
                )}
                {activePage === 'notification' && (
                    <div>
                        <ul>
                            {notification.map((notif, index) => (
                                <li key={index}>
                                    {notif.message || notif}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;
