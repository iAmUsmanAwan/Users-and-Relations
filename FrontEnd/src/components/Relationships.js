import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Relationships = () => {
    const [users, setUsers] = useState([]);
    const [relationships, setRelationships] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // For selecting user2

    useEffect(() => {
        fetchUsers();
        fetchRelationships();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users/');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchRelationships = async () => {
        try {
            const response = await axios.get('http://localhost:8000/relationships/');
            setRelationships(response.data);
        } catch (error) {
            console.error("Error fetching relationships:", error);
        }
    };

    const handleRelationship = async (user1Id, user2Id, relationshipType) => {
        // Check if the relationship already exists
        const existingRelationship = relationships.find(
            (relationship) =>
                (relationship.user1 === user1Id && relationship.user2 === user2Id) ||
                (relationship.user1 === user2Id && relationship.user2 === user1Id)
        );

        if (existingRelationship) {
            alert('This relationship already exists!');
            return;
        }

        const payload = {
            user1: user1Id,
            user2: user2Id,
            relationship_type: relationshipType,
        };

        try {
            await axios.post('http://localhost:8000/relationships/', payload);
            fetchRelationships(); // Refresh relationships after successful POST
        } catch (error) {
            console.error("Error creating relationship:", error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                        <select
                            onChange={(e) => setSelectedUser(e.target.value)}
                            value={selectedUser || ''}
                        >
                            <option value="" disabled>
                                Select user
                            </option>
                            {users
                                .filter((u) => u.id !== user.id) // Exclude current user
                                .map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                        </select>
                        <button
                            onClick={() =>
                                handleRelationship(user.id, parseInt(selectedUser), 'friend')
                            }
                            disabled={!selectedUser} // Disable if no user is selected
                        >
                            Add Relationship
                        </button>
                        <ul>
                            {relationships
                                .filter(
                                    (relationship) =>
                                        relationship.user1 === user.id ||
                                        relationship.user2 === user.id
                                )
                                .map((relationship) => (
                                    <li key={relationship.id}>
                                        Relationship with{' '}
                                        {relationship.user1 === user.id
                                            ? users.find((u) => u.id === relationship.user2)?.name
                                            : users.find((u) => u.id === relationship.user1)?.name}
                                        : {relationship.relationship_type}
                                    </li>
                                ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Relationships;
