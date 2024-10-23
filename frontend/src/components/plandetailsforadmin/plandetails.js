import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Cookies from "universal-cookie";
function Plandetails(){
    const [plans, setPlans] = useState([]);
    const [admin,setadmin] = useState('')
    const [isMinimized, setIsMinimized] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        fetch('/api/usermanagement/plans', {
            method: "GET",
        }).then(response => response.json())
          .then(data => setPlans(data));
          const cookie = new Cookies()
        const jwtToken = cookie.get('token_authenication')
        fetch('api/usermanagement/myprofile',{method:"GET",headers:{ "Authorization":`Bearer ${jwtToken}`}})
        .then(response=> response.json())
        .then(data=>{console.log(data)
    setadmin(data)})
    }, []);
    function toggleSidebar() {
        setIsMinimized(!isMinimized);
    }
    return(
      <>
        <div className="admin-page">
      <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
          <Navbar bg="dark" variant="dark" expand="lg" className="flex-column sidebar-navbar">
              <Navbar.Brand>Admin</Navbar.Brand>
              <Nav className="flex-column mt-4">
                  <Nav.Link as={Link} to="/adminplan"> Add Plans</Nav.Link>
                  <Nav.Link as={Link} to="/users">User</Nav.Link>
                  <Nav.Link as={Link} to="/plandetails">Plans</Nav.Link>
              </Nav>
              <Dropdown className="mt-auto dropup">
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      {admin.firstName||"Admin"}
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
        </div> 
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
    </> 
    )
}

export default Plandetails