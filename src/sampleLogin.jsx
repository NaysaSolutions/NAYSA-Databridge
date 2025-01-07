import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [formData, setFormData] = useState({
        company: '',
        name: '', 
        password: ''
    });
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);

        setLoading(true);  
        try {
            const response = await axios.post('http://localhost:8000/api/login', formData);
            alert('Login successful!');
            setResult(response.data.company); 
        } catch (error) {
            alert('Login failed. Please check your credentials.');
            console.error('Login failed: ', error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Email</label> 
                        <input 
                            type="text" 
                            id="email" 
                            name="email" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            className="mt-1 p-2 w-full border rounded" 
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder='at least 8 characters'
                            required 
                            className="mt-1 p-2 w-full border rounded" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white p-3 rounded" 
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
