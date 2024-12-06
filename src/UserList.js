import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser, createUser, updateUser } from './api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userDob, setUserDob] = useState('');
    const [userPassword, setUserPassword] = useState('');

    useEffect(() => {
        fetchUsers()
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));
    }, []);

    const resetForm = () => {
        setUserName('');
        setUserEmail('');
        setUserDob('');
        setUserPassword('');
        setCurrentUser(null);
    };

    const handleAddButtonClick = () => {
        resetForm();
        setShowAddModal(true);
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setUserName(user.name);
        setUserEmail(user.email);
        setUserDob(user.dob);
        setUserPassword('');
        setShowEditModal(true);
    };

    const handleDelete = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUser(userId)
                .then(() => {
                    setUsers(users.filter(user => user.id !== userId));
                })
                .catch(error => console.error(error));
        }
    };

    const handlecreateUser = () => {
        const newUser = {
            name: userName,
            email: userEmail,
            dob: userDob,
            password: userPassword,
        };

        createUser(newUser)
            .then(response => {
                setUsers([...users, response.data]);
                setShowAddModal(false);
                resetForm();
            })
            .catch(error => console.error(error));
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        const updatedUser = {
            name: userName,
            email: userEmail,
            dob: userDob,
            password: userPassword ? userPassword : currentUser.password, 
        };

        updateUser(currentUser.id, updatedUser)
            .then(() => {
                setUsers(users.map(user =>
                    user.id === currentUser.id ? { ...user, ...updatedUser } : user
                ));
                setShowEditModal(false);
                resetForm();
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">User List</h1>
                <button
                    onClick={handleAddButtonClick}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                    Add User
                </button>
            </div>
            <div className="overflow-auto max-h-[500px] border border-gray-300 rounded-lg">
                <table className="w-full border-collapse bg-white">
                    <thead>
                        <tr className="bg-gray-200 text-left text-gray-800 sticky top-0">
                            <th className="px-4 py-2 border-b text-center">ID</th>
                            <th className="px-4 py-2 border-b text-center">Name</th>
                            <th className="px-4 py-2 border-b text-center">Email</th>
                            <th className="px-4 py-2 border-b text-center">DOB</th>
                            <th className="px-4 py-2 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { users.length > 0 ? (
                            users.map((user,index) => (
                                <tr key={user.id} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 border-b text-center">{index + 1}</td>
                                    <td className="px-4 py-2 border-b text-center">{user.name}</td>
                                    <td className="px-4 py-2 border-b text-center">{user.email}</td>
                                    <td className="px-4 py-2 border-b text-center">{user.dob}</td>
                                    <td className="px-4 py-2 border-b text-center">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                                        No data found
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New User</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handlecreateUser(); }}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dob"
                                    value={userDob}
                                    onChange={(e) => setUserDob(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={userPassword}
                                    onChange={(e) => setUserPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)} // Close the modal
                                    className="text-gray-500 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
                                >
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit User</h2>
                        <form onSubmit={handleSubmitEdit}>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dob"
                                    value={userDob}
                                    onChange={(e) => setUserDob(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)} // Close the modal
                                    className="text-gray-500 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
