// MyUploads.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MyUploads.css'

const MyUploads = ({ refreshUploads }) => {
    const [myEquipment, setMyEquipment] = useState([]);
    const token = localStorage.getItem('token');
    useEffect(() => {
        // Fetch user's uploaded equipment
        const fetchMyEquipment = async () => {
          
            const response = await axios.get('http://localhost:5000/api/rentalSystem/my-uploads', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyEquipment(response.data);
            console.log("Equipment Data: ", myEquipment);
        };

        fetchMyEquipment();
    }, [refreshUploads]);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/rentalSystem/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyEquipment(myEquipment.filter(item => item._id !== id));
            alert('Equipment deleted successfully');
        } catch (error) {
            alert('Failed to delete equipment');
        }
    };

    return (
        <div className='your-uploads-wrapper'>
            <h2>Your Uploads</h2>
            <div className="my-uploads-list">
                {myEquipment.map((item) => (
                    <div key={item._id} className="equipment-upload-card">
                        <img src={`http://localhost:5000/${item.imagePath}`} alt={item.name} className="upload-card-image" />
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p>Price: ${item.price} / {item.rateType}</p>
                        <p>Condition: {item.condition}</p>
                        <button onClick={() => handleDelete(item._id)}>Remove from Rent</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyUploads;
