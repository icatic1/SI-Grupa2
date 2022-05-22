import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Container, ButtonGroup, Button } from 'react-bootstrap'

const Live = () => {
    const [imgSrc, setImgSrc] = useState("https://i.postimg.cc/fW8xkr3p/start-stream.png");
    const [action, setAction] = useState("Start")
    const { mac } = useParams()
    const { id } = useParams()
    const { num } = useParams()
    const interval = useRef()


    useEffect(() => {

        
        return () => {
            
                clearInterval(interval.current)
                endLive()
            
        }
        
    }, []);

    function clickBtn() {
        if (action == "Start") {
            setAction("End")

            if (startLive())
                interval.current = setInterval(() => {
                    getImage().then(image => {
                        if (image != null && image) setImgSrc("data:image/png;base64, " + image);
                    });
                }, 100)
        } else {
            setAction("Start")
            console.log(interval.current)
            clearInterval(interval.current)
            endLive()
        }
    }

    async function startLive() {
        var res = await fetch('/api/FileUpload/ChangeStreamState/' + mac + '/1/' + num)

        if (res.ok) {
            console.log("Start live")
            console.log("Buffering...")
            //connecting
            setImgSrc('https://i.postimg.cc/c4527hz5/connecting.png')
            setTimeout(() => { return true }, 30000);
        }
        return false
    }

    async function endLive() {

        await fetch('/api/FileUpload/ChangeStreamState/' + mac + '/0/' + num)
        setImgSrc('https://i.postimg.cc/fW8xkr3p/start-stream.png')
        console.log("End live")

    }


    async function getImage() {
        const response1 = await fetch('/api/FileUpload/GetLiveFile/' + mac, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
            }
        });

        if (!response1.ok) return null

        const resp = await response1;
        const result = resp.text();

        return result;
    }

    return (
    
        <Container style={{ background: "rgba(24, 36, 67, 0.56)", padding: "10%", borderRadius: "20px", marginBottom: "20px" }}>

                <div style={{ background: "white", width: "35%", marginBottom: "0", borderTopLeftRadius: "30px", borderTopRightRadius: "30px", padding: "5px" }}>
                    <h1 style={{ color: "#035296", paddingLeft: "40px", marginBottom: "0", fontSize: "150%" }}>{id}</h1>
                    <h2 style={{ color: "#035296", paddingLeft: "50px", marginBottom: "0", fontSize: "130%" }}>Camera {num}</h2>
                </div>
                < img src={imgSrc} style={{ width: "100%", height: "100%", margin: "0", maxHeight: "500px", maxWidth: "960px", borderTopRightRadius: "10px", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px" }} />
                <ButtonGroup style={{ float: 'right', marginRight:"1%", marginTop: '10px' }}>
                    <Button className="btn-danger btn-bg" onClick={clickBtn}>{action} stream</Button>
                </ButtonGroup>
            </Container>


    )
}

export default Live