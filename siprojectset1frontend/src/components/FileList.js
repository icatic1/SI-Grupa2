import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, ButtonGroup, Button } from "react-bootstrap";

import FileCard from "./FileCard";


const FileList = () => {

    const createObjects = (data) => {

        var objects = [];
        data.images.forEach(image => {
            const chars = image.split('\\');
            const nameOfFile = chars[chars.length - 1].split('.');
            console.log(nameOfFile[0]);
            var obj = { path: image, name: nameOfFile[0], extension: nameOfFile[1] };
            console.log(obj);
            objects.push(obj);
        });
        data.videos.forEach(video => {
            const chars = video.split('\\');
            const nameOfFile = chars[chars.length - 1].split('.');
            console.log(nameOfFile[0]);
            var obj = { path: video, name: nameOfFile[0], extension: nameOfFile[1] };
            objects.push(obj);

        });
        data.folders.forEach(folder  => {
            const chars = folder.split('\\');
            const nameOfFile = chars[chars.length - 1].split('.');
            console.log(nameOfFile[0]);
            var obj = { path: folder, name: nameOfFile[0], extension: "folder" };
            objects.push(obj);
        });
        setFilesAndFolders(objects);

    }
    const [filesAndFolders, setFilesAndFolders] = useState();

    useEffect(() => {
        const fetchMain = async () => {
            try {

                const response1 = await fetch('/api/FileUpload/GetFilesByPathSorted/adresa1%5Cadresa2',
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });


                console.log(response1);
                var data1 = await response1.json();
                console.log(data1);
                createObjects(data1);
                //const chars = data1[0].split('\\');
                //const nameOfFile = chars[chars.length - 1].split('.');
                //console.log(nameOfFile[0]);
                //var obj = [{ ppath: data1[0], name: nameOfFile[0], type: nameOfFile[1] }];
                //setfiles(obj);

                //setfiles(data1);



            } catch (e) {
                console.log(e)
            }
        };

        fetchMain();
    }, []);


    return (
        <Container>
            {/*<Container>*/}
            {/*    <ButtonGroup aria-label="Basic example">*/}
            {/*        {folders?.map((f) => (*/}
            {/*            <Button variant="secondary">Test</Button>*/}
            {/*         ))}*/}
            {/*    </ButtonGroup>*/}
            {/*</Container>*/}
            
            <Container className="wrapper">
                {filesAndFolders?.map((f) => (
                    <FileCard key={f.name} file={f} />
                ))}
            </Container>
        </Container>
    );
};

export default FileList;