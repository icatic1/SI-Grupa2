import { Container, Navbar, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';




function NavigationHeader() {


    return (
        <>

            <Navbar className="fluid navbar navbar-expand-lg navbar-light bg-light mx-auto">
                <Container className="mx-auto">
                    <ListGroup className="navbar-nav mr-auto">
                        <ListGroup.Item><Link to={'/Home'} className="nav-link"> Home </Link></ListGroup.Item>
                        <ListGroup.Item><Link to={'/AddUser'} className="nav-link"> Add user </Link></ListGroup.Item>
                        <ListGroup.Item><Link to={'/'} className="nav-link">Users</Link></ListGroup.Item>
                        <ListGroup.Item><Link to={'/'} className="nav-link">Logout</Link></ListGroup.Item>
                    </ListGroup>

                </Container >
            </Navbar >

        </>
    )
}

export default NavigationHeader