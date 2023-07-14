import { Link } from "react-router-dom"

const HomePage = () => {
    return(
        <div className="home">
            <Link to={'/login'}>Login</Link>
            <Link to={'/signup'}>Signup</Link>
        </div>
    )
}

export default HomePage;