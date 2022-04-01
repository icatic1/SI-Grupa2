import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Container, Segment, Form, Button } from "react-bootstrap";

import NotFound from './NotFound'


function ChangePass() {
    const { passtoken } = useParams()

    useEffect(async () => {


        var formBody = [];
        var encodedKey = encodeURIComponent("emailToken");
        var encodedValue = encodeURIComponent(passtoken);
        formBody.push(encodedKey + "=" + encodedValue);
        


        const response = await fetch('/api/user/getpasstoken?' + formBody, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        })



        const data = await response.json() 

        if (data.id === undefined)
            setUnauthorized(true)
        else
            setUser(data)


    }, [])

    const [user, setUser] = useState(null)
    const [password, setPassword] = useState()
    const [unauthorized, setUnauthorized] = useState(false)
    const navigate = useNavigate()

    async function submitPassword(e) {
        e.preventDefault()
        let newPassword = password 
        if (newPassword.length === 0)
            return 
        else {

            var formBody = [];
            var encodedKey = encodeURIComponent("email");
            var encodedValue = encodeURIComponent(user.email);
            formBody.push(encodedKey + "=" + encodedValue);
            encodedKey = encodeURIComponent("password");
            encodedValue = encodeURIComponent(newPassword);
            formBody.push(encodedKey + "=" + encodedValue);
            formBody = formBody.join("&");
            console.log(formBody)

            const response = await fetch('/api/user/ChangeUserPassword?' + formBody, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
            })

            
           navigate('/')
        }
    }

    return (
        <>
            {user === null ? <div></div> :
                <Container className="mx-auto" style={{ margin:"15px" }}>
                    <Form >
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control style={{ width: "50%" }} readOnly required type="email" value={user.email} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>



                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control style={{ width: "50%" }} required type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>



                        <Button variant="primary" type="submit" onClick={submitPassword} >
                            Submit
                        </Button>

                    </Form>
                </Container>}
            {unauthorized === true ? <NotFound/> : <></>}
        </>

    )

}



export default ChangePass;