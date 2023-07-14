import React, { useState } from 'react'
import './styles.css'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const ResetPassword = () => {

    const params = useParams()

    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleReset = (e) => {
        e.preventDefault()

        if(password.length === 0 || confirmPassword.length === 0) return alert('Please enter a password')
        if(password === confirmPassword) {
            axios.patch(`${process.env.REACT_APP_BASE_URL}/user/resetPassword/${params.id}`, { password })
            .then(res => alert(res.data.message))
            .catch(() => alert('Something went wrong'))
        }
    }

    return (
        <form className='reset-form'>
            <h3>Reset Password</h3>
            <input required type={showPassword ? 'text' : 'password'} placeholder='Enter new password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</span>
            <input required type={showPassword ? 'text' : 'password'} placeholder='Confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

            <button className="shareBtn" style={{ width: '100%' }} onClick={handleReset}>Reset Password</button>
        </form>
    )
}

export default ResetPassword