import React, { useState } from 'react'; 
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from "../Authentication/AuthContext"; 
import { PostAPI } from "../api";

function Login() {
    const { setUser } = useAuth(); // Get setUser from AuthContext
    const [formData, setFormData] = useState({ userId: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // In your Login component
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await PostAPI("loginDB", formData);
  
      if (response.data.status === "success") {
        const userData = response.data.user;
        const token = response.data.token; // Assuming your API returns a token
  
        // Store token and user data
        localStorage.setItem('token', token);
        setUser(userData);
  
        await Swal.fire({
          title: `Welcome, ${userData.username}!`,
          icon: "success",
          timer: 2000,
          confirmButtonText: "OK",
        });
  
        navigate("/dashboard");
      } else {
        await Swal.fire({
          title: "Login failed!",
          text: response.data.message || "Invalid credentials. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      await Swal.fire({
        title: "Error!",
        text: "An error occurred while trying to log in. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };
  
    return (
        <div className="bg-[linear-gradient(to_bottom,#7392b7,#d8e1e9)] flex items-center justify-center min-h-screen px-4">
            <div className="relative px-20 py-10 rounded-3xl shadow-md" style={{ width: '530px', height: '565px' }}>
                <div className="absolute inset-0 rounded-3xl" style={{ backgroundColor: '#5882C1', opacity: 0.5, zIndex: 0 }}></div>
    
                <div className="relative z-10">
                    <img src="naysa_logo.png" alt="Logo" className="w-200 h-20 mb-3" />
                    
                    <h2 className="text-white m-1" style={{ fontFamily: 'SF Pro Rounded, sans-serif' }}>
                        NAYSA Databridge
                    </h2>
                    <h2 className="text-4xl font-bold mb-5 text-white" style={{ fontFamily: 'SF Pro Rounded, sans-serif' }}>
                        Welcome Back!
                    </h2>
    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="userId" className="block text-base font-normal text-gray-700">
                                User ID
                            </label>
                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                value={formData.userId}  
                                onChange={handleChange}
                                placeholder="input userId"
                                required
                                className="mt-1 p-2 w-[380px] h-[45px] border-[1px] rounded-[12px]"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-base font-normal text-gray-700">
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
                                className="mt-1 p-2 w-[380px] h-[45px] border-[1px] rounded-[12px]"
                            />
                        </div>
                        <div className="text-right mt-2 mb-4">
                            <Link to="/forgot-password" className="text-sm text-white hover:underline">Forgot Password?</Link>
                        </div>
                        <button type="submit" className="w-full bg-[#162e3a] text-base text-white p-3 rounded-lg" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className="text-center mt-5 flex justify-center items-center">
                            <span className="text-sm text-gray-300">Don't have an account?&nbsp;</span>
                            <span className="text-sm text-white hover:underline cursor-pointer" onClick={() => navigate('/register')}>
                                Sign up
                            </span>
                        </div>
    
                        <span className="text-white text-xs flex items-center justify-center mt-2 mb-2">
                            © 2025 ALL RIGHTS RESERVED
                        </span>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
