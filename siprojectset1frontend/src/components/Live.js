import React, { useState, useEffect, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Container } from 'react-bootstrap'

const Live = () => {
    const [imgSrc, setImgSrc] = useState("https://www.macmillandictionary.com/external/slideshow/full/148259_full.jpg");
    const { mac } = useParams()
    const { id } = useParams()
    const { num } = useParams()


    useEffect(() => {

        if (startLive()) {
            const interval = setInterval(() => {
                getImage().then(image => {
                    if (image != null && image) setImgSrc("data:image/png;base64, " + image);
                });
            }, 100)
            return () => {
                console.log(interval)
                clearInterval(interval)
                endLive()
            }
        }


    }, []);

    async function startLive() {
        var res = await fetch('/api/FileUpload/ChangeStreamState/' + mac + '/1')

        if (res.ok) {
            console.log("Start live")
            console.log("Buffering...")
            setTimeout(() => { return true }, 30000);
        }
        return false
    }

    async function endLive() {

        await fetch('/api/FileUpload/ChangeStreamState/' + mac + '/0')
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
        <Container style={{ background: "rgba(0, 22, 56, 0.69)", padding: "5%", borderRadius: "20px", marginBottom: "20px" }}>

            <div style={{ background: "white", width: "35%", marginBottom: "0", borderTopLeftRadius: "30px", borderTopRightRadius: "30px", padding: "5px" }}>
                <h1 style={{ color: "#035296", paddingLeft: "40px", marginBottom: "0", fontSize: "150%" }}>{id}</h1>
                <h2 style={{ color: "#035296", paddingLeft: "50px", marginBottom: "0", fontSize: "130%" }}>Camera {num}</h2>
            </div>
            < img src={imgSrc} style={{ width: "100%", height: "100%", margin: "0", maxHeight: "500px", maxWidth: "960px", borderTopRightRadius: "10px", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px" }} />

        </Container>


    )
}

export default Live