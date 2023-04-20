import "./App.css";
import { useState, useEffect, useRef } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "./config/firebase";
import { v4 } from "uuid";
import Axios from "axios";
import ImageUpload from "./components/ImageUpload";
import ImageText from "./components/ImageText";

function App() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [detectedText, setDetectedText] = useState(null);
  const imagesListRef = ref(storage, "images/");
  const MAX_IMAGES = 3;
  const fileInputRef = useRef(null);

  const getTextFromImage = async (imageUrl) => {
    const apiKey = "";
    const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  
    const requestPayload = {
      requests: [
        {
          image: {
            source: {
              imageUri: imageUrl,
            },
          },
          features: [
            {
              type: "TEXT_DETECTION",
            },
          ],
        },
      ],
    };
  
    try {
      const response = await Axios.post(apiUrl, requestPayload);
      const detections = response.data.responses[0].textAnnotations;
      console.log("Text Detections:");
      console.log(detections[0].description);
      setDetectedText(detections[0].description);
    } catch (error) {
      console.error("Error detecting text:", error);
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current.click();
  };

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        setImageUrls((prev) => [...prev, url]);
        await getTextFromImage(url);
      });
    });
  };

  const handleFileChange = (event) => {
    setImageUpload(event.target.files[0]);
  };

  useEffect(() => {
    listAll(imagesListRef)
      .then((response) =>
        Promise.all(
          response.items.slice(0, MAX_IMAGES).map((item) => getDownloadURL(item))
        )
      )
      .then((urls) => setImageUrls(urls));
  }, []);

  return (
    <div className="App">
      {/* Conditionally render ImageUpload or ImageText components */}
      {detectedText === null ? (
        <ImageUpload
          onFileChange={handleFileChange}
          onChooseFileClick={handleChooseFileClick}
          onUploadFile={uploadFile}
          fileInputRef={fileInputRef} // Pass the ref to ImageUpload component
        />
      ) : (
        <ImageText text={detectedText} />
      )}

      <h1> or try some samples...</h1>
      <div className="image-container">
        {imageUrls.map((url) => {
          return <img key={url} src={url} alt="uploaded image" />;
        })}
      </div>
    </div>
  );
}

export default App;