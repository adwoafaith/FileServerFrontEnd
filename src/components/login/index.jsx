import React, { useState } from 'react'
import './styles.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [emailForgot, setForgotEmail] = useState('')
    const [forgotScreen, setForgotScreen] = useState(false)

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
             axios.post(`${process.env.REACT_APP_BASE_URL}/user/login`, { email, password })
            .then((response)=>{

                alert(response.data.message)
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('role', response.data.role)
    
                if (localStorage.getItem('role') === 'admin') navigate('/dashboard')
                if (localStorage.getItem('role') === 'user') navigate('/user')
                
            })
            .catch ((error)=>{
                 alert(error.response.data.message)
                 console.log(error)
            })
    }

    const handleForgot = () => {
        axios.post(`${process.env.REACT_APP_BASE_URL}/user/forgotPassword`, { email: emailForgot })
            .then((res) => alert(res.data.message))
            .catch(() => alert('Could not send email, try again'))
    }

    return (
        <>
            <form className='login-form'>
                <h1 style={{ textAlign: 'center' }}>Login</h1>
                <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}  />
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className='login-btn' onClick={handleLogin}>Login</button>
                <span>Don't have an account? <Link to={'/signup'}>Signup</Link></span>
                <span onClick={() => setForgotScreen(!forgotScreen)}>Forgot password</span>

            </form>
            {
                forgotScreen &&
                <div className="fullscreen-overlay">
                    <span onClick={() => setForgotScreen(!forgotScreen)} className='close'>X</span>
                    <div className='share-window' style={{ flexDirection: 'column' }}>
                        <h2>Forgot Password</h2>
                        <input type="email" placeholder="Enter email address" value={emailForgot} onChange={(e) => setForgotEmail(e.target.value)} />
                        <button className='shareBtn' style={{ width: 'fit-content' }} onClick={handleForgot} >Send reset link    </button>
                    </div>
                </div>
            }
        </>
    )
}

export default LoginPage;