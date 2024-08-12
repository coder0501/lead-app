import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import './Login.css';
// import { loadReCaptcha, ReCaptcha } from 'recaptcha-v3';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();
  const navigate = useNavigate();

//   useEffect(() => {
//     loadReCaptcha('your-site-key'); // Replace 'your-site-key' with your actual site key
//   }, []);

//   useEffect(() => {
//     const handleCaptcha = async () => {
//       if (!executeRecaptcha) {
//         console.error('Execute recaptcha not yet available');
//         return;
//       }
//       const token = await executeRecaptcha('login');
//       setCaptchaToken(token);
//     };
    
//     handleCaptcha();
//   }, [executeRecaptcha]);

//   const handleCaptchaVerify = async () => {
//     try {
//       const token = await executeRecaptcha('login');
//       setCaptchaToken(token);
//       // Perform further actions, e.g., submit form
//     } catch (error) {
//       console.error('Execute recaptcha not yet available', error);
//     }
//   };

axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const captchaToken = await executeRecaptcha('login');
    // if (!captchaToken) {
    //   alert('Please complete the CAPTCHA');
    //   return;
    // }
    console.log(password);
    try {
      const res = await axios.post('https://lead-app-rhu2.vercel.app/users/login', {
        username,
        password,
        // captcha: captchaToken,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/leads');
    } catch (err) {
      console.error(err);
    }
  };

  return (

    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className='btn'>Login</button>
      {/* <div>
      <button onClick={handleCaptchaVerify}>Verify Captcha</button>
      <ReCaptcha
        sitekey="your-site-key" // Replace 'your-site-key' with your actual site key
        action="login"
        verifyCallback={setCaptchaToken}
      />
    </div> */}
    <p><Link to="/forgot-password">Forgot Password?</Link></p>

    </form>
    
  );
};

export default Login;
