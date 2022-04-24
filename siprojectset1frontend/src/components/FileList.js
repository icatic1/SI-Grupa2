import React, { useEffect, useState, useRef  } from 'react';
import { Container, Row, Col, Spinner, ButtonGroup, Button } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';

import FileCard from "./FileCard";


const FileList = () => {

    var { state } = useLocation();

    const createObjects = (data) => {

        var objects = [];
        data.images.forEach(image => {
            const chars = image.split('\\');
            var croppedPath = "";

            for (let i = 0; i < chars.length; i++) {
                if (chars[i] == "wwwroot") {
                    for (let j = i + 1; j < chars.length; j++) {
                        croppedPath = croppedPath + "%5C" + chars[j];
                    }
                    break;
                }
            };

            console.log(croppedPath);

            const nameOfFile = chars[chars.length - 1].split('.');
            console.log(nameOfFile[0]);
            var obj = { path: image, name: nameOfFile[0], extension: nameOfFile[1], cropped: croppedPath };
            console.log(obj);
            objects.push(obj);
        });
        data.videos.forEach(video => {
            const chars = video.split('\\');
            var croppedPath = "";

            for (let i = 0; i < chars.length; i++) {
                if (chars[i] == "wwwroot") {
                    for (let j = i + 1; j < chars.length; j++) {
                        croppedPath = croppedPath + "%5C" + chars[j];
                    }
                    break;
                }
            };

            console.log(croppedPath);

            const nameOfFile = chars[chars.length - 1].split('.');
            console.log(nameOfFile[0]);
            var obj = { path: video, name: nameOfFile[0], extension: nameOfFile[1], cropped: croppedPath };
            objects.push(obj);

        });
        data.folders.forEach(folder  => {
            const chars = folder.split('\\');
            var croppedPath = "";

            for (let i = 0; i < chars.length; i++) {
                if (chars[i] == "wwwroot") {
                    for (let j = i + 1; j < chars.length; j++) {
                        if (j == i + 1)
                            croppedPath = croppedPath + "/" + chars[j];
                        else 
                            croppedPath = croppedPath + "%5C" + chars[j];
                        
                    }
                    break;
                }
            };

            console.log(croppedPath);

            const nameOfFile = chars[chars.length - 1].split('.');
            console.log(nameOfFile[0]);
            var obj = { path: folder, name: nameOfFile[0], extension: "folder", cropped: croppedPath };
            objects.push(obj);
        });
        setFilesAndFolders(objects);

    }
    const [filesAndFolders, setFilesAndFolders] = useState();

    useEffect(() => {
        const fetchMain = async () => {
            try {

                if (state == null)
                    state = "test";


                const response1 = await fetch('/api/FileUpload/GetFilesByPathSorted/' + state + '%5C',
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });


                console.log(response1);
                var data1 = await response1.json();
                console.log(data1);
                createObjects(data1);

            } catch (e) {
                console.log(e)
            }
        };

        fetchMain();

    }, [state]);



    return (
        <Container>
            <Container className="wrapper">
                {filesAndFolders?.map((f) => (
                    <FileCard key={f.name} file={f} />
                ))}
            </Container>
        </Container>
    );
};

export default FileList;