import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Container, Segment, Form, Button } from "react-bootstrap";



function ChangePass() {
    const { passtoken } = useParams()

    useEffect(async () => {
        

        var formBody = [];
        var encodedKey = encodeURIComponent("emailToken");
        var encodedValue = encodeURIComponent(passtoken);
        formBody.push(encodedKey + "=" + encodedValue);
        //formBody = formBody.join("&");
        

        const response = await fetch('/api/user/getpasstoken?' + formBody, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        })



        const data = await response.json() //ovo bi trebao biti vraceni objekat

        //Sad ovdje provjeris da li je vracen user, ako jeste onda pozoves setUser(taj user iz data),
        //ako nije, onda mozes setUnauthorized(true)
        
        setUser(data)


    }, [])

    const [user, setUser] = useState(null)
    const [password, setPassword] = useState()
    const [unauthorized, setUnauthorized] = useState(false)
    const navigate = useNavigate()

    async function submitPassword() {
       
        let newPassword = password //ovo moze i pametnije, ali ne da mi se sad
        if (newPassword.length === 0)
            return //mozda da ispises poruku kako se mora unijeti password, logicno ne moze biti prazno polje
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

            

            //e sad smo valjda promijenili password, mozes redirekciju uraditi na pocetnu stranicu, koja
            //bi trebala biti login
            navigate('/')
        }
    }

    return (
        <>
            {user === null ? <div></div> :
                <Container className="mx-auto">
                    <Form >
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control readOnly required type="email" value={user.email} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>



                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control required type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>



                        <Button variant="primary" type="submit" onClick={submitPassword} >
                            Submit
                        </Button>

                    </Form>
                </Container>}
            {unauthorized === true ? <div>Sorry, this page doesn't exist...</div> : <></>}
        </>

    )

}



export default ChangePass;