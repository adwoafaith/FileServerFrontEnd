import HomePage from "./components/HomePage";
import Dashboard from "./components/dashboard";
import LoginPage from "./components/login";
import SignupPage from "./components/signup";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import User from "./components/user";
import ResetPassword from "./components/resetPassword";
import VerifyCode from "./components/verification/verification";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/user" element={<User />} />
                <Route path="/resetPassword/:id" element={<ResetPassword />} />
                <Route path="/verify" element={<VerifyCode/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
