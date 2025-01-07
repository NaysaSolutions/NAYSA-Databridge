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
        <div className="bg-[linear-gradient(to_bottom,#A2BBF1,#D3A4DD)] flex items-center justify-center h-screen">
            <div
                className="relative px-20 py-10 rounded-3xl shadow-md"
                style={{ width: '500px', height: '500px', position: 'relative' }}
            >
                {/* Background Overlay */}
                <div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                        backgroundColor: '#5882C1',
                        opacity: 0.5,
                        zIndex: 0,
                    }}
                ></div>
    
                {/* Card Content */}
                <div className="relative z-10">
                    <img
                        src="public/naysa LOGO.png"
                        alt="Logo"
                        className="w-200 h-20 mb-3"
                    />
                    
                    <h2
                        className="text-white"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                        NAYSA Databridge
                    </h2>
                    <h2
                        className="text-2xl font-bold mb-8 text-white font-sfProRounded"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                        Welcome Back!
                    </h2>
    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="email@gmail.com"

                                className="mt-1 p-2 w-full border rounded"
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="at least 8 characters"
                                required
                                className="mt-1 p-2 w-full border rounded"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white p-3 rounded-lg"
                            disabled={loading}
                        >
                            {loading ? 'Sign in...' : 'Sign In'}
                        </button>
    
                        <span className="text-white flex items-center justify-center mt-5 mb-5">
                            © 2025 ALL RIGHTS RESERVED
                        </span>
                    </form>
                </div>
            </div>
        </div>
    );
    
}

export default Login;
