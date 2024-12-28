// components/UserForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserForm = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', phone_number: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/users/');
            setUsers(response.data);
        } catch (err) {
            setError('Error fetching users:'); 
            console.error(err);
        } finally{
            setLoading(false);
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone_number) {
            alert('All fields are required!');
            return;
        }
        try {
            await axios.post('http://localhost:8000/api/users/', formData);
            setFormData({ name: '', email: '', phone_number: '' }); // Reset form after submission
            fetchUsers(); // Refresh user list
        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                
                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                
                <input name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
                
                <button type="submit">Submit</button>
            </form>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>{user.name} - {user.email}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserForm;
