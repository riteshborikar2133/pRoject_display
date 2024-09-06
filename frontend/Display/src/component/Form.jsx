import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Form.css'


export default function Form() {


    const [selectedImage, setSelectedImage] = useState(null);
    const [base64Image, setBase64Image] = useState('');
    const [deleteId, setDeleteId] = useState();

    const [opt, setOpt] = useState('img');
    const [message, setMessage] = useState([]);


    const [data, setData] = useState({
        title: "",
        message: "",
        type: ""
    })


    const fetchData = async () => {
        const res = axios.get('http://127.0.0.1:5000/api/circulars')
            .then((e) => {
                console.log(e.data)
                setMessage(e.data)
            })
    }


    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (file) {
            if (file.size > 1024 * 1024) {
                alert('File size exceeds 1MB. Please upload a smaller file.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64Image(reader.result);
                setData({ ...data, message: reader.result, type: "img" });
            };
            reader.readAsDataURL(file);

            setSelectedImage(URL.createObjectURL(file));

        }
    };



    const submitData = async () => {
        const res = await axios.post('http://127.0.0.1:5000/api/circulars', data)
            .then(e => {
                console.log(e)
            })
    }

    const handlSubmit = async (e) => {
        e.preventDefault();
        submitData();
        fetchData();
        console.log(data)
    }

    const handleChange = async (e) => {
        e.preventDefault();

    }



    const handleImageSubmit = async (e) => {
        e.preventDefault();
        if (base64Image) {
            console.log('Base64 Image String:', base64Image);
            console.log(data)
            submitData();
            // You can now send this Base64 string to your backend or perform other actions.
        } else {
            alert('Please upload an image first.');
        }
    };



    const handleDelete = async (id) => {
        const userResponse = window.confirm('Are you sure you want to delete this user?');
        if (!!userResponse) {
            const res = await fetch(`http://127.0.0.1:5000/api/circulars/${id}`, {
                method: 'DELETE',
            });
            // await getUsers();
            console.log(res);
        }
    }



    useEffect(() => {
        fetchData();
    }, [])


    return (
        <div className='container'>
            <select name="" id="" onChange={(e) => { setOpt(e.target.value) }}>
                <option value="img">Image</option>
                <option value="text">Text</option>
            </select>
            <div>
                {
                    opt === "text" &&
                    <div> <div className="from">
                        <form onSubmit={handlSubmit}>
                            <label htmlFor="title">Title: </label>
                            <input type="text" id='title' onChange={(e) => { setData({ ...data, title: e.target.value }) }} />
                            <br /> <br />
                            <label htmlFor="message">Context: </label>
                            <textarea type="text" id='message' onChange={(e) => { setData({ ...data, message: e.target.value, type: "text" }) }} />
                            <br /> <br />
                            <button type='submit'>Submit</button>
                        </form>
                    </div></div>
                }{
                    opt == "img" &&
                    <div>
                        <form onSubmit={handleImageSubmit}>
                            <div>
                                <br /> <br />
                                <label htmlFor="title">Title: </label>
                                <input type="text" id='title' onChange={(e) => { setData({ ...data, title: e.target.value }) }} />
                                <br /> <br />
                                <label>Upload Image (Max 1MB):</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} />
                            </div>

                            {selectedImage && (
                                <div>
                                    <h3>Preview:</h3>
                                    <img src={selectedImage} alt="Selected" style={{ width: '300px', marginTop: '10px' }} />
                                </div>
                            )}

                            <button type="submit" style={{ marginTop: '10px' }}>Convert to Base64</button>
                        </form>
                    </div >
                }
            </div>
            <div>
                {
                    message.map((item) => {
                        return (
                            <div className="messages">
                                {
                                    item.type == "text" && <div key={item._id}><h2>{item.title}</h2>
                                        <p>{item.message}</p>
                                        <button type="submit" style={{ marginTop: '10px', backgroundColor: 'Red' }}>Delete</button>
                                    </div>
                                }{
                                    item.type == "img" && <div key={item._id}><h2>{item.title}</h2>

                                        <img src={item.message} /> <br />
                                        {/* <h2>{item._id}</h2> */}
                                        <button type="submit" style={{ marginTop: '10px', backgroundColor: 'Red' }} onClick={() => { handleDelete(item._id) }}>Delete</button>
                                    </div>
                                }
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}
