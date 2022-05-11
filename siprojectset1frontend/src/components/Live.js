////const [imgSrc, setImgSrc] = useState();


////useEffect(() => {
////    setInterval(() => {
////        getImage().then(image => {
////            setImgSrc("data:image/png;base64, " + image);
////        });
////    }, 32)

////}, []);





////async function getImage() {
////    const response1 = await fetch('/api/FileUpload/GetLiveFile' + "/" + "Test", {
////        method: 'GET',
////        headers: {
////            'Content-Type': 'text/plain;charset=UTF-8'
////        }
////    });

////    if (!response1.ok) return null
////    const resp = await response1;
////    const result = resp.text();

////    return result;
////}

//return (
//    <img src={imgSrc} />
//    )