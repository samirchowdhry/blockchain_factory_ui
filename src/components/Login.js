// src/components/Login.js
import React, { useState } from 'react';
import axiosInstance from '../api/axios'; // Custom axios with interceptors
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Login = () => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const [loading,setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axiosInstance.post('', {
        username,
        password,
      });

      const { token } = response.data;

      
      localStorage.setItem('token', token);

        const userResponse = await axios.get('http://localhost:8081/auth/user/getUserByEmailUser', {
          withCredentials: true,
          params: { username }, // Sending request parameters
          headers: { 'Content-Type': 'application/json' , 'Authorization' : `${token}`},
         
        });

        // Store user info in local storage
        localStorage.setItem('userDataUser', JSON.stringify({

          'id' : userResponse.data.id,
          'username' : userResponse.data.username,
          'roles' :  userResponse.data.roles,
          'displayName' : userResponse.data.displayName,
        }));

       alert('Login successful! Redirecting to Dashboard...');
        
       if(userResponse.data.roles !== 'ROLE_Verifier'){
        navigate('/fileupload'); 
       }
       else{
        navigate('/verifyupload'); 
       }
    } catch (error) {
      setErrorMessage('Invalid email or password. Please try again.');
      console.error(error);
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={username} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
     
    </div>
  );
};

export default Login;
