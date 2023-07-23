import React, { useEffect, useState } from 'react'
import './styles.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const VerifyCode = () => {

    const navigate = useNavigate()

    const [otp, setOtp] = useState('')
    const [data, setData] = useState({})

    useEffect(()=>{
        setData(JSON.parse(localStorage.getItem('data')))
        console.log(data)
    },[])

    const handleVerification = (e) => {
        e.preventDefault()
        console.log(data.token)

        const userData =  {email:data.email,password:data.password,otp,  }
            axios.post(`${process.env.REACT_APP_BASE_URL}/user/signup`,userData, {
                headers: {
                'Authorization': `Bearer ${data.token}`,
                'Accept': 'application/json'
            }
            })
            .then(res => {
                alert(res.data.message)
                navigate('/login')
            })
            .catch((err) => (console.log(err)))
        
    }

    return (
        <form className='verificaton-form'>
            <h3>Account Verification </h3>
            <input required type='text' placeholder='Enter verification code' value={otp} onChange={(e) => setOtp(e.target.value)} />          
            <button className="shareBtn" style={{ width: '100%' }} onClick={handleVerification}>Verify</button>
        </form>
    )
}

export default VerifyCode;