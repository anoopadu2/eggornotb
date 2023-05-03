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
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./config/firebase";
import { v4 } from "uuid";
import Axios from "axios";
import CryptoJS from "crypto-js";
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
  const [hasEgg, setHasEgg] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [showImageConfirm, setShowImageConfirm] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [showSamples, setShowSamples] = useState(true);

  const imagesListRef = ref(storage, "images/");
  const imageHashesRef = collection(db, "imageHashes");
  const MAX_IMAGES = 3;
  const fileInputRef = useRef(null);

  const uploadFile = async () => {
    if (imageUpload == null) return;

    // Calculate the file hash
    const fileHash = await calculateFileHash(imageUpload);

    // Check if the file hash exists in Firestore
    const firestoreData = await getFirestoreData(fileHash, 'hash');
    if (firestoreData) {
      // If the hash exists, use the existing image URL
      const existingImageUrl = firestoreData.url;
      setUploadedImageUrl(existingImageUrl);
      setDetectedText(firestoreData.textContent);
      setHasEgg(firestoreData.containsEgg);
      setShowImageConfirm(false);
    }
    else{
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          setUploadedImageUrl(url);
          const { detectedText, hasEgg } = await getTextFromImage(url);
          setDetectedText(detectedText);
          setHasEgg(hasEgg);
          setShowImageConfirm(false); // Hide the ImageConfirm component after uploading the image

          // Update the docData object after updating the hasEgg and detectedText states
          const docData = { hash: fileHash, url, containsEgg: hasEgg, textContent: detectedText };
          // Add the file hash and download URL to Firestore
          await addDoc(imageHashesRef, docData);
        });
      });
    }
  };

  const getFirestoreData = async (value, queryType) => {
    let q;

    // Construct the query based on the queryType
    if (queryType === 'url') {
      q = query(imageHashesRef, where("url", "==", value));
    } else if (queryType === 'hash') {
      q = query(imageHashesRef, where("hash", "==", value));
    }
    const querySnapshot = await getDocs(q);
  
    // If the value exists in Firestore, return the containsEgg and textContent values
    if (!querySnapshot.empty) {
      const containsEgg = querySnapshot.docs[0].data().containsEgg;
      const textContent = querySnapshot.docs[0].data().textContent;
      const url = querySnapshot.docs[0].data().url;
      return { containsEgg, textContent, url };
    }
  
    return null;
  };  

  const getTextFromImage = async (imageUrl) => {
    const apiKey = import.meta.env.VITE_VISION_API_KEY;
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
      const text = detections[0].description;
      const containsEgg = text.toLowerCase().includes("egg");
      
      return { detectedText: text, hasEgg: containsEgg };
    } catch (error) {
      console.error("Error detecting text:", error);
    }
  };

  const calculateFileHash = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
        const hash = CryptoJS.SHA256(wordArray).toString();
        resolve(hash);
      };
      reader.readAsArrayBuffer(file);
    });
  };  

  const handleChooseFileClick =  () => {
    fileInputRef.current.click();
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

    // Call getFirestoreData to check if the sample image data exists in Firestore
    const firestoreData = await getFirestoreData(url, 'url');

    if (firestoreData) {
      // If the imageUrl exists in Firestore, set the hasEgg and detectedText states using the returned data
      setHasEgg(firestoreData.containsEgg);
      setDetectedText(firestoreData.textContent);
    }  else {
      // If the imageUrl doesn't exist in Firestore, call getTextFromImage
      const { detectedText, hasEgg } = await getTextFromImage(url);
      setDetectedText(detectedText);
      setHasEgg(hasEgg);
    }

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
      .then((urls) => setImageUrls(urls))
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, [detectedText, showImageConfirm, showSamples, hasEgg]);

  return (
    <div className="App">
      <MemoizedHeader />
      {/* Conditionally render ImageUpload or ImageConfirm or ImageText components */}
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
          hasEgg={hasEgg}
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
              onClick={() => handleSampleImageClick(url)}
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