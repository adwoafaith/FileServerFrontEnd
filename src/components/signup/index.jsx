import React, {useState} from 'react'
import './styles.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const SignupPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    //50053c

    const emailMatch = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const passwordMatch =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const handleSignUp = async (e) => {
        e.preventDefault();
        return !email.match(emailMatch) ? alert("please provide a valid email"):
        !password.match(passwordMatch) ? alert("please use a mininum of one uppercase,lowercase,number and a symbol"):
    
        axios.post(`${process.env.REACT_APP_BASE_URL}/user/verify`, {email})
        .then((response)=>{
            if (response.status===200){
                localStorage.setItem('data',JSON.stringify({email,password,token:response.data.token}))
                alert(response.data.message)
                 navigate('/verify')
            }
        })
            //const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/signup`, {email, password})
        .catch((error)=>{
             alert(error.response.data.message)
             console.log(error)
        })
    }
    
    return(
        <form className='signup-form'>
            <h1 style={{textAlign: 'center'}}>SignUp</h1>
            <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} autoComplete={"off"}/>
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={"off"}/>
            <button role='submit' className='signup-btn' onClick={handleSignUp}>Register</button>
            <span>Already have an account? <Link to={'/login'}>Login</Link></span>
        </form>
    )
}

export default SignupPage;