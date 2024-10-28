import React, { useEffect, useState } from "react";
import './plan.css'; 
import {useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Adminplan() {
      const navigator = useNavigate()
    const [name, setname] = useState('');
    const [image, setimage] = useState('');
    const [description, setdescription] = useState('');
    const [start, setstart] = useState('');
    const [end, setend] = useState('');
    const [error, seterror] = useState('');
    const [admin,setadmin] = useState('')
    function encodeFileBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    async function handleaddingofplan(e) {
        e.preventDefault();

        if (!image) {
            seterror("Please provide an image.");
            return;
        }

        try {
            const base64Image = await encodeFileBase64(image);
            let plandetails = {
                name: name,
                image: base64Image,
                description: description,
                start: start,
                end: end
            };

            fetch('api/usermanagement/plans', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(plandetails)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === "Give an image") {
                        seterror("Please provide a valid image.");
                    } else {
                        navigator('/admin')
                        seterror("Plan added successfully!");
                    }
                    console.log(data);
                });
        } catch (error) {
            console.error('Error encoding file:', error);
            seterror("Failed to add plan.");
        }
    }
    
    useEffect(()=>{
        const cookie = new Cookies()
        const jwtToken = cookie.get('token_authenication')
        fetch('api/usermanagement/myprofile',{method:"GET",headers:{ "Authorization":`Bearer ${jwtToken}`}})
        .then(response=> response.json())
        .then(data=>{console.log(data)
    setadmin(data)})
    },[])


    return (
        <>
        <div>
            {error && <p className="error-message">{error}</p>}
            <div className="adminplan-container">
                <form onSubmit={handleaddingofplan} className="adminplan-form">
                    <h1>Add a New Plan</h1>
                    <div className="form-group">
                        <label htmlFor="name">Plan Name:</label>
                        <input 
                            value={name}
                            id="name"
                            type="text"
                            placeholder="Enter a name for the plan.." 
                            onChange={e => setname(e.target.value)} 
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Plan Image</label>
                        <input 
                            type="file"
                            id="image" 
                            onChange={e => setimage(e.target.files[0])} 
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
                            onChange={e => setdescription(e.target.value)}>
                        </textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="startdate">Start Date</label>
                        <input 
                            value={start}
                            type="date"
                            id="startdate"
                            onChange={e => setstart(e.target.value)} 
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="enddate">End Date</label>
                        <input 
                            type="date" 
                            id="enddate"
                            value={end}
                            onChange={e => setend(e.target.value)} 
                            className="form-input"
                        />
                    </div>
                    <div>
                        <button type="submit" className="submit-btn">Add Plan</button>
                    </div>
                </form>
            </div>
            
        </div>
        </>
    );
}

export default Adminplan;
