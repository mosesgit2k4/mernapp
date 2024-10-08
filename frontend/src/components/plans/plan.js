import React, { useState } from "react";

function Adminplan() {
    const [name, setname] = useState('')
    const [image, setimage] = useState('')
    const [description, setdescription] = useState('')
    const [start, setstart] = useState('')
    const [end, setend] = useState('')
    const [filebase64, setfilebase64] = useState('')
    function handleaddingofplan(e) {
        const formdata = new FormData();
        formdata.append('image', image);
        let plandetails = {
            name: name,
            image: filebase64,
            description: description,
            start: start,
            end: end
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
            fetch('api/usermanagement/plans', {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(plandetails)
            }).then(response => {
                return response.json()
            }).then(data => {
                console.log(data)
            })
        } catch (error) {

        }


    }
    return (
        <div>
            <form onSubmit={handleaddingofplan}>
                <div>
                    <label htmlFor="name">Plan Name:</label>
                    <input value={name} id="name" type="text" placeholder="Enter a name for the plan../" onChange={e => setname(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="image">Image</label>
                    <input type="file" id="image" onChange={e => setimage(e.target.files[0])} />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <input value={description} id="description" type="text" onChange={e => setdescription(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="startdate">Start Date</label>
                    <input value={start} type="date" id="startdate" onChange={e => setstart(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="enddate">End Date</label>
                    <input type="date" id="enddate" value={end} onChange={e => setend(e.target.value)} />
                </div>
                <div>
                    <button type="submit">Add</button>
                </div>
            </form>
            <p></p>
        </div>
    )
}


export default Adminplan