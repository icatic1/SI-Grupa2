import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from 'react-bootstrap'

const Live = () => {
    const [imgSrc, setImgSrc] = useState("https://www.macmillandictionary.com/external/slideshow/full/148259_full.jpg");
    const { mac } = useParams()
    const { id } = useParams()
    const { num } = useParams()

    useEffect(() => {


        /* setInterval(() => {
             getImage().then(image => {
                 setImgSrc("data:image/png;base64, " + image);
             });
         }, 32)*/

    }, []);





    async function getImage() {
        const response1 = await fetch('/api/FileUpload/GetLiveFile', {
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
                <h1 style={{ color: "#035296", paddingLeft: "40px", marginBottom: "0", fontSize: "xx-large" }}>{id}</h1>
                <h2 style={{ color: "#035296", paddingLeft: "50px", marginBottom: "0", fontSize: "x-large" }}>Camera {num}</h2>
            </div>

            < img src={imgSrc} style={{ width: "100%", height: "100%", margin: "0", maxHeight: "500px", maxWidth: "960px", borderTopRightRadius: "10px", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px" }} />

        </Container>


    )
}

export default Live