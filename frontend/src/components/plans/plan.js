import React, { useState } from "react";

function Adminplan() {
    const [name, setname] = useState('');
    const [image, setimage] = useState('');
    const [description, setdescription] = useState('');
    const [start, setstart] = useState('');
    const [end, setend] = useState('');
    const [error, seterror] = useState('');

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
            seterror("Give an image");
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
                        seterror("Give a proper image");
                    } else {
                        seterror("Plan Added Successfully");
                    }
                    console.log(data);
                });
        } catch (error) {
            console.error('Error encoding file:', error);
            seterror("Failed to add plan");
        }
    }

    return (
        <div>
            <form onSubmit={handleaddingofplan}>
                <div>
                    <label htmlFor="name">Plan Name:</label>
                    <input value={name} id="name" type="text" placeholder="Enter a name for the plan.." onChange={e => setname(e.target.value)} />
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
            <p>{error}</p>
        </div>
    );
}

export default Adminplan;
