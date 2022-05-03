import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';


function Home() {
    return (
        <div>
            <h1 style={{ textAlign: "center", marginTop: "15%", fontSize: "60px", color: "#09104a", marginBottom:"40px" }}>Welcome to SnapShot!</h1>
            <Button className="btn-lg" style={{ textAlign: "center", marginLeft: "40%", width: "20%" }}><Link to="/Devices" style={{color:"white", textDecoration:"none"}}>My devices</Link></Button>
        </div>
    )
}
export default Home