import "./App.css";
import React, { memo } from "react";
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
import ImageConfirm from './components/ImageConfirm';

const Header = () => {
  return (
    <h1>
      All we need is a picture{" "}
      <span role="img" aria-label="heart">
        ❤️
      </span>
    </h1>
  );
};

const MemoizedHeader = memo(Header);

function App() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [detectedText, setDetectedText] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [showImageConfirm, setShowImageConfirm] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [showSamples, setShowSamples] = useState(true);

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

  const handleChooseFileClick =  () => {
    fileInputRef.current.click();
    //setShowSamples(false); // Hide the samples while processing the image
  };

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        //setImageUrls((prev) => [...prev, url]);
        setUploadedImageUrl(url);
        await getTextFromImage(url);
        setShowImageConfirm(false); // Hide the ImageConfirm component after uploading the image
      });
    });
  };

  const handleGoBackClick = () => {
    setShowImageConfirm(false);
    setShowSamples(true);
  };  

  const handleFileChange = (event) => {
    setImageUpload(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImageUrl(e.target.result);
      setShowImageConfirm(true);
      setShowSamples(false); // Hide the ImageConfirm component after uploading the image
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  

  const resetDetection = () => {
    setDetectedText(null);
    setUploadedImageUrl(null); // Reset the URL of the uploaded image
    setShowSamples(true); // Show the samples again
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
  }, [detectedText, showImageConfirm, showSamples]);

  return (
    <div className="App">
      {/* <h1>
      All we need is a picture{" "}
      <span role="img" aria-label="heart">
        ❤️
      </span>
      </h1> /* }
      {/* Conditionally render ImageUpload or ImageConfirm or ImageText components */}
      <MemoizedHeader />
      {detectedText === null && !showImageConfirm ? (
        <ImageUpload
          onFileChange={handleFileChange}
          onChooseFileClick={handleChooseFileClick}
          onUploadFile={uploadFile}
          fileInputRef={fileInputRef} // Pass the ref to ImageUpload component
        />
      ) : detectedText === null && showImageConfirm ? (
        <ImageConfirm
          onTryImage={uploadFile}
          onGoBack={handleGoBackClick}
          previewImage={previewImageUrl}
        />
      ) : (
        <ImageText
          text={detectedText}
          onResetDetection={resetDetection}
          uploadedImageUrl={uploadedImageUrl} // Pass the uploaded image URL to ImageText component
        />
      )}

       {/* Render the samples only when the ImageUpload component is displayed and showSamples is true */}
      {detectedText === null && showSamples && (
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