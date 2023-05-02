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
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const imagesListRef = ref(storage, "images/");
  const MAX_IMAGES = 3;
  const fileInputRef = useRef(null);

  const getTextFromImage = async (imageUrl) => {
    const apiKey = `${import.meta.env.VITE_VISION_API_KEY}`;
    const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  
    const visionPayload = {
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
      const response = await Axios.post(apiUrl, visionPayload);
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
        //setImageUrls((prev) => [...prev, url]);
        setUploadedImageUrl(url);
        await getTextFromImage(url);
      });
    });
  };

  const handleFileChange = (event) => {
    setImageUpload(event.target.files[0]);
  };

  const resetDetection = () => {
    setDetectedText(null);
    setUploadedImageUrl(null); // Reset the URL of the uploaded image
  };

  const handleSampleImageClick = async (url) => {
    // Reset the detected text and uploaded image URL before processing a new image
    resetDetection();

    // Call getTextFromImage to detect the text and check for the word "egg"
    await getTextFromImage(url);

    // Update the uploaded image URL state with the sample image URL
    setUploadedImageUrl(url);
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
      <h1>
      All we need is a picture{" "}
      <span role="img" aria-label="heart">
        ❤️
      </span>
      </h1>
      {/* Conditionally render ImageUpload or ImageText components */}
      {detectedText === null ? (
        <ImageUpload
          onFileChange={handleFileChange}
          onChooseFileClick={handleChooseFileClick}
          onUploadFile={uploadFile}
          fileInputRef={fileInputRef} // Pass the ref to ImageUpload component
        />
      ) : (
        <ImageText
          text={detectedText}
          onResetDetection={resetDetection}
          uploadedImageUrl={uploadedImageUrl} // Pass the uploaded image URL to ImageText component
        />
      )}

      {/* Render the samples only when the ImageUpload component is displayed */}
      {detectedText === null && (
        <>
          <h1> or try some samples...</h1>
          <div className="image-container">
            {imageUrls.map((url) => {
              return <img
              key={url}
              src={url}
              alt="uploaded image"
              onClick={() => handleSampleImageClick(url)} // Add onClick event listener to the sample images
              className="sample-image"
            />;
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default App;